export enum CrossSectionType {
  Rectangle,
  Cicular,
  IBeam,
  Square,
  // ...add other types as needed...
}

export class CrossSections {
  type: CrossSectionType;

  constructor(type: CrossSectionType) {
    this.type = type;
  }

  set crossSection(type: CrossSectionType) {
    this.type = type;
  }
  get crossSection(): CrossSectionType {
    return this.type;
  }

  // ...existing code...
}
