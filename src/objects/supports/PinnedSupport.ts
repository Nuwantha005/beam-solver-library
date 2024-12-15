import BaseReaction from "../Forces/reactions/BaseReaction";
import DoubleReaction from "../Forces/reactions/DoubleReaction";
import { BaseSupport, supportType } from "./BaseSupport";

export class PinnedSupport extends BaseSupport {
  constructor(location: number) {
    super(location, supportType.pinnedSupport);
    this._reaction = new DoubleReaction(0, 0, 0, 0);
  }
  get Reaction(): BaseReaction {
    return this._reaction;
  }
  set Reaction(reaction: DoubleReaction) {
    this._reaction = reaction;
  }
  private _reaction: DoubleReaction;
}

export default PinnedSupport;
