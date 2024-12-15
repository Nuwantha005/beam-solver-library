"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moment_1 = __importDefault(require("./Moment"));
class BaseForce {
    constructor(magnitude, direction, x, y) {
        this.magnitude = magnitude;
        this.angle = direction;
        this.x = x;
        this.y = y;
    }
    getMomentAround(x, y) {
        if (y !== undefined) {
            // Moment = magnitude * perp distance from line of action of force to the point
            // Total moment = moment of x component + moment of y component
            const mX = this.getXComponent() * (this.y - y);
            const mY = this.getYComponent() * (this.x - x);
            return new Moment_1.default(mY - mX, mY > mX ? "ccw" : "cw", x);
        }
        else {
            // Moment = magnitude * perp distance from line of action of force to the point
            // Total moment = moment of x component + moment of y component
            const mX = this.getXComponent() * (this.y - 0); // Assuming y is 0 if not provided
            const mY = this.getYComponent() * (this.x - x);
            return mY - mX;
        }
    }
    getXComponent() {
        return this.magnitude * Math.cos(this.angle);
    }
    getYComponent() {
        return this.magnitude * Math.sin(this.angle);
    }
    getMagnitude() {
        return this.magnitude;
    }
    getDirection() {
        return this.angle;
    }
    setMagnitude(magnitude) {
        this.magnitude = magnitude;
    }
    setDirection(direction) {
        this.angle = direction;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
    }
}
exports.default = BaseForce;
