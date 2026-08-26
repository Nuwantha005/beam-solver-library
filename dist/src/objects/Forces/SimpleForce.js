"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseForce_1 = __importDefault(require("./BaseForce"));
class SimpleForce extends BaseForce_1.default {
    constructor(magnitude, direction, x) {
        const angle = direction === "up" ? 90 : -90;
        super(magnitude, angle, x, 0);
    }
    // Override setY to prevent changing y value
    setY(_y) {
        // y is always 0 and cannot be changed
        throw new Error("Modification of y is not allowed.");
    }
    // Override getY to always return 0
    getY() {
        return 0;
    }
    // Single implementation
    getMomentAround(x, y) {
        if (y !== undefined) {
            return super.getMomentAround(x, y);
        }
        else {
            return super.getMomentAround(x);
        }
    }
    getXComponent() {
        return 0;
    }
    getYComponent() {
        return this.magnitude;
    }
    getTotalVerticalForce() {
        return this.angle >= 0 ? this.magnitude : -this.magnitude;
    }
    setMagnitude(magnitude) {
        if (magnitude > 0) {
            this.magnitude = magnitude;
            this.setDirection(90);
        }
        else if (magnitude == 0) {
            this.magnitude = 0;
            this.setDirection(0);
        }
        else {
            this.magnitude = -1 * magnitude;
            this.setDirection(-90);
        }
    }
}
exports.default = SimpleForce;
