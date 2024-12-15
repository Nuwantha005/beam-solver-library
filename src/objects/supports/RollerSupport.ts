import BaseReaction from "../Forces/reactions/BaseReaction";
import SimpleReaction from "../Forces/reactions/SimpleReaction";
import { BaseSupport, supportType } from "./BaseSupport";

export class RollerSupport extends BaseSupport {
  constructor(location: number) {
    super(location, supportType.rollerSupport);
    this._reaction = new SimpleReaction(0, "up", 0);
  }
  get Reaction(): BaseReaction {
    return this._reaction;
  }
  set Reaction(reaction: SimpleReaction) {
    this._reaction = reaction;
  }
  private _reaction: SimpleReaction;
}

export default RollerSupport;
