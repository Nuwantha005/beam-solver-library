import { BaseSection } from "./crossSections/CrossSection";
export declare class Beam {
    private _length;
    private _eModulus;
    private _crossSection;
    constructor(length: number, EModulus?: number, crossSection?: BaseSection);
    get crossSection(): BaseSection;
    set crossSection(value: BaseSection);
    get Length(): number;
    set Length(value: number);
    get EModulus(): number;
    set EModulus(value: number);
}
