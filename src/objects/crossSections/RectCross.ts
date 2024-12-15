import { CrossSection, CrossSectionType } from "./CrossSection";

export class RectangleCrossSection extends CrossSection {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    super(CrossSectionType.Rectangle);
    if (width <= 0 || height <= 0) {
      throw new Error("Width and height must be positive numbers.");
    }
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
  getInertia(): number {
    return (this.width * Math.pow(this.height, 3)) / 12;
  }
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}
