import SimpleForce from "../Forces/SimpleForce";
import { BaseSupport, supportType } from "./BaseSupport";
import Moment from "../Forces/Moment";

export class RollerSupport extends BaseSupport {
  private _reaction: SimpleForce;
  constructor(location: number) {
    super(location, supportType.ROLLER, new Moment(0, "cw", location, 0));
    this._reaction = new SimpleForce(0, "up", location);
  }
  get Reaction(): SimpleForce {
    return this._reaction;
  }
  set Reaction(reaction: SimpleForce) {
    this._reaction = reaction;
  }
}

export default RollerSupport;
