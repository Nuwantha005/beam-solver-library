"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSolver = void 0;
const ReactionSolver_1 = __importDefault(require("./ReactionSolver"));
class BaseSolver {
    constructor(beam, stepSize = beam.Length / 100) {
        this.stepSize_ = 0.01;
        this.beam_ = beam;
        this.shearCurve_ = [];
        this.momentCurve_ = [];
        this.stepSize = stepSize;
    }
    findReactions() {
        return true;
    }
    solveReactions() {
        return ReactionSolver_1.default.solve(this.beam_);
    }
    get beam() {
        return this.beam_;
    }
    set beam(value) {
        this.beam_ = value;
    }
    get shearCurve() {
        if (this.shearCurve_.length === 0) {
            this.solve();
        }
        return this.shearCurve_;
    }
    get momentCurve() {
        if (this.momentCurve_.length === 0) {
            this.solve();
        }
        return this.momentCurve_;
    }
    set stepSize(stepSize) {
        this.stepSize_ = stepSize;
    }
    get stepSize() {
        return this.stepSize_;
    }
}
exports.BaseSolver = BaseSolver;
