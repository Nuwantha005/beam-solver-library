"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beam = void 0;
const CustomSection_1 = require("./crossSections/CustomSection");
class Beam {
    constructor(length, EModulus, crossSection) {
        this._eModulus = 0; // Initialize with a default value
        this._crossSection = new CustomSection_1.CustomSection();
        this._length = length;
        if (EModulus !== undefined) {
            this._eModulus = EModulus;
        }
        if (crossSection !== undefined) {
            this._crossSection = crossSection;
        }
    }
    get crossSection() {
        return this._crossSection;
    }
    set crossSection(value) {
        this._crossSection = value;
    }
    get Length() {
        return this._length;
    }
    set Length(value) {
        if (value <= 0) {
            throw new Error("Length must be positive.");
        }
        this._length = value;
    }
    get EModulus() {
        return this._eModulus;
    }
    set EModulus(value) {
        if (value <= 0) {
            throw new Error("EModulus must be positive.");
        }
        this._eModulus = value;
    }
}
exports.Beam = Beam;
