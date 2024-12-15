import { describe } from "node:test";
import { Beam } from "../../src/objects/beam";
import { RectangleCrossSection } from "../../src/objects/crossSections/RectCross";
import { CrossSectionType } from "../../src/objects/crossSections/CrossSection";
import { CustomSection } from "../../src/objects/crossSections/CustomSection";
import { ISection } from "../../src/objects/crossSections/ISection";
import { CircularCrossSection } from "../../src/objects/crossSections/CircCrossSection";
import { SimpleForce } from "../../src";
import { PinnedSupport } from "../../src";

/*
###############################################
            Base Class Testing
###############################################
*/

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

  test("Setting negative length should throw an error", () => {
    const beam = new Beam(10);
    expect(() => {
      beam.Length = -5;
    }).toThrow("Length must be positive.");
  });

  test("EModulus getter should return the correct value", () => {
    const beam = new Beam(10, 100);
    expect(beam.EModulus).toBe(100);
  });

  test("EModulus setter should update the EModulus", () => {
    const beam = new Beam(10, 100);
    beam.EModulus = 200;
    expect(beam.EModulus).toBe(200);
  });

  test("Setting negative EModulus should throw an error", () => {
    const beam = new Beam(10, 100);
    expect(() => {
      beam.EModulus = -100;
    }).toThrow("EModulus must be positive.");
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

  test("Length setter should update the length", () => {
    const beam = new Beam(10);
    beam.Length = 15;
    expect(beam.Length).toBe(15);
  });

  test("Setting negative length should throw an error", () => {
    const beam = new Beam(10);
    expect(() => {
      beam.Length = -5;
    }).toThrow("Length must be positive.");
  });

  test("EModulus getter should return the correct value", () => {
    const beam = new Beam(10, 100);
    expect(beam.EModulus).toBe(100);
  });

  test("EModulus setter should update the EModulus", () => {
    const beam = new Beam(10, 100);
    beam.EModulus = 200;
    expect(beam.EModulus).toBe(200);
  });
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
});

/*
###############################################
            Forces Testing
###############################################
*/
describe("Beam: force tests", () => {
  let beam: Beam;
  beforeEach(() => {
    beam = new Beam(10, 100);
  });

  test("Adding a force should store it in the beam", () => {
    const force = new SimpleForce(50, "up", 5);
    beam.addForce(force);
    expect(beam.getForces()).toContain(force);
  });

  test("Setting forces should replace existing forces", () => {
    const force1 = new SimpleForce(50, "up", 5);
    const force2 = new SimpleForce(30, "down", 7);
    beam.setForces([force1, force2]);
    expect(beam.getForces()).toEqual([force1, force2]);
  });

  test("Getting forces should return all added forces", () => {
    const force1 = new SimpleForce(50, "up", 5);
    const force2 = new SimpleForce(30, "down", 7);
    beam.addForce(force1);
    beam.addForce(force2);
    expect(beam.getForces()).toEqual([force1, force2]);
  });

  test("Removing forces should clear all forces", () => {
    const force = new SimpleForce(50, "up", 5);
    beam.addForce(force);
    beam.removeForces();
    expect(beam.getForces()).toEqual([]);
  });
});

/*
###############################################
            Supports Testing
###############################################
*/
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

  test("Getting supports should return all added supports", () => {
    const anotherPinnedSupport = new PinnedSupport(7);
    beam.addSupport(pinnedSupport);
    beam.addSupport(anotherPinnedSupport);
    expect(beam.getSupports()).toEqual([pinnedSupport, anotherPinnedSupport]);
  });

  test("Removing supports should clear all supports", () => {
    beam.addSupport(pinnedSupport);
    beam.removeSupports();
    expect(beam.getSupports()).toEqual([]);
  });
});
