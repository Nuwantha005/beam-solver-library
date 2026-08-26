import Moment from "../Moment";
import PointLoad from "./PointLoad";
import { ILoad, LoadType } from "./ILoad";
declare abstract class DistributedLoad implements ILoad {
    startLocation: number;
    endLocation: number;
    constructor(startLocation: number, endLocation: number);
    get loadType(): LoadType;
    get start(): number;
    set start(value: number);
    get end(): number;
    set end(value: number);
    getTotalHorizontalForce(): number;
    getTotalVerticalForce(): number;
    abstract getEquivalentPointLoad(): PointLoad;
    abstract getMomentAround(x: number, y?: number): Moment;
}
export default DistributedLoad;
export { DistributedLoad };
