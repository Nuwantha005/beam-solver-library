"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const beam_1 = require("../../src/objects/beam");
const PinnedSupport_1 = require("../../src/objects/supports/PinnedSupport");
const RollerSupport_1 = require("../../src/objects/supports/RollerSupport");
const FixedSupport_1 = require("../../src/objects/supports/FixedSupport");
const CustomSection_1 = require("../../src/objects/crossSections/CustomSection");
const PointLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/PointLoad"));
const UniformlyDistributedLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/UniformlyDistributedLoad"));
const DeflectionSolver_1 = __importDefault(require("../../src/solvers/DeflectionSolver"));
const MCSolver_1 = __importDefault(require("../../src/solvers/MCSolver"));
describe("DeflectionSolver — Simply Supported Beam with Midspan Point Load", () => {
    it("should match theoretical deflection and slope (v_max = -PL^3 / 48EI)", () => {
        // Units: kN, m
        // E = 200 GPa = 200e6 kN/m^2, I = 1e-4 m^4 => EI = 20000 kN*m^2
        // P = 20 kN at x = 5 m, L = 10 m
        const E = 200e6;
        const I = 1e-4;
        const EI = E * I; // 20000 kN*m^2
        const L = 10;
        const P = 20;
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new PinnedSupport_1.PinnedSupport(0), new RollerSupport_1.RollerSupport(L)]);
        beam.addLoad(new PointLoad_1.default(P, 5));
        const solver = new DeflectionSolver_1.default(beam);
        // Boundary conditions: v(0) = 0, v(10) = 0
        expect(solver.getDeflectionAt(0)).toBeCloseTo(0, 4);
        expect(solver.getDeflectionAt(10)).toBeCloseTo(0, 4);
        // Midspan deflection: v(5) = -P * L^3 / (48 * EI) = -(20 * 1000) / (48 * 20000) = -20000 / 960000 = -0.020833 m
        const expectedVmid = -(P * Math.pow(L, 3)) / (48 * EI);
        expect(solver.getDeflectionAt(5)).toBeCloseTo(expectedVmid, 4);
        // End slopes: theta(0) = -P * L^2 / (16 * EI) = -(20 * 100) / (16 * 20000) = -0.00625 rad
        const expectedTheta0 = -(P * Math.pow(L, 2)) / (16 * EI);
        expect(solver.getSlopeAt(0)).toBeCloseTo(expectedTheta0, 4);
        expect(solver.getSlopeAt(10)).toBeCloseTo(-expectedTheta0, 4);
    });
});
describe("DeflectionSolver — Simply Supported Beam with Full UDL", () => {
    it("should match theoretical deflection (v_max = -5wL^4 / 384EI)", () => {
        // E = 200 GPa = 200e6 kN/m^2, I = 1e-4 m^4 => EI = 20000 kN*m^2
        const E = 200e6;
        const I = 1e-4;
        const EI = E * I; // 20000 kN*m^2
        const L = 8;
        const w = 4; // kN/m
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new PinnedSupport_1.PinnedSupport(0), new RollerSupport_1.RollerSupport(L)]);
        beam.addLoad(new UniformlyDistributedLoad_1.default(0, L, w));
        const solver = new DeflectionSolver_1.default(beam);
        expect(solver.getDeflectionAt(0)).toBeCloseTo(0, 4);
        expect(solver.getDeflectionAt(L)).toBeCloseTo(0, 4);
        // Midspan deflection: v(4) = -5 * w * L^4 / (384 * EI) = -5 * 4 * 4096 / (384 * 20000) = -81920 / 7680000 = -0.010667 m
        const expectedVmid = -(5 * w * Math.pow(L, 4)) / (384 * EI);
        expect(solver.getDeflectionAt(4)).toBeCloseTo(expectedVmid, 4);
        // Slope at supports: theta(0) = -w * L^3 / (24 * EI)
        const expectedTheta0 = -(w * Math.pow(L, 3)) / (24 * EI);
        expect(solver.getSlopeAt(0)).toBeCloseTo(expectedTheta0, 4);
        expect(solver.getSlopeAt(L)).toBeCloseTo(-expectedTheta0, 4);
    });
});
describe("DeflectionSolver — Cantilever Beams", () => {
    it("should match tip deflection for point load (v_tip = -PL^3 / 3EI)", () => {
        const E = 200e6;
        const I = 1e-4;
        const EI = E * I; // 20000 kN*m^2
        const L = 5;
        const P = 12; // kN
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new FixedSupport_1.FixedSupport(0)]);
        beam.addLoad(new PointLoad_1.default(P, L));
        const solver = new DeflectionSolver_1.default(beam);
        // Wall boundary conditions: v(0) = 0, theta(0) = 0
        expect(solver.getDeflectionAt(0)).toBeCloseTo(0, 4);
        expect(solver.getSlopeAt(0)).toBeCloseTo(0, 4);
        // Tip deflection: v(5) = -P * L^3 / (3 * EI) = -(12 * 125) / (3 * 20000) = -1500 / 60000 = -0.025 m
        const expectedVtip = -(P * Math.pow(L, 3)) / (3 * EI);
        expect(solver.getDeflectionAt(L)).toBeCloseTo(expectedVtip, 4);
        // Tip slope: theta(5) = -P * L^2 / (2 * EI) = -(12 * 25) / (2 * 20000) = -0.0075 rad
        const expectedThetatip = -(P * Math.pow(L, 2)) / (2 * EI);
        expect(solver.getSlopeAt(L)).toBeCloseTo(expectedThetatip, 4);
    });
    it("should match tip deflection for full UDL (v_tip = -wL^4 / 8EI)", () => {
        const E = 200e6;
        const I = 1e-4;
        const EI = E * I; // 20000 kN*m^2
        const L = 4;
        const w = 3; // kN/m
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new FixedSupport_1.FixedSupport(0)]);
        beam.addLoad(new UniformlyDistributedLoad_1.default(0, L, w));
        const solver = new DeflectionSolver_1.default(beam);
        // Tip deflection: v(4) = -w * L^4 / (8 * EI) = -(3 * 256) / (8 * 20000) = -768 / 160000 = -0.0048 m
        const expectedVtip = -(w * Math.pow(L, 4)) / (8 * EI);
        expect(solver.getDeflectionAt(L)).toBeCloseTo(expectedVtip, 4);
    });
});
describe("MCSolver integration with Deflection", () => {
    it("should return deflection via mcSolver.getDeflectionAt()", () => {
        const beam = new beam_1.Beam(10, 200e6, new CustomSection_1.CustomSection(0.01, 1e-4, 1e-4));
        beam.setSupports([new PinnedSupport_1.PinnedSupport(0), new RollerSupport_1.RollerSupport(10)]);
        beam.addLoad(new PointLoad_1.default(20, 5));
        const mcSolver = new MCSolver_1.default(beam);
        mcSolver.solve();
        expect(mcSolver.getDeflectionAt(5)).toBeCloseTo(-0.0208, 3);
    });
});
