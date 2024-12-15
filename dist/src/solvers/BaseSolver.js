"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSolver = void 0;
class BaseSolver {
    constructor(beam) {
        this.beam = beam;
    }
    getBeam() {
        return this.beam;
    }
    setBeam(beam) {
        this.beam = beam;
    }
}
exports.BaseSolver = BaseSolver;
