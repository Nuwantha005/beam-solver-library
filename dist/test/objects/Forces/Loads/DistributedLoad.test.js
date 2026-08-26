"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UniformlyDistributedLoad_1 = __importDefault(require("../../../../src/objects/Forces/Loads/UniformlyDistributedLoad"));
const TaperzoidLoad_1 = __importDefault(require("../../../../src/objects/Forces/Loads/TaperzoidLoad"));
const ILoad_1 = require("../../../../src/objects/Forces/Loads/ILoad");
describe("UniformlyDistributedLoad", () => {
    let udl;
    beforeEach(() => {
        // 5 kN/m across span [2, 6] (length = 4 m)
        udl = new UniformlyDistributedLoad_1.default(2, 6, 5);
    });
    it("should have correct loadType and bounds", () => {
        expect(udl.loadType).toBe(ILoad_1.LoadType.DISTRIBUTED);
        expect(udl.startLocation).toBe(2);
        expect(udl.endLocation).toBe(6);
        expect(udl.start).toBe(2);
        expect(udl.end).toBe(6);
    });
    it("should compute equivalent point load at center", () => {
        const eqLoad = udl.getEquivalentPointLoad();
        expect(eqLoad.getMagnitude()).toBeCloseTo(20); // 5 * 4 = 20 kN
        expect(eqLoad.getX()).toBeCloseTo(4); // (2 + 6) / 2 = 4 m
    });
    it("should compute total forces", () => {
        expect(udl.getTotalHorizontalForce()).toBe(0);
        // Downward force is negative in Cartesian coordinates
        expect(udl.getTotalVerticalForce()).toBeCloseTo(-20);
    });
    it("should calculate moment around points before, within, and after the load", () => {
        // Before load: x = 1 (moment should be 0)
        const mBefore = udl.getMomentAround(1);
        expect(mBefore.magnitude).toBe(0);
        // After load: x = 8
        // Resultant 20 kN downward at x = 4. Distance from x=8 to x=4 is 4 m.
        const mAfter = udl.getMomentAround(8);
        expect(mAfter.magnitude).toBeCloseTo(-80);
        expect(mAfter.direction).toBe("cw");
        // Within load: x = 4 (half the UDL has passed: 2 m * 5 kN/m = 10 kN at x = 3 m)
        const mWithin = udl.getMomentAround(4);
        expect(mWithin.magnitude).toBeCloseTo(-10);
        expect(mWithin.direction).toBe("cw");
    });
});
describe("TaperzoidLoad", () => {
    let trapezoid;
    beforeEach(() => {
        // Triangular load from 0 to 6 kN/m over span [0, 6] (length = 6 m)
        trapezoid = new TaperzoidLoad_1.default(0, 6, 0, 6);
    });
    it("should compute total area and centroid for triangular load", () => {
        const eqLoad = trapezoid.getEquivalentPointLoad();
        // Area = 0.5 * 6 * 6 = 18 kN
        expect(eqLoad.getMagnitude()).toBeCloseTo(18);
        // Centroid of right-triangle with zero at start: 2/3 * 6 = 4 m
        expect(eqLoad.getX()).toBeCloseTo(4);
    });
    it("should compute total forces", () => {
        expect(trapezoid.getTotalHorizontalForce()).toBe(0);
        expect(trapezoid.getTotalVerticalForce()).toBeCloseTo(-18);
    });
    it("should calculate moment around endpoint x = 6", () => {
        // 18 kN at x = 4, moment about x = 6 is 18 * (4 - 6) = -36 kNm (cw)
        const mEnd = trapezoid.getMomentAround(6);
        expect(mEnd.magnitude).toBeCloseTo(-36);
        expect(mEnd.direction).toBe("cw");
    });
});
