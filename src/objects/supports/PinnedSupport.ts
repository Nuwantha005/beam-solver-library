import Force2D from "../Forces/Force2D";
import { BaseSupport, supportType } from "./BaseSupport";
import Moment from "../Forces/Moment";

export class PinnedSupport extends BaseSupport {
  private _reaction: Force2D;

  constructor(location: number) {
    super(location, supportType.PINNED, new Moment(0, "cw", 0, 0));
    this._reaction = new Force2D(0, 0, location);
  }
  get Reaction(): Force2D {
    return this._reaction;
  }
  set Reaction(reaction: Force2D) {
    this._reaction = reaction;
  }
  get Moment(): Moment {
    return this.Moment;
  }

  set Moment(moment: Moment) {
    //
  }
}

export default PinnedSupport;
