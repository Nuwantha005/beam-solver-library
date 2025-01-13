import SimpleForce from "../SimpleForce";

class PointLoad extends SimpleForce {
  constructor(magnitude: number, x: number) {
    if (magnitude > 0) {
      super(magnitude, "down", x);
    } else {
      super(magnitude, "up", x);
    }
  }

  getMagnitude(): number {
    if (this.magnitude > 0) {
      return this.magnitude;
    } else {
      return -1 * this.magnitude;
    }
  }

  setMagnitude(value: number) {
    this.magnitude = value;
    this.angle = value > 0 ? -90 : 90;
  }
  // Additional methods specific to PointLoad can be added here
}

export default PointLoad;
