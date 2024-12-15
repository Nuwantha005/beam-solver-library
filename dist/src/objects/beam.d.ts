import { BaseSection } from "./crossSections/CrossSection";
import BaseForce from "./Forces/BaseFroce";
import { BaseSupport } from "./supports/BaseSupport";
export declare class Beam {
    private _length;
    private _eModulus;
    private _crossSection;
    private _forces;
    private _supports;
    constructor(length: number, EModulus?: number, crossSection?: BaseSection);
    getBeamType(): BeamType;
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
}
export declare enum BeamType {
    SIMPLY_SUPPORTED = 0,
    CANTELIVER = 1,
    ROLLER_SUPPORTED = 2,
    FIXED = 3,
    CONTINUOUS = 4,
    NONE = 5
}
