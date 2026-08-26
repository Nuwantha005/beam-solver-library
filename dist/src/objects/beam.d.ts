import { BaseSection } from "./crossSections/CrossSection";
import BaseForce from "./Forces/BaseForce";
import { BaseSupport } from "./supports/BaseSupport";
import { ILoad } from "./Forces/Loads/ILoad";
import DistributedLoad from "./Forces/Loads/DistributedLoad";
import MomentLoad from "./Forces/Loads/MomentLoad";
import { AnalysisResult, AnalysisOptions } from "../results/AnalysisResult";
export declare class Beam {
    private _length;
    private _eModulus;
    private _crossSection;
    private _loads;
    private _supports;
    constructor(length: number, EModulus?: number, crossSection?: BaseSection);
    get BeamType(): BeamType;
    /**
     * Adds any valid load (PointLoad, Force2D, UDL, Trapezoidal, or MomentLoad) to the beam.
     */
    addLoad(load: ILoad): void;
    /**
     * Returns all loads applied to the beam.
     */
    getLoads(): ILoad[];
    /**
     * Sets the applied loads, replacing existing ones after boundary validation.
     */
    setLoads(loads: ILoad[]): void;
    /**
     * Removes all loads from the beam.
     */
    removeLoads(): void;
    /**
     * Returns all concentrated point loads / forces.
     */
    getPointLoads(): BaseForce[];
    /**
     * Returns all distributed loads (UDL, Trapezoidal).
     */
    getDistributedLoads(): DistributedLoad[];
    /**
     * Returns all applied concentrated moments.
     */
    getAppliedMoments(): MomentLoad[];
    addForce(force: BaseForce): void;
    getForces(): BaseForce[];
    setForces(forces: BaseForce[]): void;
    removeForces(): void;
    addSupport(support: BaseSupport): void;
    getSupports(): BaseSupport[];
    setSupports(supports: BaseSupport[]): void;
    removeSupports(): void;
    get crossSection(): BaseSection;
    set crossSection(value: BaseSection);
    get Length(): number;
    set Length(value: number);
    get EModulus(): number;
    set EModulus(value: number);
    analyze(options?: AnalysisOptions): AnalysisResult;
}
export declare enum BeamType {
    SIMPLY_SUPPORTED = 0,
    CANTELIVER = 1,
    ROLLER_SUPPORTED = 2,
    FIXED = 3,
    CONTINUOUS = 4,
    NONE = 5
}
