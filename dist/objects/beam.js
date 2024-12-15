"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beam = void 0;
class Beam {
    constructor(length) {
        this.length = length;
        this.forces = [];
    }
    addForce(position, magnitude) {
        if (position < 0 || position > this.length) {
            throw new Error("Force position is out of bounds.");
        }
        this.forces.push({ position, magnitude });
    }
    calculateBendingMoment() {
        // Add bending moment calculations here
        return this.forces.map(f => f.magnitude * f.position);
    }
}
exports.Beam = Beam;
