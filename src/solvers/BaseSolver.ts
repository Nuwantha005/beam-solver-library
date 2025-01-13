import { Beam, BeamType } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseFroce";
import Moment from "../objects/Forces/Moment";
import { ISolver } from "./ISolver";

export abstract class BaseSolver implements ISolver {
  protected beam_: Beam;
  protected shearCurve_: number[];
  protected momentCurve_: number[];
  protected stepSize_: number = 0.01;

  constructor(beam: Beam, stepSize: number = beam.Length / 100) {
    this.beam_ = beam;
    this.shearCurve_ = [];
    this.momentCurve_ = [];
    this.stepSize = stepSize;
  }

  abstract solve(): boolean;
  abstract getShearAt(x: number): BaseForce;
  abstract getMomentAt(x: number): Moment;
  abstract getMaxShear(): BaseForce;
  abstract getMaxMoment(): Moment;
  abstract getDeflectionAt(x: number): number; // New method

  findReactions(): boolean {
    return true;
  }

  // Fails for beams with more than 2 supports -> Because they are statically indetermine ???
  //
  solveReactions(): boolean {
    const supports = this.beam_.getSupports();
    const forces = this.beam_.getForces();
    if (this.beam_.BeamType == BeamType.SIMPLY_SUPPORTED) {
      const forceSum = forces.reduce(
        (sum, force) => sum + force.getMagnitude(),
        0
      );
      const magSum = forces.reduce(
        (sum, force) => sum + force.getMomentAround(supports[0].Location),
        0
      );
      let r2: number = magSum / this.beam_.Length;
      let r1: number = forceSum - r2;

      supports[0].Reaction.setMagnitude(r1);
      supports[1].Reaction.setMagnitude(r2);
      return true;
    } else {
      console.log(
        "Solving reactions for statically indeterminate beams is not supported yet."
      );
      return false;
    }
  }

  get beam(): Beam {
    return this.beam_;
  }

  set beam(value: Beam) {
    this.beam_ = value;
  }

  get shearCurve(): number[] {
    if (this.shearCurve_.length === 0) {
      this.solve();
    }
    return this.shearCurve_;
  }

  get momentCurve(): number[] {
    if (this.momentCurve_.length === 0) {
      this.solve();
    }
    return this.momentCurve_;
  }

  set stepSize(stepSize: number) {
    this.stepSize_ = stepSize;
  }
  get stepSize(): number {
    return this.stepSize_;
  }

  // Common methods for all solvers can be added here
}
