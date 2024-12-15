export enum CrossSectionType {
  Rectangle,
  Circular,
  ISection,
  Square,
  // ...add other types as needed...
}

export abstract class CrossSections {
  type: CrossSectionType;

  constructor(type: CrossSectionType) {
    this.type = type;
  }

  abstract getArea(): number;
  abstract getInertia(): number;
  abstract getPerimeter(): number;
}
