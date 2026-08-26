import { BaseSection } from "./crossSections/CrossSection";
import { CustomSection } from "./crossSections/CustomSection";
import BaseForce from "./Forces/BaseForce";
import { BaseSupport, supportType } from "./supports/BaseSupport";
import { ILoad, LoadType } from "./Forces/Loads/ILoad";
import DistributedLoad from "./Forces/Loads/DistributedLoad";
import MomentLoad from "./Forces/Loads/MomentLoad";
import { InvalidGeometryError } from "../errors/BeamErrors";
import { AnalysisResult, AnalysisOptions } from "../results/AnalysisResult";
import BeamAnalyzer from "../solvers/BeamAnalyzer";

export class Beam {
  private _length: number;
  private _eModulus: number = 0;
  private _crossSection: BaseSection = new CustomSection();
  private _loads: ILoad[] = [];
  private _supports: BaseSupport[] = [];

  constructor(length: number, EModulus?: number, crossSection?: BaseSection) {
    if (length <= 0) {
      throw new InvalidGeometryError("Length must be positive.");
    }
    this._length = length;
    if (EModulus !== undefined) {
      if (EModulus <= 0) {
        throw new InvalidGeometryError("EModulus must be positive.");
      }
      this._eModulus = EModulus;
    }
    if (crossSection !== undefined) {
      this._crossSection = crossSection;
    }
  }

  get BeamType(): BeamType {
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
      if (support.Location === 0) {
        hasSupportAtStart = true;
      }
      if (support.Location === this._length) {
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

  // --- Load Management ---

  /**
   * Adds any valid load (PointLoad, Force2D, UDL, Trapezoidal, or MomentLoad) to the beam.
   */
  addLoad(load: ILoad): void {
    if (
      load.startLocation < 0 ||
      load.endLocation > this._length ||
      load.startLocation > load.endLocation
    ) {
      throw new InvalidGeometryError(
        `Load coordinates [${load.startLocation}, ${load.endLocation}] are outside beam span [0, ${this._length}].`
      );
    }
    this._loads.push(load);
  }

  /**
   * Returns all loads applied to the beam.
   */
  getLoads(): ILoad[] {
    return this._loads;
  }

  /**
   * Sets the applied loads, replacing existing ones after boundary validation.
   */
  setLoads(loads: ILoad[]): void {
    this.removeLoads();
    loads.forEach((load) => this.addLoad(load));
  }

  /**
   * Removes all loads from the beam.
   */
  removeLoads(): void {
    this._loads = [];
  }

  /**
   * Returns all concentrated point loads / forces.
   */
  getPointLoads(): BaseForce[] {
    return this._loads.filter(
      (l): l is BaseForce & ILoad => l.loadType === LoadType.POINT
    ) as BaseForce[];
  }

  /**
   * Returns all distributed loads (UDL, Trapezoidal).
   */
  getDistributedLoads(): DistributedLoad[] {
    return this._loads.filter(
      (l): l is DistributedLoad => l.loadType === LoadType.DISTRIBUTED
    );
  }

  /**
   * Returns all applied concentrated moments.
   */
  getAppliedMoments(): MomentLoad[] {
    return this._loads.filter(
      (l): l is MomentLoad => l.loadType === LoadType.MOMENT
    );
  }

  // --- Backwards Compatibility for Forces ---

  addForce(force: BaseForce): void {
    this.addLoad(force);
  }

  getForces(): BaseForce[] {
    return this.getPointLoads();
  }

  setForces(forces: BaseForce[]): void {
    // Retain non-point loads if any, replace point loads
    const nonPointLoads = this._loads.filter(
      (l) => l.loadType !== LoadType.POINT
    );
    this._loads = [...nonPointLoads];
    forces.forEach((f) => this.addLoad(f));
  }

  removeForces(): void {
    this._loads = this._loads.filter((l) => l.loadType !== LoadType.POINT);
  }

  // --- Support Management ---

  addSupport(support: BaseSupport): void {
    if (support.Location < 0 || support.Location > this._length) {
      throw new InvalidGeometryError(
        `Support location ${support.Location} is outside beam span [0, ${this._length}].`
      );
    }
    this._supports.push(support);
  }

  getSupports(): BaseSupport[] {
    return this._supports;
  }

  setSupports(supports: BaseSupport[]): void {
    this.removeSupports();
    supports.forEach((s) => this.addSupport(s));
  }

  removeSupports(): void {
    this._supports = [];
  }

  // --- Section & Material Properties ---

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
      throw new InvalidGeometryError("Length must be positive.");
    }
    this._length = value;
  }

  get EModulus(): number {
    return this._eModulus;
  }

  set EModulus(value: number) {
    if (value <= 0) {
      throw new InvalidGeometryError("EModulus must be positive.");
    }
    this._eModulus = value;
  }

  // --- End-to-End Analysis ---

  analyze(options?: AnalysisOptions): AnalysisResult {
    return BeamAnalyzer.analyze(this, options);
  }
}

export enum BeamType {
  SIMPLY_SUPPORTED,
  CANTELIVER,
  ROLLER_SUPPORTED,
  FIXED,
  CONTINUOUS,
  NONE,
}
