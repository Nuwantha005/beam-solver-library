import { BaseSection } from "./crossSections/CrossSection";
import { CustomSection } from "./crossSections/CustomSection";
import BaseForce from "./Forces/BaseFroce";
import { BaseSupport, supportType } from "./supports/BaseSupport";

export class Beam {
  private _length: number;
  private _eModulus: number = 0; // Initialize with a default value
  private _crossSection: BaseSection = new CustomSection();
  private _forces: BaseForce[] = [];
  private _supports: BaseSupport[] = [];

  constructor(length: number, EModulus?: number, crossSection?: BaseSection) {
    this._length = length;
    if (EModulus !== undefined) {
      this._eModulus = EModulus;
    }
    if (crossSection !== undefined) {
      this._crossSection = crossSection;
    }
  }

  get BeamType(): BeamType {
    // if only has pinned supoorts, its simply supported beam
    let type: BeamType = BeamType.NONE;
    let hasPinnedSupport = false;
    let hasRollerSupport = false;
    let hasFixedSupport = false;
    let hasSupportsAtEnd = false;
    let hasSupportAtStart = false;

    this._supports.forEach((support) => {
      if (support.SupportType === supportType.PINNED) {
        hasPinnedSupport = true;
      } else if (support.SupportType === supportType.ROLLER) {
        hasRollerSupport = true;
      } else if (support.SupportType === supportType.FIXED) {
        hasFixedSupport = true;
      }
      if (support.Location == 0) {
        hasSupportAtStart = true;
      }
      if (support.Location == this._length) {
        hasSupportsAtEnd = true;
      }
    });

    if (this._supports.length > 2) {
      type = BeamType.CONTINUOUS;
    } else {
      if (hasPinnedSupport && !hasRollerSupport && !hasFixedSupport) {
        type = BeamType.SIMPLY_SUPPORTED;
      } else if (hasPinnedSupport && hasRollerSupport && !hasFixedSupport) {
        type = BeamType.ROLLER_SUPPORTED;
      } else if (
        (hasFixedSupport && !hasSupportAtStart) ||
        (hasFixedSupport && !hasSupportsAtEnd)
      ) {
        type = BeamType.CANTELIVER;
      } else if (hasFixedSupport) {
        type = BeamType.FIXED;
      }
    }

    return type;
  }

  addForce(force: BaseForce) {
    this._forces.push(force);
  }

  getForces(): BaseForce[] {
    return this._forces;
  }

  setForces(forces: BaseForce[]) {
    this._forces = forces;
  }

  removeForces() {
    this._forces = [];
  }

  addSupport(support: BaseSupport) {
    this._supports.push(support);
  }

  getSupports(): BaseSupport[] {
    return this._supports;
  }

  setSupports(supports: BaseSupport[]) {
    this._supports = supports;
  }

  removeSupports() {
    this._supports = [];
  }

  get crossSection(): BaseSection {
    return this._crossSection;
  }

  set crossSection(value: BaseSection) {
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

export enum BeamType {
  SIMPLY_SUPPORTED,
  CANTELIVER,
  ROLLER_SUPPORTED,
  FIXED,
  CONTINUOUS,
  NONE,
}
