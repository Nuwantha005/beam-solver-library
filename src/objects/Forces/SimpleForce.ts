import BaseForce from "./BaseFroce";

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

  // Overload getMomentAround to only receive x
  getMomentAround(x: number): number {
    return super.getMomentAround(x, 0);
  }
  getXComponent(): number {
    return 0;
  }
  getYComponent(): number {
    return this.magnitude;
  }
}

export default SimpleForce;
