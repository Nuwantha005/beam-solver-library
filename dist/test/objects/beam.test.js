"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const beam_1 = require("../../src/objects/beam");
const RectCross_1 = require("../../src/objects/crossSections/RectCross");
const CrossSection_1 = require("../../src/objects/crossSections/CrossSection");
const CustomSection_1 = require("../../src/objects/crossSections/CustomSection");
const ISection_1 = require("../../src/objects/crossSections/ISection");
const CircCrossSection_1 = require("../../src/objects/crossSections/CircCrossSection");
const src_1 = require("../../src");
const src_2 = require("../../src");
const beam_2 = require("../../src/objects/beam");
/*
###############################################
            Base Class Testing
###############################################
*/
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
    test("Setting negative EModulus should throw an error", () => {
        const beam = new beam_1.Beam(10, 100);
        expect(() => {
            beam.EModulus = -100;
        }).toThrow("EModulus must be positive.");
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
        test("Rectangle cross section should be set correctly", () => {
            const beam = new beam_1.Beam(10, 100);
            const rectangleSection = new RectCross_1.RectangleCrossSection(10, 20);
            beam.crossSection = rectangleSection;
            expect(beam.crossSection.sectionType).toBe(CrossSection_1.CrossSectionType.Rectangle);
        });
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
/*
###############################################
            Forces Testing
###############################################
*/
(0, node_test_1.describe)("Beam: force tests", () => {
    let beam;
    beforeEach(() => {
        beam = new beam_1.Beam(10, 100);
    });
    test("Adding a force should store it in the beam", () => {
        const force = new src_1.SimpleForce(50, "up", 5);
        beam.addForce(force);
        expect(beam.getForces()).toContain(force);
    });
    test("Setting forces should replace existing forces", () => {
        const force1 = new src_1.SimpleForce(50, "up", 5);
        const force2 = new src_1.SimpleForce(30, "down", 7);
        beam.setForces([force1, force2]);
        expect(beam.getForces()).toEqual([force1, force2]);
    });
    test("Getting forces should return all added forces", () => {
        const force1 = new src_1.SimpleForce(50, "up", 5);
        const force2 = new src_1.SimpleForce(30, "down", 7);
        beam.addForce(force1);
        beam.addForce(force2);
        expect(beam.getForces()).toEqual([force1, force2]);
    });
    test("Removing forces should clear all forces", () => {
        const force = new src_1.SimpleForce(50, "up", 5);
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
(0, node_test_1.describe)("Beam: support tests", () => {
    let beam;
    let pinnedSupport;
    beforeEach(() => {
        beam = new beam_1.Beam(10, 100);
        pinnedSupport = new src_2.PinnedSupport(5);
    });
    test("Adding a pinned support should store it in the beam", () => {
        beam.addSupport(pinnedSupport);
        expect(beam.getSupports()).toContain(pinnedSupport);
    });
    test("Setting supports should replace existing supports", () => {
        const anotherPinnedSupport = new src_2.PinnedSupport(7);
        beam.setSupports([pinnedSupport, anotherPinnedSupport]);
        expect(beam.getSupports()).toEqual([pinnedSupport, anotherPinnedSupport]);
    });
    test("Getting supports should return all added supports", () => {
        const anotherPinnedSupport = new src_2.PinnedSupport(7);
        beam.addSupport(pinnedSupport);
        beam.addSupport(anotherPinnedSupport);
        expect(beam.getSupports()).toEqual([pinnedSupport, anotherPinnedSupport]);
    });
    test("Removing supports should clear all supports", () => {
        beam.addSupport(pinnedSupport);
        beam.removeSupports();
        expect(beam.getSupports()).toEqual([]);
    });
    test("Testing for beamType -> Simply Supported", () => {
        beam = new beam_1.Beam(10); // Create a beam of length 10
        const startSupport = new src_2.PinnedSupport(0); // Add a pinned support at position 0
        const endSupport = new src_2.PinnedSupport(10);
        beam.setSupports([startSupport, endSupport]);
        expect(beam.getBeamType()).toBe(beam_2.BeamType.SIMPLY_SUPPORTED);
    });
    test("Testing for beamType -> Continuous", () => {
        beam = new beam_1.Beam(10); // Create a beam of length 10
        const startSupport = new src_2.PinnedSupport(0); // Add a pinned support at position 0
        const midSupport = new src_2.PinnedSupport(5);
        const endSupport = new src_2.PinnedSupport(10);
        beam.setSupports([startSupport, midSupport]);
        beam.addSupport(endSupport);
        expect(beam.getBeamType()).toBe(beam_2.BeamType.CONTINUOUS);
    });
});
