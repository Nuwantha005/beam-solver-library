export declare enum supportType {
    pinnedSupport = 0,
    rollerSupport = 1,
    fixedSupport = 2,
    simpleSupport = 3
}
export declare abstract class BaseSupport {
    private _loc;
    private _supportType;
    constructor(location: number, supportType: supportType);
    get Location(): number;
    set Location(loc: number);
}
