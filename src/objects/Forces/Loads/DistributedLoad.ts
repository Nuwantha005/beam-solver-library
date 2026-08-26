import Moment from "../Moment";
import PointLoad from "./PointLoad";
import { ILoad, LoadType } from "./ILoad";

abstract class DistributedLoad implements ILoad {
  constructor(public startLocation: number, public endLocation: number) {}

  get loadType(): LoadType {
    return LoadType.DISTRIBUTED;
  }

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

  getTotalHorizontalForce(): number {
    return 0;
  }

  getTotalVerticalForce(): number {
    return this.getEquivalentPointLoad().getTotalVerticalForce();
  }

  abstract getEquivalentPointLoad(): PointLoad;
  abstract getMomentAround(x: number, y?: number): Moment;
}

export default DistributedLoad;
export { DistributedLoad };
