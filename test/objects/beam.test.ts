import { Beam } from "../../src/objects/beam";
import { RectangleCrossSection } from "../../src/objects/crossSections/RectCross";
import { CrossSectionType } from "../../src/objects/crossSections/CrossSection";
import { CustomSection } from "../../src/objects/crossSections/CustomSection";
import { ISection } from "../../src/objects/crossSections/ISection";
import { CircularCrossSection } from "../../src/objects/crossSections/CircCrossSection";
import { SimpleForce } from "../../src";
import { PinnedSupport } from "../../src";
import { RollerSupport } from "../../src";
import { FixedSupport } from "../../src";
import { BeamType } from "../../src/objects/beam";
import PointLoad from "../../src/objects/Forces/Loads/PointLoad";
import UniformlyDistributedLoad from "../../src/objects/Forces/Loads/UniformlyDistributedLoad";
import MomentLoad from "../../src/objects/Forces/Loads/MomentLoad";
import { InvalidGeometryError } from "../../src/errors/BeamErrors";

describe("Beam - base class tests", () => {
  test("Length getter should return the correct value", () => {
    const beam = new Beam(10);
    expect(beam.Length).toBe(10);
  });

  test("Length setter should update the length", () => {
    const beam = new Beam(10);
    beam.Length = 15;
    expect(beam.Length).toBe(15);
  });

  test("Setting negative or zero length should throw InvalidGeometryError", () => {
    expect(() => new Beam(0)).toThrow(InvalidGeometryError);
    expect(() => new Beam(-5)).toThrow(InvalidGeometryError);
    const beam = new Beam(10);
    expect(() => {
      beam.Length = -5;
    }).toThrow(InvalidGeometryError);
  });

  test("EModulus getter and setter should operate correctly", () => {
    const beam = new Beam(10, 100);
    expect(beam.EModulus).toBe(100);
    beam.EModulus = 200;
    expect(beam.EModulus).toBe(200);
  });

  test("Setting negative EModulus should throw InvalidGeometryError", () => {
    const beam = new Beam(10, 100);
    expect(() => {
      beam.EModulus = -100;
    }).toThrow(InvalidGeometryError);
  });

  describe("Beam: cross section tests", () => {
    test("Custom cross section should be set correctly", () => {
      const beam = new Beam(10, 100);
      const customSection = new CustomSection(20, 30, 40);
      beam.crossSection = customSection;
      expect(beam.crossSection.sectionType).toBe(CrossSectionType.Custom);
    });

    test("ISection cross section should be set correctly", () => {
      const beam = new Beam(10, 100);
      const iSection = new ISection(10, 20, 2, 1);
      beam.crossSection = iSection;
      expect(beam.crossSection.sectionType).toBe(CrossSectionType.ISection);
    });

    test("Circular cross section should be set correctly", () => {
      const beam = new Beam(10, 100);
      const circularSection = new CircularCrossSection(5);
      beam.crossSection = circularSection;
      expect(beam.crossSection.sectionType).toBe(CrossSectionType.Circular);
    });

    test("Rectangle cross section should be set correctly", () => {
      const beam = new Beam(10, 100);
      const rectangleSection = new RectangleCrossSection(10, 20);
      beam.crossSection = rectangleSection;
      expect(beam.crossSection.sectionType).toBe(CrossSectionType.Rectangle);
    });
  });
});

describe("Beam: unified load tests", () => {
  let beam: Beam;

  beforeEach(() => {
    beam = new Beam(10, 100);
  });

  test("Adding diverse load types into Beam", () => {
    const pointLoad = new PointLoad(20, 3);
    const udl = new UniformlyDistributedLoad(4, 8, 10);
    const moment = new MomentLoad(15, "ccw", 2);

    beam.addLoad(pointLoad);
    beam.addLoad(udl);
    beam.addLoad(moment);

    expect(beam.getLoads()).toHaveLength(3);
    expect(beam.getPointLoads()).toEqual([pointLoad]);
    expect(beam.getDistributedLoads()).toEqual([udl]);
    expect(beam.getAppliedMoments()).toEqual([moment]);
  });

  test("Setting loads replaces existing loads", () => {
    const p1 = new PointLoad(10, 2);
    const p2 = new PointLoad(20, 5);
    beam.setLoads([p1, p2]);
    expect(beam.getLoads()).toEqual([p1, p2]);
  });

  test("Boundary validation throws InvalidGeometryError for out-of-bounds loads", () => {
    expect(() => beam.addLoad(new PointLoad(10, -1))).toThrow(
      InvalidGeometryError
    );
    expect(() => beam.addLoad(new PointLoad(10, 12))).toThrow(
      InvalidGeometryError
    );
    expect(() => beam.addLoad(new UniformlyDistributedLoad(2, 15, 5))).toThrow(
      InvalidGeometryError
    );
    expect(() => beam.addLoad(new UniformlyDistributedLoad(6, 4, 5))).toThrow(
      InvalidGeometryError
    );
  });

  test("Backwards compatibility for forces methods", () => {
    const force = new SimpleForce(50, "up", 5);
    beam.addForce(force);
    expect(beam.getForces()).toContain(force);

    beam.removeForces();
    expect(beam.getForces()).toEqual([]);
  });
});

describe("Beam: support tests", () => {
  let beam: Beam;
  let pinnedSupport: PinnedSupport;

  beforeEach(() => {
    beam = new Beam(10, 100);
    pinnedSupport = new PinnedSupport(5);
  });

  test("Adding a pinned support should store it in the beam", () => {
    beam.addSupport(pinnedSupport);
    expect(beam.getSupports()).toContain(pinnedSupport);
  });

  test("Setting supports should replace existing supports", () => {
    const anotherPinnedSupport = new PinnedSupport(7);
    beam.setSupports([pinnedSupport, anotherPinnedSupport]);
    expect(beam.getSupports()).toEqual([pinnedSupport, anotherPinnedSupport]);
  });

  test("Removing supports should clear all supports", () => {
    beam.addSupport(pinnedSupport);
    beam.removeSupports();
    expect(beam.getSupports()).toEqual([]);
  });

  test("Out-of-bounds support throws InvalidGeometryError", () => {
    expect(() => beam.addSupport(new PinnedSupport(-1))).toThrow(
      InvalidGeometryError
    );
    expect(() => beam.addSupport(new PinnedSupport(12))).toThrow(
      InvalidGeometryError
    );
  });

  test("Testing for beamType -> Simply Supported", () => {
    beam = new Beam(10);
    const startSupport = new PinnedSupport(0);
    const endSupport = new PinnedSupport(10);

    beam.setSupports([startSupport, endSupport]);
    expect(beam.BeamType).toBe(BeamType.SIMPLY_SUPPORTED);
  });

  test("Testing for beamType -> Roller Supported", () => {
    beam = new Beam(10);
    const startSupport = new PinnedSupport(0);
    const endSupport = new RollerSupport(10);

    beam.setSupports([startSupport, endSupport]);
    expect(beam.BeamType).toBe(BeamType.ROLLER_SUPPORTED);
  });

  test("Testing for beamType -> Cantilever", () => {
    beam = new Beam(10);
    const fixedSupport = new FixedSupport(0);
    beam.setSupports([fixedSupport]);
    expect(beam.BeamType).toBe(BeamType.CANTELIVER);
  });

  test("Testing for beamType -> Continuous", () => {
    beam = new Beam(10);
    const startSupport = new PinnedSupport(0);
    const midSupport = new PinnedSupport(5);
    const endSupport = new PinnedSupport(10);

    beam.setSupports([startSupport, midSupport, endSupport]);
    expect(beam.BeamType).toBe(BeamType.CONTINUOUS);
  });
});
