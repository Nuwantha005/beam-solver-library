import BaseReaction from "../Forces/reactions/BaseReaction";

export enum supportType {
  pinnedSupport,
  rollerSupport,
  fixedSupport,
  simpleSupport,
}

export abstract class BaseSupport {
  private _loc: number;
  private _supportType: supportType;

  constructor(location: number, supportType: supportType) {
    this._loc = location;
    this._supportType = supportType;
  }
  get SupportType() {
    return this._supportType;
  }

  get Location() {
    return this._loc;
  }
  set Location(loc: number) {
    this._loc = loc;
  }

  abstract get Reaction(): BaseReaction;
  abstract set Reaction(reaction: BaseReaction);
}
