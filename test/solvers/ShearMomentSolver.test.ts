import { Beam } from "../../src/objects/beam";
import { PinnedSupport } from "../../src/objects/supports/PinnedSupport";
import { RollerSupport } from "../../src/objects/supports/RollerSupport";
import { FixedSupport } from "../../src/objects/supports/FixedSupport";
import PointLoad from "../../src/objects/Forces/Loads/PointLoad";
import UniformlyDistributedLoad from "../../src/objects/Forces/Loads/UniformlyDistributedLoad";
import TaperzoidLoad from "../../src/objects/Forces/Loads/TaperzoidLoad";
import MomentLoad from "../../src/objects/Forces/Loads/MomentLoad";
import ShearMomentSolver from "../../src/solvers/ShearMomentSolver";

describe("ShearMomentSolver — Simply Supported Beam with Midspan Point Load", () => {
  let beam: Beam;
  let solver: ShearMomentSolver;

  beforeEach(() => {
    // L=10, P=20 kN downward at x=5
    beam = new Beam(10);
    beam.setSupports([new PinnedSupport(0), new RollerSupport(10)]);
    beam.addLoad(new PointLoad(20, 5));
    solver = new ShearMomentSolver(beam);
  });

  it("should evaluate shear force with discontinuity at load", () => {
    expect(solver.getShearAt(0, "right")).toBeCloseTo(10);
    expect(solver.getShearAt(2.5)).toBeCloseTo(10);
    expect(solver.getShearAt(5, "left")).toBeCloseTo(10);
    expect(solver.getShearAt(5, "right")).toBeCloseTo(-10);
    expect(solver.getShearAt(7.5)).toBeCloseTo(-10);
    expect(solver.getShearAt(10, "left")).toBeCloseTo(-10);
  });

  it("should evaluate bending moment along the span", () => {
    expect(solver.getMomentAt(0)).toBeCloseTo(0);
    expect(solver.getMomentAt(2.5)).toBeCloseTo(25);
    expect(solver.getMomentAt(5)).toBeCloseTo(50); // Max moment PL/4 = 20*10/4 = 50
    expect(solver.getMomentAt(7.5)).toBeCloseTo(25);
    expect(solver.getMomentAt(10)).toBeCloseTo(0);
  });

  it("should find zero-crossing and global extrema", () => {
    const maxV = solver.getMaxShear();
    expect(maxV.value).toBeCloseTo(10);

    const minV = solver.getMinShear();
    expect(minV.value).toBeCloseTo(-10);

    const maxM = solver.getMaxMoment();
    expect(maxM.value).toBeCloseTo(50);
    expect(maxM.x).toBeCloseTo(5);

    const crossings = solver.getZeroCrossings();
    expect(crossings.length).toBeGreaterThanOrEqual(1);
    expect(crossings[0]).toBeCloseTo(5);
  });
});

describe("ShearMomentSolver — Simply Supported Beam with Full UDL", () => {
  let beam: Beam;
  let solver: ShearMomentSolver;

  beforeEach(() => {
    // L=8, w=4 kN/m downward on [0, 8]
    beam = new Beam(8);
    beam.setSupports([new PinnedSupport(0), new RollerSupport(8)]);
    beam.addLoad(new UniformlyDistributedLoad(0, 8, 4));
    solver = new ShearMomentSolver(beam);
  });

  it("should evaluate linear shear force distribution", () => {
    expect(solver.getShearAt(0, "right")).toBeCloseTo(16);
    expect(solver.getShearAt(2)).toBeCloseTo(8);
    expect(solver.getShearAt(4)).toBeCloseTo(0);
    expect(solver.getShearAt(6)).toBeCloseTo(-8);
    expect(solver.getShearAt(8, "left")).toBeCloseTo(-16);
  });

  it("should evaluate parabolic bending moment distribution", () => {
    expect(solver.getMomentAt(0)).toBeCloseTo(0);
    expect(solver.getMomentAt(2)).toBeCloseTo(24);
    expect(solver.getMomentAt(4)).toBeCloseTo(32); // wL^2/8 = 4*64/8 = 32
    expect(solver.getMomentAt(6)).toBeCloseTo(24);
    expect(solver.getMomentAt(8)).toBeCloseTo(0);
  });

  it("should detect exact zero-crossing at midspan x=4", () => {
    const crossings = solver.getZeroCrossings();
    expect(crossings).toHaveLength(1);
    expect(crossings[0]).toBeCloseTo(4);

    const maxM = solver.getMaxMoment();
    expect(maxM.x).toBeCloseTo(4);
    expect(maxM.value).toBeCloseTo(32);
  });
});

describe("ShearMomentSolver — Cantilever Beams", () => {
  it("should solve cantilever with tip load (L=5, P=12 at x=5, fixed at x=0)", () => {
    const beam = new Beam(5);
    beam.setSupports([new FixedSupport(0)]);
    beam.addLoad(new PointLoad(12, 5));
    const solver = new ShearMomentSolver(beam);

    // Constant positive shear V(x) = +12
    expect(solver.getShearAt(0, "right")).toBeCloseTo(12);
    expect(solver.getShearAt(2.5)).toBeCloseTo(12);
    expect(solver.getShearAt(5, "left")).toBeCloseTo(12);

    // Linear hogging bending moment M(x) = -PL + Px = -60 + 12x
    expect(solver.getMomentAt(0)).toBeCloseTo(-60);
    expect(solver.getMomentAt(2.5)).toBeCloseTo(-30);
    expect(solver.getMomentAt(5)).toBeCloseTo(0);
  });

  it("should solve cantilever with full UDL (L=4, w=3 kN/m, fixed at x=0)", () => {
    const beam = new Beam(4);
    beam.setSupports([new FixedSupport(0)]);
    beam.addLoad(new UniformlyDistributedLoad(0, 4, 3));
    const solver = new ShearMomentSolver(beam);

    // Shear: V(0) = 12, V(4) = 0
    expect(solver.getShearAt(0, "right")).toBeCloseTo(12);
    expect(solver.getShearAt(2)).toBeCloseTo(6);
    expect(solver.getShearAt(4)).toBeCloseTo(0);

    // Moment: M(0) = -24, M(2) = -6, M(4) = 0
    expect(solver.getMomentAt(0)).toBeCloseTo(-24);
    expect(solver.getMomentAt(2)).toBeCloseTo(-6);
    expect(solver.getMomentAt(4)).toBeCloseTo(0);
  });
});

describe("ShearMomentSolver — Applied Concentrated Moment Step Discontinuity", () => {
  it("should show step jump in BMD at concentrated couple location", () => {
    // L=10, pin at 0, roller at 10, CCW moment = 50 kNm at x=5
    const beam = new Beam(10);
    beam.setSupports([new PinnedSupport(0), new RollerSupport(10)]);
    beam.addLoad(new MomentLoad(50, "ccw", 5));
    const solver = new ShearMomentSolver(beam);

    // Constant shear V = +5 kN
    expect(solver.getShearAt(2)).toBeCloseTo(5);
    expect(solver.getShearAt(8)).toBeCloseTo(5);

    // Moment before x=5: M(5^-) = +5 * 5 = +25 kNm
    expect(solver.getMomentAt(5, "left")).toBeCloseTo(25);
    // Moment after x=5: M(5^+) = +25 - 50 = -25 kNm (jump of -50)
    expect(solver.getMomentAt(5, "right")).toBeCloseTo(-25);
    // Moment at supports: M(0) = 0, M(10) = 0
    expect(solver.getMomentAt(0)).toBeCloseTo(0);
    expect(solver.getMomentAt(10)).toBeCloseTo(0);
  });
});

describe("ShearMomentSolver — Triangular Distributed Load", () => {
  it("should find zero-crossing and maximum moment for triangular load", () => {
    // L=6, w=0 to 6 kN/m on [0, 6]
    const beam = new Beam(6);
    beam.setSupports([new PinnedSupport(0), new RollerSupport(6)]);
    beam.addLoad(new TaperzoidLoad(0, 6, 0, 6));
    const solver = new ShearMomentSolver(beam);

    // Reactions: R1 = 6, R2 = 12
    // V(x) = 6 - 0.5 x^2 = 0 => x = sqrt(12) ≈ 3.4641 m
    const crossings = solver.getZeroCrossings();
    expect(crossings).toHaveLength(1);
    expect(crossings[0]).toBeCloseTo(Math.sqrt(12), 0.01);

    // Max moment at x = sqrt(12): M ≈ 13.856 kNm
    const maxM = solver.getMaxMoment();
    expect(maxM.x).toBeCloseTo(Math.sqrt(12), 0.01);
    expect(maxM.value).toBeCloseTo(13.856, 0.01);
  });
});
