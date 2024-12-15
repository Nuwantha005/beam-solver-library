class Moment {
  private _magnitude: number;
  private _direction: "cw" | "ccw";
  private _location: number;

  constructor(magnitude: number, direction: "cw" | "ccw", location: number) {
    this._magnitude = magnitude;
    this._direction = direction;
    this._location = location;
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

  // Getter for location
  get location(): number {
    return this._location;
  }

  // Setter for location
  set location(value: number) {
    this._location = value;
  }
}

export default Moment;
