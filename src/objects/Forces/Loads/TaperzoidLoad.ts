import Moment from "../Moment";
import DistributedLoad from "./DistributedLoad";
import PointLoad from "./PointLoad";

class TaperzoidLoad extends DistributedLoad {
  constructor(
    startLocation: number,
    endLocation: number,
    public startLoad: number,
    public endLoad: number
  ) {
    super(startLocation, endLocation);
  }

  getEquivalentPointLoad(): PointLoad {
    const length = this.endLocation - this.startLocation;
    const loadPoint = this.getCentroidLoc(
      this.startLocation,
      this.endLocation,
      this.startLoad,
      this.endLoad
    );
    const totalLoad = 0.5 * (this.startLoad + this.endLoad) * length;
    if (totalLoad > 0) {
      return new PointLoad(totalLoad, loadPoint);
    } else {
      return new PointLoad(totalLoad, loadPoint);
    }
  }

  getMomentAround(x: number): Moment {
    if (x < this.startLocation) {
      return new Moment();
    } else if (this.endLocation < x) {
      return this.getEquivalentPointLoad().getMomentAround(x, 0);
    } else {
      const backLenth = x - this.startLocation;
      const loadAtX =
        this.startLoad +
        (x - this.startLocation) *
          ((this.endLoad - this.startLoad) /
            (this.endLocation - this.startLocation));
      const backLoadVal = 0.5 * (this.startLoad + loadAtX) * backLenth;
      const backLoadLoc = this.getCentroidLoc(
        this.startLocation,
        x,
        this.startLoad,
        loadAtX
      );
      const eqLoad = new PointLoad(backLoadVal, backLoadLoc);
      return eqLoad.getMomentAround(x, 0);
    }
  }

  private getCentroidLoc(a: number, b: number, w1: number, w2: number): number {
    const l = b - a;
    const btmMag = l * w1;
    const topMag = 0.5 * (w2 - w1) * l;
    const totMag = btmMag + topMag;
    const btmLoc = a + l / 2;
    const topLoc = a + (l * 2) / 3;

    const loc = (topMag * topLoc + btmMag * btmLoc) / totMag;
    return loc;
  }
}

export default TaperzoidLoad;
