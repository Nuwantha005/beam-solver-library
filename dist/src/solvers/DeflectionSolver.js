"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeflectionSolver = void 0;
const BaseSupport_1 = require("../objects/supports/BaseSupport");
const ShearMomentSolver_1 = __importDefault(require("./ShearMomentSolver"));
const ReactionSolver_1 = __importDefault(require("./ReactionSolver"));
class DeflectionSolver {
    constructor(beam, numIntervals = 400) {
        this.numIntervals = 400;
        this.xGrid = [];
        this.thetaGrid = [];
        this.vGrid = [];
        this.c1 = 0;
        this.c2 = 0;
        this.EI = 1;
        this.beam = beam;
        this.numIntervals = numIntervals;
        ReactionSolver_1.default.solve(this.beam);
        this.smSolver = new ShearMomentSolver_1.default(this.beam);
        this.computeDeflection();
    }
    computeDeflection() {
        const L = this.beam.Length;
        const E = this.beam.EModulus > 0 ? this.beam.EModulus : 200e9;
        const I = this.beam.crossSection ? this.beam.crossSection.getInertia() : 1e-4;
        this.EI = (E * I > 0) ? E * I : 1;
        const N = this.numIntervals;
        const h = L / N;
        this.xGrid = new Array(N + 1);
        const I1 = new Array(N + 1); // Integral of M/EI
        const I2 = new Array(N + 1); // Double integral of M/EI
        this.xGrid[0] = 0;
        I1[0] = 0;
        I2[0] = 0;
        for (let k = 0; k < N; k++) {
            const xk = k * h;
            const xMid = xk + h / 2;
            const xNext = (k + 1) * h;
            this.xGrid[k + 1] = xNext;
            const m0 = this.smSolver.getMomentAt(xk);
            const mMid = this.smSolver.getMomentAt(xMid);
            const m1 = this.smSolver.getMomentAt(xNext);
            const dI1 = (h / (6 * this.EI)) * (m0 + 4 * mMid + m1);
            I1[k + 1] = I1[k] + dI1;
            // Integration of I1 over [xk, xNext]
            const i1Mid = I1[k] + (h / (12 * this.EI)) * (m0 + 2 * mMid); // midpoint approximation of I1
            const dI2 = (h / 6) * (I1[k] + 4 * i1Mid + I1[k + 1]);
            I2[k + 1] = I2[k] + dI2;
        }
        // Helper: Interpolate I1 and I2 at arbitrary x
        const interpolateI1 = (x) => {
            const clamped = Math.max(0, Math.min(L, x));
            const idx = Math.min(N - 1, Math.floor(clamped / h));
            const t = (clamped - this.xGrid[idx]) / h;
            return I1[idx] + t * (I1[idx + 1] - I1[idx]);
        };
        const interpolateI2 = (x) => {
            const clamped = Math.max(0, Math.min(L, x));
            const idx = Math.min(N - 1, Math.floor(clamped / h));
            const t = (clamped - this.xGrid[idx]) / h;
            return I2[idx] + t * (I2[idx + 1] - I2[idx]);
        };
        // Determine Boundary Conditions & Solve for C1, C2
        const supports = this.beam.getSupports();
        const fixedSupport = supports.find((s) => s.SupportType === BaseSupport_1.supportType.FIXED);
        if (fixedSupport) {
            // Fixed support at x0: theta(x0) = 0, v(x0) = 0
            const x0 = fixedSupport.Location;
            this.c1 = -interpolateI1(x0);
            this.c2 = -interpolateI2(x0) - this.c1 * x0;
        }
        else if (supports.length >= 2) {
            // Two supports at xA and xB: v(xA) = 0, v(xB) = 0
            const sortedSupports = [...supports].sort((a, b) => a.Location - b.Location);
            const xA = sortedSupports[0].Location;
            const xB = sortedSupports[sortedSupports.length - 1].Location;
            const span = xB - xA;
            if (span > 1e-6) {
                const i2A = interpolateI2(xA);
                const i2B = interpolateI2(xB);
                this.c1 = -(i2B - i2A) / span;
                this.c2 = -i2A - this.c1 * xA;
            }
            else {
                this.c1 = 0;
                this.c2 = 0;
            }
        }
        else {
            this.c1 = 0;
            this.c2 = 0;
        }
        // Populate final theta and v grids
        this.thetaGrid = new Array(N + 1);
        this.vGrid = new Array(N + 1);
        for (let k = 0; k <= N; k++) {
            const x = this.xGrid[k];
            this.thetaGrid[k] = I1[k] + this.c1;
            this.vGrid[k] = I2[k] + this.c1 * x + this.c2;
        }
    }
    /**
     * Returns slope (rotation) theta(x) in radians.
     */
    getSlopeAt(x) {
        const L = this.beam.Length;
        const clamped = Math.max(0, Math.min(L, x));
        const h = L / this.numIntervals;
        const idx = Math.min(this.numIntervals - 1, Math.floor(clamped / h));
        const t = (clamped - this.xGrid[idx]) / h;
        return this.thetaGrid[idx] + t * (this.thetaGrid[idx + 1] - this.thetaGrid[idx]);
    }
    /**
     * Returns vertical deflection v(x) in length units (negative is downward sagging).
     */
    getDeflectionAt(x) {
        const L = this.beam.Length;
        const clamped = Math.max(0, Math.min(L, x));
        const h = L / this.numIntervals;
        const idx = Math.min(this.numIntervals - 1, Math.floor(clamped / h));
        const t = (clamped - this.xGrid[idx]) / h;
        return this.vGrid[idx] + t * (this.vGrid[idx + 1] - this.vGrid[idx]);
    }
    /**
     * Returns maximum (peak upward or peak downward) deflection along the span.
     */
    getMaxDeflection() {
        let maxVal = -Infinity;
        let maxX = 0;
        for (let i = 0; i <= this.numIntervals; i++) {
            if (this.vGrid[i] > maxVal) {
                maxVal = this.vGrid[i];
                maxX = this.xGrid[i];
            }
        }
        return { x: maxX, value: maxVal };
    }
    /**
     * Returns minimum (most negative downward) deflection along the span.
     */
    getMinDeflection() {
        let minVal = Infinity;
        let minX = 0;
        for (let i = 0; i <= this.numIntervals; i++) {
            if (this.vGrid[i] < minVal) {
                minVal = this.vGrid[i];
                minX = this.xGrid[i];
            }
        }
        return { x: minX, value: minVal };
    }
    /**
     * Samples the deflection curve into discrete points.
     */
    sampleDeflectionCurve(points = 100) {
        const samples = [];
        const step = this.beam.Length / points;
        for (let i = 0; i <= points; i++) {
            const x = i * step;
            samples.push({ x, v: this.getDeflectionAt(x) });
        }
        return samples;
    }
    /**
     * Samples the slope curve into discrete points.
     */
    sampleSlopeCurve(points = 100) {
        const samples = [];
        const step = this.beam.Length / points;
        for (let i = 0; i <= points; i++) {
            const x = i * step;
            samples.push({ x, theta: this.getSlopeAt(x) });
        }
        return samples;
    }
}
exports.DeflectionSolver = DeflectionSolver;
exports.default = DeflectionSolver;
