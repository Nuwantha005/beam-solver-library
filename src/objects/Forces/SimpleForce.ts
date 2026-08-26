import BaseForce from "./BaseForce";
import Moment from "./Moment";

class SimpleForce extends BaseForce {
  constructor(magnitude: number, direction: "up" | "down", x: number) {
    const angle = direction === "up" ? 90 : -90;
    super(magnitude, angle, x, 0);
  }

  // Override setY to prevent changing y value
  setY(y: number): void {
    // y is always 0 and cannot be changed
    throw new Error("Modification of y is not allowed.");
  }

  // Override getY to always return 0
  getY(): number {
    return 0;
  }

  // Overload signatures
  getMomentAround(x: number, y: number): Moment;
  getMomentAround(x: number): number;

  // Single implementation
  getMomentAround(x: number, y?: number): Moment | number {
    if (y !== undefined) {
      return super.getMomentAround(x, y);
    } else {
      return super.getMomentAround(x);
    }
  }
  getXComponent(): number {
    return 0;
  }
  getYComponent(): number {
    return this.magnitude;
  }

  setMagnitude(magnitude: number): void {
    if (magnitude > 0) {
      this.magnitude = magnitude;
      this.setDirection(90);
    } else if (magnitude == 0) {
      this.magnitude = 0;
      this.setDirection(0);
    } else {
      this.magnitude = -1 * magnitude;
      this.setDirection(-90);
    }
  }
}

export default SimpleForce;
