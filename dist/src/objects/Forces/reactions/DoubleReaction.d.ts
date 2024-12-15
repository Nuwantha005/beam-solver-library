import BaseReaction from "./BaseReaction";
declare class DoubleReaction extends BaseReaction {
    constructor(magnitude: number, direction: number, x: number, y: number);
    set Moment(value: any);
    get Moment(): any;
}
export default DoubleReaction;
