"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeamType = exports.Beam = void 0;
const CustomSection_1 = require("./crossSections/CustomSection");
const BaseSupport_1 = require("./supports/BaseSupport");
class Beam {
    constructor(length, EModulus, crossSection) {
        this._eModulus = 0; // Initialize with a default value
        this._crossSection = new CustomSection_1.CustomSection();
        this._forces = [];
        this._supports = [];
        this._length = length;
        if (EModulus !== undefined) {
            this._eModulus = EModulus;
        }
        if (crossSection !== undefined) {
            this._crossSection = crossSection;
        }
    }
    getBeamType() {
        // if only has pinned supoorts, its simply supported beam
        let type = BeamType.NONE;
        let hasPinnedSupport = false;
        let hasRollerSupport = false;
        let hasFixedSupport = false;
        let hasSupportsAtEnd = false;
        let hasSupportAtStart = false;
        this._supports.forEach((support) => {
            if (support.SupportType === BaseSupport_1.supportType.pinnedSupport) {
                hasPinnedSupport = true;
            }
            else if (support.SupportType === BaseSupport_1.supportType.rollerSupport) {
                hasRollerSupport = true;
            }
            else if (support.SupportType === BaseSupport_1.supportType.fixedSupport) {
                hasFixedSupport = true;
            }
            if (support.Location == 0) {
                hasSupportAtStart = true;
            }
            if (support.Location == this._length) {
                hasSupportsAtEnd = true;
            }
        });
        if (hasPinnedSupport && !hasRollerSupport && !hasFixedSupport) {
            type = BeamType.SIMPLY_SUPPORTED;
        }
        else if (hasPinnedSupport && hasRollerSupport && !hasFixedSupport) {
            type = BeamType.ROLLER_SUPPORTED;
        }
        else if ((hasFixedSupport && !hasSupportAtStart) ||
            (hasFixedSupport && !hasSupportsAtEnd)) {
            type = BeamType.CANTELIVER;
        }
        else if (hasFixedSupport) {
            type = BeamType.FIXED;
        }
        return type;
    }
    addForce(force) {
        this._forces.push(force);
    }
    getForces() {
        return this._forces;
    }
    setForces(forces) {
        this._forces = forces;
    }
    removeForces() {
        this._forces = [];
    }
    addSupport(support) {
        this._supports.push(support);
    }
    getSupports() {
        return this._supports;
    }
    setSupports(supports) {
        this._supports = supports;
    }
    removeSupports() {
        this._supports = [];
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
var BeamType;
(function (BeamType) {
    BeamType[BeamType["SIMPLY_SUPPORTED"] = 0] = "SIMPLY_SUPPORTED";
    BeamType[BeamType["CANTELIVER"] = 1] = "CANTELIVER";
    BeamType[BeamType["ROLLER_SUPPORTED"] = 2] = "ROLLER_SUPPORTED";
    BeamType[BeamType["FIXED"] = 3] = "FIXED";
    BeamType[BeamType["NONE"] = 4] = "NONE";
})(BeamType || (exports.BeamType = BeamType = {}));
