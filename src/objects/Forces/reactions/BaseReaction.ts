import BaseForce from "../BaseFroce";
import Moment from "../Moment";
import { IReaction } from "./IReaction";

class BaseReaction extends BaseForce implements IReaction {
  private moment: Moment;

  constructor(
    magnitude: number,
    direction: number,
    x: number,
    y: number,
    moment: Moment = new Moment(0, "ccw", x, y)
  ) {
    super(magnitude, direction, x, y);
    this.moment = moment;
  }

  setMoment(moment: Moment): void {
    this.moment = moment;
  }

  getMoment(): Moment {
    return this.moment;
  }

  // ...existing code...
}

export default BaseReaction;
