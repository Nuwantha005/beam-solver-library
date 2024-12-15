import { describe } from "node:test";
import { Beam } from "../../src/objects/beam";
import { RectangleCrossSection } from "../../src/objects/crossSections/RectCross";
import { CrossSectionType } from "../../src/objects/crossSections/CrossSection";
import { CustomSection } from "../../src/objects/crossSections/CustomSection";
import { ISection } from "../../src/objects/crossSections/ISection";
import { CircularCrossSection } from "../../src/objects/crossSections/CircCrossSection";

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
});

describe("Beam - cross section tests", () => {
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
