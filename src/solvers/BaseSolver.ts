import { Beam } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseFroce";
import Moment from "../objects/Forces/Moment";
import { ISolver } from "./ISolver";

export abstract class BaseSolver implements ISolver {
  protected beam: Beam;

  constructor(beam: Beam) {
    this.beam = beam;
  }

  //abstract solve(): void;
  abstract getShearAt(x: number): BaseForce;
  abstract getMomentAt(x: number): Moment;
  abstract getShearCurve(): number[];
  abstract getMomentCurve(): number[];

  getBeam(): Beam {
    return this.beam;
  }

  setBeam(beam: Beam): void {
    this.beam = beam;
  }

  // Common methods for all solvers can be added here
}
