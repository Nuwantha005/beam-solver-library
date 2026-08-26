import { Beam } from "../../src/objects/beam";
import { PinnedSupport } from "../../src/objects/supports/PinnedSupport";
import { RollerSupport } from "../../src/objects/supports/RollerSupport";
import { FixedSupport } from "../../src/objects/supports/FixedSupport";
import PointLoad from "../../src/objects/Forces/Loads/PointLoad";
import UniformlyDistributedLoad from "../../src/objects/Forces/Loads/UniformlyDistributedLoad";
import MomentLoad from "../../src/objects/Forces/Loads/MomentLoad";
import BeamAnalyzer from "../../src/solvers/BeamAnalyzer";

describe("BeamAnalyzer — Simply Supported Beam with Point Load and UDL", () => {
  let beam: Beam;

  beforeEach(() => {
    // L=10, pin at 0, roller at 10, UDL 2 kN/m on [0, 10], Point load 10 kN at x=5
    beam = new Beam(10, 200e9);
    beam.setSupports([new PinnedSupport(0), new RollerSupport(10)]);
    beam.addLoad(new UniformlyDistributedLoad(0, 10, 2));
    beam.addLoad(new PointLoad(10, 5));
  });

  it("should produce a complete AnalysisResult via beam.analyze()", () => {
    const result = beam.analyze({ samplesPerSegment: 10 });

    expect(result.beamLength).toBe(10);
    expect(result.eModulus).toBe(200e9);
    expect(result.isStaticallyDeterminate).toBe(true);
    expect(result.solveTimeMs).toBeGreaterThanOrEqual(0);

    // Reactions: Total load = 20 (UDL) + 10 (point) = 30 kN => R1 = R2 = 15 kN
    expect(result.reactions).toHaveLength(2);
    expect(result.reactions[0].fy).toBeCloseTo(15);
    expect(result.reactions[1].fy).toBeCloseTo(15);
  });

  it("should produce valid shear and moment diagrams with polynomial degrees", () => {
    const result = BeamAnalyzer.analyze(beam);

    // Events are 0, 5, 10 => 2 segments: [0, 5] and [5, 10]
    expect(result.shearDiagram.segments).toHaveLength(2);
    expect(result.momentDiagram.segments).toHaveLength(2);

    // Under UDL + point load: shear is degree 1 (linear), moment is degree 2 (quadratic)
    expect(result.shearDiagram.segments[0].polynomialDegree).toBe(1);
    expect(result.momentDiagram.segments[0].polynomialDegree).toBe(2);

    // Extrema
    expect(result.shearDiagram.max.value).toBeCloseTo(15);
    expect(result.shearDiagram.min.value).toBeCloseTo(-15);

    // Maximum moment at midspan x=5: wL^2/8 + PL/4 = 2*100/8 + 10*10/4 = 25 + 25 = 50 kNm
    expect(result.momentDiagram.max.value).toBeCloseTo(50);
    expect(result.momentDiagram.max.x).toBeCloseTo(5);
  });
});

describe("BeamAnalyzer — Cantilever Beam with Tip Load", () => {
  it("should produce correct reactions and linear diagrams", () => {
    const beam = new Beam(6);
    beam.setSupports([new FixedSupport(0)]);
    beam.addLoad(new PointLoad(20, 6));

    const result = beam.analyze();

    // Reaction at wall x=0: Fy = 20 kN, Moment = 120 kNm (ccw)
    expect(result.reactions).toHaveLength(1);
    expect(result.reactions[0].fy).toBeCloseTo(20);
    expect(result.reactions[0].moment).toBeCloseTo(120);

    // Segments: 1 segment [0, 6], shear degree 0, moment degree 1
    expect(result.shearDiagram.segments).toHaveLength(1);
    expect(result.shearDiagram.segments[0].polynomialDegree).toBe(0);
    expect(result.momentDiagram.segments[0].polynomialDegree).toBe(1);

    expect(result.shearDiagram.max.value).toBeCloseTo(20);
    expect(result.momentDiagram.min.value).toBeCloseTo(-120);
  });
});

describe("BeamAnalyzer — Discontinuity Detection", () => {
  it("should tag discontinuity at concentrated point load", () => {
    const beam = new Beam(10);
    beam.setSupports([new PinnedSupport(0), new RollerSupport(10)]);
    beam.addLoad(new PointLoad(30, 4));

    const result = beam.analyze();

    // Point load at x=4 causes discontinuity in shear
    const discPoint = result.shearDiagram.points.find(
      (p) => p.isDiscontinuity && Math.abs(p.x - 4) < 1e-4
    );
    expect(discPoint).toBeDefined();
    expect(discPoint?.leftLimit).toBeCloseTo(18); // R1 = 30 * 6 / 10 = 18
    expect(discPoint?.rightLimit).toBeCloseTo(-12); // 18 - 30 = -12
  });
});
