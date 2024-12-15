"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const beam_1 = require("../../src/objects/beam");
const CrossSection_1 = require("../../src/objects/crossSections/CrossSection");
const CustomSection_1 = require("../../src/objects/crossSections/CustomSection");
const ISection_1 = require("../../src/objects/crossSections/ISection");
const CircCrossSection_1 = require("../../src/objects/crossSections/CircCrossSection");
(0, node_test_1.describe)("Beam - base class tests", () => {
    test("Length getter should return the correct value", () => {
        const beam = new beam_1.Beam(10);
        expect(beam.Length).toBe(10);
    });
    test("Length setter should update the length", () => {
        const beam = new beam_1.Beam(10);
        beam.Length = 15;
        expect(beam.Length).toBe(15);
    });
    test("Setting negative length should throw an error", () => {
        const beam = new beam_1.Beam(10);
        expect(() => {
            beam.Length = -5;
        }).toThrow("Length must be positive.");
    });
    test("EModulus getter should return the correct value", () => {
        const beam = new beam_1.Beam(10, 100);
        expect(beam.EModulus).toBe(100);
    });
    test("EModulus setter should update the EModulus", () => {
        const beam = new beam_1.Beam(10, 100);
        beam.EModulus = 200;
        expect(beam.EModulus).toBe(200);
    });
});
(0, node_test_1.describe)("Beam: cross section tests", () => {
    test("Custom cross section should be set correctly", () => {
        const beam = new beam_1.Beam(10, 100);
        const customSection = new CustomSection_1.CustomSection(20, 30, 40);
        beam.crossSection = customSection;
        expect(beam.crossSection.sectionType).toBe(CrossSection_1.CrossSectionType.Custom);
    });
    test("ISection cross section should be set correctly", () => {
        const beam = new beam_1.Beam(10, 100);
        const iSection = new ISection_1.ISection(10, 20, 2, 1);
        beam.crossSection = iSection;
        expect(beam.crossSection.sectionType).toBe(CrossSection_1.CrossSectionType.ISection);
    });
    test("Circular cross section should be set correctly", () => {
        const beam = new beam_1.Beam(10, 100);
        const circularSection = new CircCrossSection_1.CircularCrossSection(5);
        beam.crossSection = circularSection;
        expect(beam.crossSection.sectionType).toBe(CrossSection_1.CrossSectionType.Circular);
    });
});
