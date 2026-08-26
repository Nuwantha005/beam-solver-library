import { Beam } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseForce";
import Moment from "../objects/Forces/Moment";
import SimpleForce from "../objects/Forces/SimpleForce";
import { BaseSolver } from "./BaseSolver";
import ShearMomentSolver from "./ShearMomentSolver";

export class MCSolver extends BaseSolver {
  private _smSolver: ShearMomentSolver;

  constructor(beam: Beam, stepSize: number = beam.Length / 100) {
    super(beam, stepSize);
    this._smSolver = new ShearMomentSolver(beam);
  }

  solve(): boolean {
    this.solveReactions();
    this._smSolver = new ShearMomentSolver(this.beam_);

    const points = Math.max(10, Math.round(this.beam_.Length / this.stepSize_));
    this.shearCurve_ = this._smSolver.sampleShearCurve(points).map((s) => s.v);
    this.momentCurve_ = this._smSolver.sampleMomentCurve(points).map((s) => s.m);

    return true;
  }

  getShearAt(x: number): BaseForce {
    const v = this._smSolver.getShearAt(x);
    const dir = v >= 0 ? "up" : "down";
    return new SimpleForce(Math.abs(v), dir, x);
  }

  getMomentAt(x: number): Moment {
    const m = this._smSolver.getMomentAt(x);
    const dir = m >= 0 ? "ccw" : "cw";
    return new Moment(Math.abs(m), dir, x, 0);
  }

  getMaxShear(): BaseForce {
    const max = this._smSolver.getMaxShear();
    const dir = max.value >= 0 ? "up" : "down";
    return new SimpleForce(Math.abs(max.value), dir, max.x);
  }

  getMaxMoment(): Moment {
    const max = this._smSolver.getMaxMoment();
    const dir = max.value >= 0 ? "ccw" : "cw";
    return new Moment(Math.abs(max.value), dir, max.x, 0);
  }

  getDeflectionAt(x: number): number {
    return 0;
  }
}

export default MCSolver;
