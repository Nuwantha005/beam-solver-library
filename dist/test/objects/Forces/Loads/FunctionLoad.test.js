"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FunctionLoad_1 = __importDefault(require("../../../../src/objects/Forces/Loads/FunctionLoad"));
const UniformlyDistributedLoad_1 = __importDefault(require("../../../../src/objects/Forces/Loads/UniformlyDistributedLoad"));
const TaperzoidLoad_1 = __importDefault(require("../../../../src/objects/Forces/Loads/TaperzoidLoad"));
const beam_1 = require("../../../../src/objects/beam");
const PinnedSupport_1 = require("../../../../src/objects/supports/PinnedSupport");
const RollerSupport_1 = require("../../../../src/objects/supports/RollerSupport");
const CustomSection_1 = require("../../../../src/objects/crossSections/CustomSection");
const DeflectionSolver_1 = __importDefault(require("../../../../src/solvers/DeflectionSolver"));
describe("FunctionLoad — Basic Properties & Equivalence", () => {
    it("should match UniformlyDistributedLoad for a constant function", () => {
        const fnLoad = new FunctionLoad_1.default(2, 8, () => 15);
        const udl = new UniformlyDistributedLoad_1.default(2, 8, 15);
        expect(fnLoad.getTotalVerticalForce()).toBeCloseTo(udl.getTotalVerticalForce(), 6);
        expect(fnLoad.getTotalHorizontalForce()).toBe(0);
        const eqFn = fnLoad.getEquivalentPointLoad();
        const eqUDL = udl.getEquivalentPointLoad();
        expect(eqFn.getMagnitude()).toBeCloseTo(eqUDL.getMagnitude(), 6);
        expect(eqFn.getX()).toBeCloseTo(eqUDL.getX(), 6);
        // Section shear and moment contributions
        expect(fnLoad.getShearContribution(5)).toBeCloseTo(udl.getMomentAround(5) ? -45 : -45, 6);
        expect(fnLoad.getMomentContribution(5)).toBeCloseTo(-15 * 3 * 1.5, 6);
    });
    it("should match TaperzoidLoad for a linear ramp function", () => {
        // Triangular load from 0 to 12 kN/m over span [0, 6] => w(x) = 2x
        const fnLoad = new FunctionLoad_1.default(0, 6, (x) => 2 * x);
        const trap = new TaperzoidLoad_1.default(0, 6, 0, 12);
        expect(fnLoad.getTotalVerticalForce()).toBeCloseTo(trap.getTotalVerticalForce(), 6);
        const eqFn = fnLoad.getEquivalentPointLoad();
        const eqTrap = trap.getEquivalentPointLoad();
        // Area = 0.5 * 6 * 12 = 36 kN
        expect(eqFn.getMagnitude()).toBeCloseTo(36, 6);
        expect(eqFn.getMagnitude()).toBeCloseTo(eqTrap.getMagnitude(), 6);
        // Centroid of right triangle = 2/3 * 6 = 4 m
        expect(eqFn.getX()).toBeCloseTo(4, 6);
        expect(eqFn.getX()).toBeCloseTo(eqTrap.getX(), 6);
    });
});
describe("FunctionLoad — Parabolic Distribution", () => {
    it("should evaluate exact analytical area and centroid for parabolic profile", () => {
        // w(x) = 6 - x^2 / 6 on [0, 6]
        // Analytical Area = [6x - x^3 / 18]_0^6 = 36 - 12 = 24 kN
        // Analytical First Moment = [3x^2 - x^4 / 24]_0^6 = 108 - 54 = 54 kNm
        // Centroid xc = 54 / 24 = 2.25 m
        const fnLoad = new FunctionLoad_1.default(0, 6, (x) => 6 - (x * x) / 6);
        expect(fnLoad.getTotalForceMagnitude()).toBeCloseTo(24, 6);
        expect(fnLoad.getTotalVerticalForce()).toBeCloseTo(-24, 6);
        const eq = fnLoad.getEquivalentPointLoad();
        expect(eq.getMagnitude()).toBeCloseTo(24, 6);
        expect(eq.getX()).toBeCloseTo(2.25, 6);
        // Moment about x = 6
        const mEnd = fnLoad.getMomentContribution(6);
        // Moment about x=6 = -24 * (6 - 2.25) = -24 * 3.75 = -90 kNm
        expect(mEnd).toBeCloseTo(-90, 6);
    });
});
describe("FunctionLoad — Sinusoidal Half-Wave on Simply Supported Beam", () => {
    it("should match closed-form analytical reactions, peak moment, and deflection", () => {
        // L = 10 m, w(x) = w0 * sin(pi * x / L), w0 = 10 kN/m
        // Analytical Area: W = 2 * w0 * L / pi = 200 / pi ≈ 63.661977 kN
        // Symmetric Reactions: R1 = R2 = 100 / pi ≈ 31.830989 kN
        // Analytical Max Moment at midspan: M_max = w0 * L^2 / pi^2 = 1000 / pi^2 ≈ 101.32118 kNm
        // Analytical Max Deflection: v_max = -w0 * L^4 / (pi^4 * EI)
        const L = 10;
        const w0 = 10;
        const E = 200e6; // 200 GPa = 200e6 kPa
        const I = 1e-4; // 1e-4 m^4
        const EI = E * I; // 20000 kN*m^2
        const fnLoad = new FunctionLoad_1.default(0, L, (x) => w0 * Math.sin((Math.PI * x) / L));
        expect(fnLoad.getTotalForceMagnitude()).toBeCloseTo((2 * w0 * L) / Math.PI, 4);
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new PinnedSupport_1.PinnedSupport(0), new RollerSupport_1.RollerSupport(L)]);
        beam.addLoad(fnLoad);
        const result = beam.analyze();
        // 1. Reactions
        const expectedReaction = (w0 * L) / Math.PI;
        expect(result.reactions[0].fy).toBeCloseTo(expectedReaction, 3);
        expect(result.reactions[1].fy).toBeCloseTo(expectedReaction, 3);
        // 2. Maximum Moment at midspan x = 5
        const expectedMmax = (w0 * Math.pow(L, 2)) / Math.pow(Math.PI, 2);
        expect(result.momentDiagram.max.value).toBeCloseTo(expectedMmax, 3);
        expect(result.momentDiagram.max.x).toBeCloseTo(L / 2, 3);
        // 3. Maximum Deflection at midspan
        const defSolver = new DeflectionSolver_1.default(beam);
        const expectedVmax = -(w0 * Math.pow(L, 4)) / (Math.pow(Math.PI, 4) * EI);
        expect(defSolver.getDeflectionAt(L / 2)).toBeCloseTo(expectedVmax, 4);
    });
});
describe("FunctionLoad.fromExpression", () => {
    it("should create valid FunctionLoad from string formulas", () => {
        // Parabolic expression
        const load1 = FunctionLoad_1.default.fromExpression("6 - x^2 / 6", 0, 6);
        expect(load1.expression).toBe("6 - x^2 / 6");
        expect(load1.getTotalForceMagnitude()).toBeCloseTo(24, 6);
        expect(load1.getEquivalentPointLoad().getX()).toBeCloseTo(2.25, 6);
        // Trigonometric expression
        const load2 = FunctionLoad_1.default.fromExpression("10 * sin(pi * x / 10)", 0, 10);
        expect(load2.getTotalForceMagnitude()).toBeCloseTo(200 / Math.PI, 4);
    });
});
