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
const TaperzoidLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/TaperzoidLoad"));
const MomentLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/MomentLoad"));
const DeflectionSolver_1 = __importDefault(require("../../src/solvers/DeflectionSolver"));
describe("Canonical Benchmark 1: Simply Supported Beam with Asymmetric Point Load", () => {
    it("should match closed-form reactions, moment, and deflection", () => {
        // L = 10, a = 3, b = 7, P = 30 kN, EI = 20000 kN*m^2
        const L = 10;
        const a = 3;
        const b = 7;
        const P = 30;
        const E = 200e6;
        const I = 1e-4;
        const EI = E * I; // 20000
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new PinnedSupport_1.PinnedSupport(0), new RollerSupport_1.RollerSupport(L)]);
        beam.addLoad(new PointLoad_1.default(P, a));
        const result = beam.analyze();
        // 1. Reactions: R1 = P*b/L = 21, R2 = P*a/L = 9
        expect(result.reactions[0].fy).toBeCloseTo((P * b) / L, 4);
        expect(result.reactions[1].fy).toBeCloseTo((P * a) / L, 4);
        // 2. Max Moment at x = a: M_max = P*a*b/L = 63 kNm
        expect(result.momentDiagram.max.value).toBeCloseTo((P * a * b) / L, 4);
        expect(result.momentDiagram.max.x).toBeCloseTo(a, 4);
        // 3. Deflection at load point: v(a) = -P*a^2*b^2 / (3*EI*L) = -0.02205 m
        const defSolver = new DeflectionSolver_1.default(beam);
        const expectedDefLoad = -(P * Math.pow(a, 2) * Math.pow(b, 2)) / (3 * EI * L);
        expect(defSolver.getDeflectionAt(a)).toBeCloseTo(expectedDefLoad, 4);
    });
});
describe("Canonical Benchmark 2: Simply Supported Beam with Full UDL", () => {
    it("should match closed-form reactions, midspan moment, slopes, and deflection", () => {
        // L = 12, w = 5 kN/m, EI = 20000
        const L = 12;
        const w = 5;
        const E = 200e6;
        const I = 1e-4;
        const EI = E * I; // 20000
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new PinnedSupport_1.PinnedSupport(0), new RollerSupport_1.RollerSupport(L)]);
        beam.addLoad(new UniformlyDistributedLoad_1.default(0, L, w));
        const result = beam.analyze();
        // 1. Reactions: R1 = R2 = w*L/2 = 30 kN
        expect(result.reactions[0].fy).toBeCloseTo((w * L) / 2, 4);
        expect(result.reactions[1].fy).toBeCloseTo((w * L) / 2, 4);
        // 2. Max Moment: M_max = w*L^2/8 = 90 kNm at x = 6
        expect(result.momentDiagram.max.value).toBeCloseTo((w * Math.pow(L, 2)) / 8, 4);
        expect(result.momentDiagram.max.x).toBeCloseTo(L / 2, 4);
        // 3. Deflection & Slopes
        const defSolver = new DeflectionSolver_1.default(beam);
        const expectedVmid = -(5 * w * Math.pow(L, 4)) / (384 * EI);
        expect(defSolver.getDeflectionAt(L / 2)).toBeCloseTo(expectedVmid, 4);
        const expectedTheta0 = -(w * Math.pow(L, 3)) / (24 * EI);
        expect(defSolver.getSlopeAt(0)).toBeCloseTo(expectedTheta0, 4);
        expect(defSolver.getSlopeAt(L)).toBeCloseTo(-expectedTheta0, 4);
    });
});
describe("Canonical Benchmark 3: Simply Supported Beam with Triangular Load", () => {
    it("should match closed-form reactions, zero-shear position, and maximum moment", () => {
        // L = 6, w0 = 12 kN/m (w = 0 to 12)
        const L = 6;
        const w0 = 12;
        const beam = new beam_1.Beam(L);
        beam.setSupports([new PinnedSupport_1.PinnedSupport(0), new RollerSupport_1.RollerSupport(L)]);
        beam.addLoad(new TaperzoidLoad_1.default(0, L, 0, w0));
        const result = beam.analyze();
        // 1. Reactions: R1 = w0*L/6 = 12 kN, R2 = w0*L/3 = 24 kN
        expect(result.reactions[0].fy).toBeCloseTo((w0 * L) / 6, 4);
        expect(result.reactions[1].fy).toBeCloseTo((w0 * L) / 3, 4);
        // 2. Zero Shear position: x = L / sqrt(3) ≈ 3.4641 m
        const expectedZeroCrossing = L / Math.sqrt(3);
        expect(result.shearDiagram.zeroCrossings[0]).toBeCloseTo(expectedZeroCrossing, 2);
        // 3. Max Moment: M_max = w0*L^2 / (9*sqrt(3)) ≈ 27.7128 kNm
        const expectedMmax = (w0 * Math.pow(L, 2)) / (9 * Math.sqrt(3));
        expect(result.momentDiagram.max.value).toBeCloseTo(expectedMmax, 2);
    });
});
describe("Canonical Benchmark 4: Cantilever Beam with Tip Concentrated Load", () => {
    it("should match closed-form wall reaction, tip deflection, and slope", () => {
        // L = 4, P = 15 kN, EI = 20000
        const L = 4;
        const P = 15;
        const E = 200e6;
        const I = 1e-4;
        const EI = E * I;
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new FixedSupport_1.FixedSupport(0)]);
        beam.addLoad(new PointLoad_1.default(P, L));
        const result = beam.analyze();
        // 1. Reactions: Fy = 15, Moment = 60 kNm (ccw)
        expect(result.reactions[0].fy).toBeCloseTo(P, 4);
        expect(result.reactions[0].moment).toBeCloseTo(P * L, 4);
        // 2. Moments: M(0) = -PL = -60, M(L) = 0
        expect(result.momentDiagram.min.value).toBeCloseTo(-P * L, 4);
        // 3. Tip Deflection & Slope: v(L) = -P*L^3 / (3*EI), theta(L) = -P*L^2 / (2*EI)
        const defSolver = new DeflectionSolver_1.default(beam);
        expect(defSolver.getDeflectionAt(L)).toBeCloseTo(-(P * Math.pow(L, 3)) / (3 * EI), 4);
        expect(defSolver.getSlopeAt(L)).toBeCloseTo(-(P * Math.pow(L, 2)) / (2 * EI), 4);
    });
});
describe("Canonical Benchmark 5: Cantilever Beam with Full UDL", () => {
    it("should match closed-form wall reaction, tip deflection, and slope", () => {
        // L = 6, w = 2.5 kN/m, EI = 20000
        const L = 6;
        const w = 2.5;
        const E = 200e6;
        const I = 1e-4;
        const EI = E * I;
        const beam = new beam_1.Beam(L, E, new CustomSection_1.CustomSection(0.01, I, I));
        beam.setSupports([new FixedSupport_1.FixedSupport(0)]);
        beam.addLoad(new UniformlyDistributedLoad_1.default(0, L, w));
        const result = beam.analyze();
        // 1. Reactions: Fy = w*L = 15, Moment = w*L^2 / 2 = 45 kNm
        expect(result.reactions[0].fy).toBeCloseTo(w * L, 4);
        expect(result.reactions[0].moment).toBeCloseTo((w * Math.pow(L, 2)) / 2, 4);
        // 2. Tip Deflection: v(L) = -w*L^4 / (8*EI)
        const defSolver = new DeflectionSolver_1.default(beam);
        expect(defSolver.getDeflectionAt(L)).toBeCloseTo(-(w * Math.pow(L, 4)) / (8 * EI), 4);
        expect(defSolver.getSlopeAt(L)).toBeCloseTo(-(w * Math.pow(L, 3)) / (6 * EI), 4);
    });
});
describe("Canonical Benchmark 6: Overhanging Beam with Symmetric Overhangs", () => {
    it("should correctly evaluate hogging at supports and sagging in central span", () => {
        // L = 12, Supports at x = 2 and x = 10 (interior span = 8)
        // 10 kN at x = 0, 10 kN at x = 12, UDL 2 kN/m on [2, 10]
        const beam = new beam_1.Beam(12);
        beam.setSupports([new PinnedSupport_1.PinnedSupport(2), new RollerSupport_1.RollerSupport(10)]);
        beam.addLoad(new PointLoad_1.default(10, 0));
        beam.addLoad(new PointLoad_1.default(10, 12));
        beam.addLoad(new UniformlyDistributedLoad_1.default(2, 10, 2));
        const result = beam.analyze();
        // 1. Reactions: R1 = R2 = 18 kN
        expect(result.reactions[0].fy).toBeCloseTo(18, 4);
        expect(result.reactions[1].fy).toBeCloseTo(18, 4);
        // 2. Hogging Moment at supports: M(2) = M(10) = -20 kNm
        const mAtSup1 = result.momentDiagram.points.find((p) => Math.abs(p.x - 2) < 0.05);
        expect(mAtSup1 === null || mAtSup1 === void 0 ? void 0 : mAtSup1.value).toBeCloseTo(-20, 2);
        // 3. Moment at midspan x = 6: M(6) = -4 kNm
        const mAtMid = result.momentDiagram.points.find((p) => Math.abs(p.x - 6) < 0.05);
        expect(mAtMid === null || mAtMid === void 0 ? void 0 : mAtMid.value).toBeCloseTo(-4, 2);
    });
});
describe("Canonical Benchmark 7: Complex Multi-Load Beam", () => {
    it("should solve combined point load, UDL, and applied moment correctly", () => {
        // L = 10, Pin at 0, Roller at 10
        // Point load 20 kN at x = 3
        // UDL 4 kN/m on [4, 8] (16 kN at x = 6)
        // Applied Moment 30 kNm (ccw) at x = 7
        const beam = new beam_1.Beam(10);
        beam.setSupports([new PinnedSupport_1.PinnedSupport(0), new RollerSupport_1.RollerSupport(10)]);
        beam.addLoad(new PointLoad_1.default(20, 3));
        beam.addLoad(new UniformlyDistributedLoad_1.default(4, 8, 4));
        beam.addLoad(new MomentLoad_1.default(30, "ccw", 7));
        const result = beam.analyze();
        // Check equilibrium of reactions:
        // sumFy = 0 => R1 + R2 = 36
        // sumMo = 0 => 10*R2 - (20*3 + 16*6 - 30) = 0 => 10*R2 - (60 + 96 - 30) = 0 => 10*R2 = 126 => R2 = 12.6 kN
        // R1 = 36 - 12.6 = 23.4 kN
        expect(result.reactions[0].fy).toBeCloseTo(23.4, 4);
        expect(result.reactions[1].fy).toBeCloseTo(12.6, 4);
        // Segments count: critical events at 0, 3, 4, 7, 8, 10 => 5 segments
        expect(result.shearDiagram.segments).toHaveLength(5);
        expect(result.momentDiagram.segments).toHaveLength(5);
    });
});
