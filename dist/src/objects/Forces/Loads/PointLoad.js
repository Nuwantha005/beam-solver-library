"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleForce_1 = __importDefault(require("../SimpleForce"));
class PointLoad extends SimpleForce_1.default {
    constructor(magnitude, x) {
        if (magnitude > 0) {
            super(magnitude, "down", x);
        }
        else {
            super(magnitude, "up", x);
        }
    }
    getMagnitude() {
        if (this.magnitude > 0) {
            return this.magnitude;
        }
        else {
            return -1 * this.magnitude;
        }
    }
    setMagnitude(value) {
        this.magnitude = value;
        this.angle = value > 0 ? -90 : 90;
    }
}
exports.default = PointLoad;
