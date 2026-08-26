import Moment from "../Moment";
import { ILoad, LoadType } from "./ILoad";

export class MomentLoad implements ILoad {
  private _magnitude: number;
  private _direction: "cw" | "ccw";
  private _location: number;

  constructor(
    magnitude: number,
    direction: "cw" | "ccw" = "ccw",
    location: number = 0
  ) {
    this._magnitude = Math.abs(magnitude);
    this._direction = direction;
    this._location = location;
  }

  get loadType(): LoadType {
    return LoadType.MOMENT;
  }

  get startLocation(): number {
    return this._location;
  }

  get endLocation(): number {
    return this._location;
  }

  get location(): number {
    return this._location;
  }

  set location(value: number) {
    this._location = value;
  }

  get magnitude(): number {
    return this._magnitude;
  }

  set magnitude(value: number) {
    this._magnitude = Math.abs(value);
  }

  get direction(): "cw" | "ccw" {
    return this._direction;
  }

  set direction(value: "cw" | "ccw") {
    this._direction = value;
  }

  /**
   * Pure moments exert no net vertical force.
   */
  getTotalVerticalForce(): number {
    return 0;
  }

  /**
   * Pure moments exert no net horizontal force.
   */
  getTotalHorizontalForce(): number {
    return 0;
  }

  /**
   * Returns the concentrated moment contribution.
   * A pure couple produces an invariant moment about any coordinate.
   */
  getMomentAround(x: number, y?: number): Moment {
    return new Moment(this._magnitude, this._direction, x, y ?? 0);
  }

  /**
   * Returns signed scalar moment value (positive for CCW, negative for CW).
   */
  getSignedMagnitude(): number {
    return this._direction === "ccw" ? this._magnitude : -this._magnitude;
  }
}

export default MomentLoad;
