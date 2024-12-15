export declare class Beam {
    private _length;
    private _eModulus;
    constructor(length: number, EModulus?: number);
    get Length(): number;
    set Length(value: number);
    get EModulus(): number;
    set EModulus(value: number);
}
