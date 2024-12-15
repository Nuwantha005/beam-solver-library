"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Moment {
    constructor(magnitude, direction, x, y = 0) {
        this._magnitude = magnitude;
        this._direction = direction;
        this._x = x;
        this._y = y;
    }
    // Getter for magnitude
    get magnitude() {
        return this._magnitude;
    }
    // Setter for magnitude
    set magnitude(value) {
        this._magnitude = value;
    }
    // Getter for direction
    get direction() {
        return this._direction;
    }
    // Setter for direction
    set direction(value) {
        this._direction = value;
    }
    // Getter for x
    get x() {
        return this._x;
    }
    // Setter for x
    set x(value) {
        this._x = value;
    }
    // Getter for y
    get y() {
        return this._y;
    }
    // Setter for y
    set y(value) {
        this._y = value;
    }
}
exports.default = Moment;
