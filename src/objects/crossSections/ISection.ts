import { CrossSectionType, BaseSection } from "./CrossSection";

export class ISection extends BaseSection {
  width: number;
  height: number;
  flangeThickness: number;
  webThickness: number;

  constructor(
    width: number,
    height: number,
    flangeThickness: number,
    webThickness: number
  ) {
    super(CrossSectionType.ISection);
    if (
      width <= 0 ||
      height <= 0 ||
      flangeThickness <= 0 ||
      webThickness <= 0
    ) {
      throw new Error("Dimensions must be positive numbers.");
    }
    this.width = width;
    this.height = height;
    this.flangeThickness = flangeThickness;
    this.webThickness = webThickness;
  }

  getArea(): number {
    return (
      2 * this.flangeThickness * this.width +
      (this.height - 2 * this.flangeThickness) * this.webThickness
    );
  }

  getInertia(): number {
    const flangeInertia = (this.width * Math.pow(this.flangeThickness, 3)) / 12;
    const webInertia =
      (this.webThickness *
        Math.pow(this.height - 2 * this.flangeThickness, 3)) /
      12;
    return 2 * flangeInertia + webInertia;
  }
  getPerimeter(): number {
    return (
      2 * (this.width + this.height) + 2 * (this.width - this.webThickness)
    );
  }
}

export default ISection;
