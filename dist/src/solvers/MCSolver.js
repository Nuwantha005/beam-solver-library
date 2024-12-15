"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCSolver = void 0;
const Moment_1 = __importDefault(require("../objects/Forces/Moment"));
const SimpleForce_1 = __importDefault(require("../objects/Forces/SimpleForce"));
const BaseSolver_1 = require("./BaseSolver");
// Use Moment-Curvature Relationship to solve for the shear and moment at a given point on the beam.
class MCSolver extends BaseSolver_1.BaseSolver {
    constructor(beam, stepSize = beam.Length / 100) {
        super(beam, stepSize);
    }
    solve() {
        const L = this.beam_.Length;
        const EI = this.beam_.EModulus * this.beam_.crossSection.getInertia();
        return true;
    }
    getShearAt(x) {
        // Implement shear calculation at position x
        return new SimpleForce_1.default(0, "down", x);
    }
    getMomentAt(x) {
        // Implement moment calculation at position x
        return new Moment_1.default(0);
    }
    getMaxShear() {
        return new SimpleForce_1.default(0, "down", 0);
    }
    getMaxMoment() {
        // Implement maximum moment calculation
        return new Moment_1.default();
    }
    getDeflectionAt(x) {
        // Implement deflection calculation at position x using integration
        // ...implementation code...
        return 0;
    }
}
exports.MCSolver = MCSolver;
