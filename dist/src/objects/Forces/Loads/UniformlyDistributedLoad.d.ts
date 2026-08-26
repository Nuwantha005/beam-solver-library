import DistributedLoad from "./DistributedLoad";
import PointLoad from "./PointLoad";
import Moment from "../Moment";
declare class UniformlyDistributedLoad extends DistributedLoad {
    loadVal: number;
    private _loadVal;
    constructor(startLocation: number, endLocation: number, loadVal: number);
    getEquivalentPointLoad(): PointLoad;
    getMomentAround(x: number): Moment;
}
export default UniformlyDistributedLoad;
