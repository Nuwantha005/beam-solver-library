abstract class BaseForce {
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
  getMomentAround(x: number, y: number): number {
    // Moment = maginitude * perp distance from line of action of force to the point
    // Total moment = moment of x component + moment of y component
    const mX = this.getXComponent() * (this.y - y);
    const mY = this.getYComponent() * (this.x - x);
    return mX + mY;
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
