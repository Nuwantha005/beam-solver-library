export class Beam {
  length: number;
  forces: { position: number; magnitude: number }[];

  constructor(length: number) {
    this.length = length;
    this.forces = [];
  }

  addForce(position: number, magnitude: number) {
    if (position < 0 || position > this.length) {
      throw new Error("Force position is out of bounds.");
    }
    this.forces.push({ position, magnitude });
  }

  calculateBendingMoment() {
    // Add bending moment calculations here
    return this.forces.map((f) => f.magnitude * f.position);
  }
}
