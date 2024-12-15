"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFroce_1 = __importDefault(require("./BaseFroce"));
class SimpleForce extends BaseFroce_1.default {
    constructor(magnitude, direction, x) {
        const angle = direction === "up" ? 90 : -90;
        super(magnitude, angle, x, 0);
    }
    // Override setY to prevent changing y value
    setY(y) {
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
}
exports.default = SimpleForce;
