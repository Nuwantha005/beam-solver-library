import { BaseSection } from "./CrossSection";
import { CrossSectionType } from "./CrossSection";

export class CustomSection extends BaseSection {
  private _area: number;
  private _perimeter: number;
  private _inertia: number;

  constructor(area: number = 0, perimeter: number = 0, inertia: number = 0) {
    super(CrossSectionType.Custom);
    this._area = area;
    this._perimeter = perimeter;
    this._inertia = inertia;
  }

  getArea(): number {
    return this._area;
  }

  getInertia(): number {
    return this._inertia;
  }

  getPerimeter(): number {
    return this._perimeter;
  }

  get area(): number {
    return this._area;
  }

  set area(value: number) {
    this._area = value;
  }

  get perimeter(): number {
    return this._perimeter;
  }

  set perimeter(value: number) {
    this._perimeter = value;
  }

  get inertia(): number {
    return this._inertia;
  }

  set inertia(value: number) {
    this._inertia = value;
  }
}
