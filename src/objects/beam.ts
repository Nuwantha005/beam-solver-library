import { CrossSection } from "./crossSections/CrossSection";
import { CustomSection } from "./crossSections/CustomSection";

export class Beam {
  private _length: number;
  private _eModulus: number = 0; // Initialize with a default value
  private _crossSection: CrossSection = new CustomSection();

  constructor(length: number, EModulus?: number, crossSection?: CrossSection) {
    this._length = length;
    if (EModulus !== undefined) {
      this._eModulus = EModulus;
    }
    if (crossSection !== undefined) {
      this._crossSection = crossSection;
    }
  }
  get crossSection(): CrossSection {
    return this._crossSection;
  }

  set crossSection(value: CrossSection) {
    this._crossSection = value;
  }

  get Length(): number {
    return this._length;
  }

  set Length(value: number) {
    if (value <= 0) {
      throw new Error("Length must be positive.");
    }
    this._length = value;
  }

  get EModulus(): number {
    return this._eModulus;
  }

  set EModulus(value: number) {
    if (value <= 0) {
      throw new Error("EModulus must be positive.");
    }
    this._eModulus = value;
  }

  // ...existing code (other methods without 'forces')...
}
