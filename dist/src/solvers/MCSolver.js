"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCSolver = void 0;
const Moment_1 = __importDefault(require("../objects/Forces/Moment"));
const SimpleForce_1 = __importDefault(require("../objects/Forces/SimpleForce"));
const BaseSolver_1 = require("./BaseSolver");
const ShearMomentSolver_1 = __importDefault(require("./ShearMomentSolver"));
const DeflectionSolver_1 = __importDefault(require("./DeflectionSolver"));
class MCSolver extends BaseSolver_1.BaseSolver {
    constructor(beam, stepSize = beam.Length / 100) {
        super(beam, stepSize);
        this._smSolver = new ShearMomentSolver_1.default(beam);
        this._deflectionSolver = new DeflectionSolver_1.default(beam);
    }
    solve() {
        this.solveReactions();
        this._smSolver = new ShearMomentSolver_1.default(this.beam_);
        this._deflectionSolver = new DeflectionSolver_1.default(this.beam_);
        const points = Math.max(10, Math.round(this.beam_.Length / this.stepSize_));
        this.shearCurve_ = this._smSolver.sampleShearCurve(points).map((s) => s.v);
        this.momentCurve_ = this._smSolver.sampleMomentCurve(points).map((s) => s.m);
        return true;
    }
    getShearAt(x) {
        const v = this._smSolver.getShearAt(x);
        const dir = v >= 0 ? "up" : "down";
        return new SimpleForce_1.default(Math.abs(v), dir, x);
    }
    getMomentAt(x) {
        const m = this._smSolver.getMomentAt(x);
        const dir = m >= 0 ? "ccw" : "cw";
        return new Moment_1.default(Math.abs(m), dir, x, 0);
    }
    getMaxShear() {
        const max = this._smSolver.getMaxShear();
        const dir = max.value >= 0 ? "up" : "down";
        return new SimpleForce_1.default(Math.abs(max.value), dir, max.x);
    }
    getMaxMoment() {
        const max = this._smSolver.getMaxMoment();
        const dir = max.value >= 0 ? "ccw" : "cw";
        return new Moment_1.default(Math.abs(max.value), dir, max.x, 0);
    }
    getDeflectionAt(x) {
        return this._deflectionSolver.getDeflectionAt(x);
    }
}
exports.MCSolver = MCSolver;
exports.default = MCSolver;
