"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MomentLoad = void 0;
const Moment_1 = __importDefault(require("../Moment"));
const ILoad_1 = require("./ILoad");
class MomentLoad {
    constructor(magnitude, direction = "ccw", location = 0) {
        this._magnitude = Math.abs(magnitude);
        this._direction = direction;
        this._location = location;
    }
    get loadType() {
        return ILoad_1.LoadType.MOMENT;
    }
    get startLocation() {
        return this._location;
    }
    get endLocation() {
        return this._location;
    }
    get location() {
        return this._location;
    }
    set location(value) {
        this._location = value;
    }
    get magnitude() {
        return this._magnitude;
    }
    set magnitude(value) {
        this._magnitude = Math.abs(value);
    }
    get direction() {
        return this._direction;
    }
    set direction(value) {
        this._direction = value;
    }
    /**
     * Pure moments exert no net vertical force.
     */
    getTotalVerticalForce() {
        return 0;
    }
    /**
     * Pure moments exert no net horizontal force.
     */
    getTotalHorizontalForce() {
        return 0;
    }
    /**
     * Returns the concentrated moment contribution.
     * A pure couple produces an invariant moment about any coordinate.
     */
    getMomentAround(x, y) {
        return new Moment_1.default(this._magnitude, this._direction, x, y !== null && y !== void 0 ? y : 0);
    }
    /**
     * Returns signed scalar moment value (positive for CCW, negative for CW).
     */
    getSignedMagnitude() {
        return this._direction === "ccw" ? this._magnitude : -this._magnitude;
    }
}
exports.MomentLoad = MomentLoad;
exports.default = MomentLoad;
