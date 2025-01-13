import DistributedLoad from "./DistributedLoad";
import PointLoad from "./PointLoad";
import Moment from "../Moment";

class UniformlyDistributedLoad extends DistributedLoad {
  private _loadVal: number;

  constructor(
    startLocation: number,
    endLocation: number,
    public loadVal: number
  ) {
    super(startLocation, endLocation);
    this._loadVal = loadVal;
  }

  getEquivalentPointLoad(): PointLoad {
    const length = this.endLocation - this.startLocation;
    const middlePoint = this.startLocation + length / 2;
    const totalLoad = this._loadVal * length;
    if (totalLoad > 0) {
      return new PointLoad(totalLoad, middlePoint);
    } else {
      return new PointLoad(totalLoad, middlePoint);
    }
  }

  getMomentAround(x: number): Moment {
    if (x < this.startLocation) {
      return new Moment();
    } else if (this.endLocation < x) {
      return this.getEquivalentPointLoad().getMomentAround(x, 0);
    } else {
      const backLenth = x - this.startLocation;
      const backLoadVal = backLenth * this.loadVal;
      const backLoadLoc = this.startLocation + backLenth / 2;
      const backLoad = new PointLoad(backLoadVal, backLoadLoc);
      return backLoad.getMomentAround(x, 0);
    }
  }
}

export default UniformlyDistributedLoad;
