"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Moment {
    constructor(magnitude, direction, location) {
        this._magnitude = magnitude;
        this._direction = direction;
        this._location = location;
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
    // Getter for location
    get location() {
        return this._location;
    }
    // Setter for location
    set location(value) {
        this._location = value;
    }
}
exports.default = Moment;
