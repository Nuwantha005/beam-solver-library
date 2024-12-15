class Moment {
  private _magnitude: number;
  private _direction: "cw" | "ccw";
  private _x: number;
  private _y: number;

  constructor(
    magnitude: number = 0,
    direction: "cw" | "ccw" = "ccw",
    x: number = 0,
    y: number = 0
  ) {
    this._magnitude = magnitude;
    this._direction = direction;
    this._x = x;
    this._y = y;
  }

  // Getter for magnitude
  get magnitude(): number {
    return this._magnitude;
  }

  // Setter for magnitude
  set magnitude(value: number) {
    this._magnitude = value;
  }

  // Getter for direction
  get direction(): "cw" | "ccw" {
    return this._direction;
  }

  // Setter for direction
  set direction(value: "cw" | "ccw") {
    this._direction = value;
  }

  // Getter for x
  get x(): number {
    return this._x;
  }

  // Setter for x
  set x(value: number) {
    this._x = value;
  }

  // Getter for y
  get y(): number {
    return this._y;
  }

  // Setter for y
  set y(value: number) {
    this._y = value;
  }
}

export default Moment;
