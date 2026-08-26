import Moment from "../Moment";
import DistributedLoad from "./DistributedLoad";
import PointLoad from "./PointLoad";
declare class TaperzoidLoad extends DistributedLoad {
    startLoad: number;
    endLoad: number;
    constructor(startLocation: number, endLocation: number, startLoad: number, endLoad: number);
    getEquivalentPointLoad(): PointLoad;
    getMomentAround(x: number): Moment;
    private getCentroidLoc;
}
export default TaperzoidLoad;
