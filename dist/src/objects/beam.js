"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeamType = exports.Beam = void 0;
const CustomSection_1 = require("./crossSections/CustomSection");
const BaseSupport_1 = require("./supports/BaseSupport");
const ILoad_1 = require("./Forces/Loads/ILoad");
const BeamErrors_1 = require("../errors/BeamErrors");
const BeamAnalyzer_1 = __importDefault(require("../solvers/BeamAnalyzer"));
class Beam {
    constructor(length, EModulus, crossSection) {
        this._eModulus = 0;
        this._crossSection = new CustomSection_1.CustomSection();
        this._loads = [];
        this._supports = [];
        if (length <= 0) {
            throw new BeamErrors_1.InvalidGeometryError("Length must be positive.");
        }
        this._length = length;
        if (EModulus !== undefined) {
            if (EModulus <= 0) {
                throw new BeamErrors_1.InvalidGeometryError("EModulus must be positive.");
            }
            this._eModulus = EModulus;
        }
        if (crossSection !== undefined) {
            this._crossSection = crossSection;
        }
    }
    get BeamType() {
        let type = BeamType.NONE;
        let hasPinnedSupport = false;
        let hasRollerSupport = false;
        let hasFixedSupport = false;
        let hasSupportsAtEnd = false;
        let hasSupportAtStart = false;
        this._supports.forEach((support) => {
            if (support.SupportType === BaseSupport_1.supportType.PINNED) {
                hasPinnedSupport = true;
            }
            else if (support.SupportType === BaseSupport_1.supportType.ROLLER) {
                hasRollerSupport = true;
            }
            else if (support.SupportType === BaseSupport_1.supportType.FIXED) {
                hasFixedSupport = true;
            }
            if (support.Location === 0) {
                hasSupportAtStart = true;
            }
            if (support.Location === this._length) {
                hasSupportsAtEnd = true;
            }
        });
        if (this._supports.length > 2) {
            type = BeamType.CONTINUOUS;
        }
        else {
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
        }
        return type;
    }
    // --- Load Management ---
    /**
     * Adds any valid load (PointLoad, Force2D, UDL, Trapezoidal, or MomentLoad) to the beam.
     */
    addLoad(load) {
        if (load.startLocation < 0 ||
            load.endLocation > this._length ||
            load.startLocation > load.endLocation) {
            throw new BeamErrors_1.InvalidGeometryError(`Load coordinates [${load.startLocation}, ${load.endLocation}] are outside beam span [0, ${this._length}].`);
        }
        this._loads.push(load);
    }
    /**
     * Returns all loads applied to the beam.
     */
    getLoads() {
        return this._loads;
    }
    /**
     * Sets the applied loads, replacing existing ones after boundary validation.
     */
    setLoads(loads) {
        this.removeLoads();
        loads.forEach((load) => this.addLoad(load));
    }
    /**
     * Removes all loads from the beam.
     */
    removeLoads() {
        this._loads = [];
    }
    /**
     * Returns all concentrated point loads / forces.
     */
    getPointLoads() {
        return this._loads.filter((l) => l.loadType === ILoad_1.LoadType.POINT);
    }
    /**
     * Returns all distributed loads (UDL, Trapezoidal).
     */
    getDistributedLoads() {
        return this._loads.filter((l) => l.loadType === ILoad_1.LoadType.DISTRIBUTED);
    }
    /**
     * Returns all applied concentrated moments.
     */
    getAppliedMoments() {
        return this._loads.filter((l) => l.loadType === ILoad_1.LoadType.MOMENT);
    }
    // --- Backwards Compatibility for Forces ---
    addForce(force) {
        this.addLoad(force);
    }
    getForces() {
        return this.getPointLoads();
    }
    setForces(forces) {
        // Retain non-point loads if any, replace point loads
        const nonPointLoads = this._loads.filter((l) => l.loadType !== ILoad_1.LoadType.POINT);
        this._loads = [...nonPointLoads];
        forces.forEach((f) => this.addLoad(f));
    }
    removeForces() {
        this._loads = this._loads.filter((l) => l.loadType !== ILoad_1.LoadType.POINT);
    }
    // --- Support Management ---
    addSupport(support) {
        if (support.Location < 0 || support.Location > this._length) {
            throw new BeamErrors_1.InvalidGeometryError(`Support location ${support.Location} is outside beam span [0, ${this._length}].`);
        }
        this._supports.push(support);
    }
    getSupports() {
        return this._supports;
    }
    setSupports(supports) {
        this.removeSupports();
        supports.forEach((s) => this.addSupport(s));
    }
    removeSupports() {
        this._supports = [];
    }
    // --- Section & Material Properties ---
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
            throw new BeamErrors_1.InvalidGeometryError("Length must be positive.");
        }
        this._length = value;
    }
    get EModulus() {
        return this._eModulus;
    }
    set EModulus(value) {
        if (value <= 0) {
            throw new BeamErrors_1.InvalidGeometryError("EModulus must be positive.");
        }
        this._eModulus = value;
    }
    // --- End-to-End Analysis ---
    analyze(options) {
        return BeamAnalyzer_1.default.analyze(this, options);
    }
}
exports.Beam = Beam;
var BeamType;
(function (BeamType) {
    BeamType[BeamType["SIMPLY_SUPPORTED"] = 0] = "SIMPLY_SUPPORTED";
    BeamType[BeamType["CANTELIVER"] = 1] = "CANTELIVER";
    BeamType[BeamType["ROLLER_SUPPORTED"] = 2] = "ROLLER_SUPPORTED";
    BeamType[BeamType["FIXED"] = 3] = "FIXED";
    BeamType[BeamType["CONTINUOUS"] = 4] = "CONTINUOUS";
    BeamType[BeamType["NONE"] = 5] = "NONE";
})(BeamType || (exports.BeamType = BeamType = {}));
