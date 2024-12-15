export enum CrossSectionType {
  Rectangle,
  Circular,
  ISection,
  Custom,
  // ...add other types as needed...
}

export abstract class BaseSection {
  protected type: CrossSectionType;

  constructor(type: CrossSectionType) {
    this.type = type;
  }

  get sectionType() {
    return this.type;
  }

  abstract getArea(): number;
  abstract getInertia(): number;
  abstract getPerimeter(): number;
}
