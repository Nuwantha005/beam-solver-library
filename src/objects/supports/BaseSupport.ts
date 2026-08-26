import BaseForce from "../Forces/BaseForce";
import Moment from "../Forces/Moment";

export enum supportType {
  PINNED,
  ROLLER,
  FIXED,
  SIMPLE,
}

export abstract class BaseSupport {
  protected _loc: number;
  protected _supportType: supportType;
  protected _moment: Moment;

  constructor(location: number, supportType: supportType, moment?: Moment) {
    this._loc = location;
    this._supportType = supportType;
    this._moment = moment ?? new Moment(0, "cw", location, 0);
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
  abstract set Reaction(reaction: BaseForce);

  get Moment(): Moment {
    return this._moment;
  }
  set Moment(moment: Moment) {
    this._moment = moment;
  }
}
