import Force2D from "../Forces/Force2D";
import Moment from "../Forces/Moment";
import { BaseSupport, supportType } from "./BaseSupport";

export class FixedSupport extends BaseSupport {
  private _reaction: Force2D;

  constructor(location: number) {
    super(location, supportType.FIXED, new Moment(0, "cw", location, 0));
    this._reaction = new Force2D(0, 0, location);
  }

  get Reaction(): Force2D {
    return this._reaction;
  }

  set Reaction(reaction: Force2D) {
    this._reaction = reaction;
  }
}

export default FixedSupport;
