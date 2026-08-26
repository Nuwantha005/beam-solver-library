"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const beam_1 = require("../../src/objects/beam");
const RectCross_1 = require("../../src/objects/crossSections/RectCross");
const CrossSection_1 = require("../../src/objects/crossSections/CrossSection");
const CustomSection_1 = require("../../src/objects/crossSections/CustomSection");
const ISection_1 = require("../../src/objects/crossSections/ISection");
const CircCrossSection_1 = require("../../src/objects/crossSections/CircCrossSection");
const src_1 = require("../../src");
const src_2 = require("../../src");
const src_3 = require("../../src");
const src_4 = require("../../src");
const beam_2 = require("../../src/objects/beam");
const PointLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/PointLoad"));
const UniformlyDistributedLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/UniformlyDistributedLoad"));
const MomentLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/MomentLoad"));
const BeamErrors_1 = require("../../src/errors/BeamErrors");
describe("Beam - base class tests", () => {
    test("Length getter should return the correct value", () => {
        const beam = new beam_1.Beam(10);
        expect(beam.Length).toBe(10);
    });
    test("Length setter should update the length", () => {
        const beam = new beam_1.Beam(10);
        beam.Length = 15;
        expect(beam.Length).toBe(15);
    });
    test("Setting negative or zero length should throw InvalidGeometryError", () => {
        expect(() => new beam_1.Beam(0)).toThrow(BeamErrors_1.InvalidGeometryError);
        expect(() => new beam_1.Beam(-5)).toThrow(BeamErrors_1.InvalidGeometryError);
        const beam = new beam_1.Beam(10);
        expect(() => {
            beam.Length = -5;
        }).toThrow(BeamErrors_1.InvalidGeometryError);
    });
    test("EModulus getter and setter should operate correctly", () => {
        const beam = new beam_1.Beam(10, 100);
        expect(beam.EModulus).toBe(100);
        beam.EModulus = 200;
        expect(beam.EModulus).toBe(200);
    });
    test("Setting negative EModulus should throw InvalidGeometryError", () => {
        const beam = new beam_1.Beam(10, 100);
        expect(() => {
            beam.EModulus = -100;
        }).toThrow(BeamErrors_1.InvalidGeometryError);
    });
    describe("Beam: cross section tests", () => {
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
});
describe("Beam: unified load tests", () => {
    let beam;
    beforeEach(() => {
        beam = new beam_1.Beam(10, 100);
    });
    test("Adding diverse load types into Beam", () => {
        const pointLoad = new PointLoad_1.default(20, 3);
        const udl = new UniformlyDistributedLoad_1.default(4, 8, 10);
        const moment = new MomentLoad_1.default(15, "ccw", 2);
        beam.addLoad(pointLoad);
        beam.addLoad(udl);
        beam.addLoad(moment);
        expect(beam.getLoads()).toHaveLength(3);
        expect(beam.getPointLoads()).toEqual([pointLoad]);
        expect(beam.getDistributedLoads()).toEqual([udl]);
        expect(beam.getAppliedMoments()).toEqual([moment]);
    });
    test("Setting loads replaces existing loads", () => {
        const p1 = new PointLoad_1.default(10, 2);
        const p2 = new PointLoad_1.default(20, 5);
        beam.setLoads([p1, p2]);
        expect(beam.getLoads()).toEqual([p1, p2]);
    });
    test("Boundary validation throws InvalidGeometryError for out-of-bounds loads", () => {
        expect(() => beam.addLoad(new PointLoad_1.default(10, -1))).toThrow(BeamErrors_1.InvalidGeometryError);
        expect(() => beam.addLoad(new PointLoad_1.default(10, 12))).toThrow(BeamErrors_1.InvalidGeometryError);
        expect(() => beam.addLoad(new UniformlyDistributedLoad_1.default(2, 15, 5))).toThrow(BeamErrors_1.InvalidGeometryError);
        expect(() => beam.addLoad(new UniformlyDistributedLoad_1.default(6, 4, 5))).toThrow(BeamErrors_1.InvalidGeometryError);
    });
    test("Backwards compatibility for forces methods", () => {
        const force = new src_1.SimpleForce(50, "up", 5);
        beam.addForce(force);
        expect(beam.getForces()).toContain(force);
        beam.removeForces();
        expect(beam.getForces()).toEqual([]);
    });
});
describe("Beam: support tests", () => {
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
    test("Removing supports should clear all supports", () => {
        beam.addSupport(pinnedSupport);
        beam.removeSupports();
        expect(beam.getSupports()).toEqual([]);
    });
    test("Out-of-bounds support throws InvalidGeometryError", () => {
        expect(() => beam.addSupport(new src_2.PinnedSupport(-1))).toThrow(BeamErrors_1.InvalidGeometryError);
        expect(() => beam.addSupport(new src_2.PinnedSupport(12))).toThrow(BeamErrors_1.InvalidGeometryError);
    });
    test("Testing for beamType -> Simply Supported", () => {
        beam = new beam_1.Beam(10);
        const startSupport = new src_2.PinnedSupport(0);
        const endSupport = new src_2.PinnedSupport(10);
        beam.setSupports([startSupport, endSupport]);
        expect(beam.BeamType).toBe(beam_2.BeamType.SIMPLY_SUPPORTED);
    });
    test("Testing for beamType -> Roller Supported", () => {
        beam = new beam_1.Beam(10);
        const startSupport = new src_2.PinnedSupport(0);
        const endSupport = new src_3.RollerSupport(10);
        beam.setSupports([startSupport, endSupport]);
        expect(beam.BeamType).toBe(beam_2.BeamType.ROLLER_SUPPORTED);
    });
    test("Testing for beamType -> Cantilever", () => {
        beam = new beam_1.Beam(10);
        const fixedSupport = new src_4.FixedSupport(0);
        beam.setSupports([fixedSupport]);
        expect(beam.BeamType).toBe(beam_2.BeamType.CANTELIVER);
    });
    test("Testing for beamType -> Continuous", () => {
        beam = new beam_1.Beam(10);
        const startSupport = new src_2.PinnedSupport(0);
        const midSupport = new src_2.PinnedSupport(5);
        const endSupport = new src_2.PinnedSupport(10);
        beam.setSupports([startSupport, midSupport, endSupport]);
        expect(beam.BeamType).toBe(beam_2.BeamType.CONTINUOUS);
    });
});
