import { Beam, BeamType } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseForce";
import Moment from "../objects/Forces/Moment";
import { ISolver } from "./ISolver";
import ReactionSolver from "./ReactionSolver";

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

  solveReactions(): boolean {
    return ReactionSolver.solve(this.beam_);
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
