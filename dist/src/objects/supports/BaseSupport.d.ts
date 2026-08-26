import BaseForce from "../Forces/BaseForce";
import Moment from "../Forces/Moment";
export declare enum supportType {
    PINNED = 0,
    ROLLER = 1,
    FIXED = 2,
    SIMPLE = 3
}
export declare abstract class BaseSupport {
    protected _loc: number;
    protected _supportType: supportType;
    protected _moment: Moment;
    constructor(location: number, supportType: supportType, moment?: Moment);
    get SupportType(): supportType;
    get Location(): number;
    set Location(loc: number);
    abstract get Reaction(): BaseForce;
    abstract set Reaction(reaction: BaseForce);
    get Moment(): Moment;
    set Moment(moment: Moment);
}
