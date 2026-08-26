import Moment from "./Moment";
import { IForce } from "./IForce";
import { ILoad, LoadType } from "./Loads/ILoad";

abstract class BaseForce implements IForce, ILoad {
  protected magnitude: number;
  protected angle: number;
  // acting point
  protected x: number;
  protected y: number;

  constructor(magnitude: number, direction: number, x: number, y: number) {
    this.magnitude = magnitude;
    this.angle = direction;
    this.x = x;
    this.y = y;
  }

  get loadType(): LoadType {
    return LoadType.POINT;
  }

  get startLocation(): number {
    return this.x;
  }

  get endLocation(): number {
    return this.x;
  }

  getTotalVerticalForce(): number {
    return this.getYComponent();
  }

  getTotalHorizontalForce(): number {
    return this.getXComponent();
  }

  // Overload signatures
  getMomentAround(x: number, y: number): Moment;
  getMomentAround(x: number): number;

  getMomentAround(x: number, y?: number): Moment | number {
    if (y !== undefined) {
      // Moment = magnitude * perp distance from line of action of force to the point
      // Total moment = moment of x component + moment of y component
      const mX = this.getXComponent() * (this.y - y);
      const mY = this.getYComponent() * (this.x - x);
      return new Moment(mY - mX, mY > mX ? "ccw" : "cw", x, y);
    } else {
      // Moment = magnitude * perp distance from line of action of force to the point
      // Total moment = moment of x component + moment of y component
      const mX = this.getXComponent() * (this.y - 0); // Assuming y is 0 if not provided
      const mY = this.getYComponent() * (this.x - x);
      return mY - mX;
    }
  }

  getXComponent(): number {
    return this.magnitude * Math.cos(this.angle);
  }

  getYComponent(): number {
    return this.magnitude * Math.sin(this.angle);
  }

  getMagnitude(): number {
    return this.magnitude;
  }

  getDirection(): number {
    return this.angle;
  }

  setMagnitude(magnitude: number): void {
    this.magnitude = magnitude;
  }

  setDirection(direction: number): void {
    this.angle = direction;
  }
  getX(): number {
    return this.x;
  }
  setX(x: number): void {
    this.x = x;
  }
  getY(): number {
    return this.y;
  }
  setY(y: number): void {
    this.y = y;
  }
}

export default BaseForce;
export { BaseForce };
