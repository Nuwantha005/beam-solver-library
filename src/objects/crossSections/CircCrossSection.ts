import { BaseSection, CrossSectionType } from "./CrossSection";

export class CircularCrossSection extends BaseSection {
  radius: number;

  constructor(radius: number) {
    super(CrossSectionType.Circular);
    if (radius <= 0) {
      throw new Error("Radius must be a positive number.");
    }
    this.radius = radius;
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
  getInertia(): number {
    return (Math.PI * Math.pow(this.radius, 4)) / 4;
  }
  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

export default CircularCrossSection;
