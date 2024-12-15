"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSolver = void 0;
const beam_1 = require("../objects/beam");
const mathjs_1 = require("mathjs");
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
    static solveLinearSystem(A, b) {
        // Convert input to math.js matrix format
        const coeffMatrix = (0, mathjs_1.matrix)(A);
        const solVector = (0, mathjs_1.matrix)(b);
        // Solve the system
        const solution = (0, mathjs_1.lusolve)(coeffMatrix, solVector);
        // Convert solution to array and return
        return solution.toArray().flat(); // Flatten nested array
    }
    // Fails for beams with more than 2 supports -> Because they are statically indetermine ???
    //
    solveReactions() {
        const supports = this.beam_.getSupports();
        const forces = this.beam_.getForces();
        if (this.beam_.getBeamType() == beam_1.BeamType.SIMPLY_SUPPORTED) {
            const forceSum = forces.reduce((sum, force) => sum + force.getMagnitude(), 0);
            const length = this.beam_.Length;
            let eqR1 = new Array(supports.length).fill(1);
            let equations = [eqR1];
            for (let j = 0; j < supports.length - 1; j++) {
                let eqR = [];
                for (let i = 0; i < supports.length; i++) {
                    eqR.push(supports[i].Location - supports[j].Location);
                }
                equations.push(eqR);
            }
            const lhs = [forceSum];
            for (let j = 0; j < supports.length - 1; j++) {
                const magSum = forces.reduce((sum, force) => sum + force.getMomentAround(supports[j].Location), 0);
                lhs.push(magSum);
            }
            const reactionResults = BaseSolver.solveLinearSystem(equations, lhs);
            console.log("equations", equations);
            console.log("lhs", lhs);
            console.log("results", reactionResults);
            for (let j = 0; j < supports.length; j++) {
                const reaction = supports[j].Reaction;
                reaction.setMagnitude(reactionResults[j]);
            }
            return true;
        }
        return true;
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
