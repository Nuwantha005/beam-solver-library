import BaseForce from "../Forces/BaseFroce";
import Moment from "../Forces/Moment";

export enum supportType {
  PINNED,
  ROLLER,
  FIXED,
  SIMPLE,
}

export abstract class BaseSupport {
  private _loc: number;
  private _supportType: supportType;
  private _moment;

  constructor(location: number, supportType: supportType, moment: Moment) {
    this._loc = location;
    this._supportType = supportType;
    this._moment = new Moment(0, "cw", location, 0);
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

  abstract get Reaction(): BaseForce;
  abstract set Reaction(reaction: BaseSupport);

  abstract get Moment(): Moment;
  abstract set Moment(Moment: Moment);
}
