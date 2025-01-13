import Moment from "../Moment";
import PointLoad from "./PointLoad";

abstract class DistributedLoad {
  constructor(public startLocation: number, public endLocation: number) {}
  get start(): number {
    return this.startLocation;
  }

  set start(value: number) {
    this.startLocation = value;
  }

  get end(): number {
    return this.endLocation;
  }

  set end(value: number) {
    this.endLocation = value;
  }
  abstract getEquivalentPointLoad(): PointLoad;
  abstract getMomentAround(x: number): Moment;
}

export default DistributedLoad;
