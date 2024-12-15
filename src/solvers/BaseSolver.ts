import { Beam, BeamType } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseFroce";
import Moment from "../objects/Forces/Moment";
import { ISolver } from "./ISolver";
import DoubleReaction from "../objects/Forces/reactions/DoubleReaction";
import { matrix, lusolve } from "mathjs";

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

  static solveLinearSystem(A: number[][], b: number[]): number[] {
    // Convert input to math.js matrix format
    const coeffMatrix = matrix(A);
    const solVector = matrix(b);

    // Solve the system
    const solution = lusolve(coeffMatrix, solVector);

    // Convert solution to array and return
    return (solution.toArray() as number[][]).flat(); // Flatten nested array
  }

  // Fails for beams with more than 2 supports -> Because they are statically indetermine ???
  //
  solveReactions(): boolean {
    const supports = this.beam_.getSupports();
    const forces = this.beam_.getForces();
    if (this.beam_.getBeamType() == BeamType.SIMPLY_SUPPORTED) {
      const forceSum = forces.reduce(
        (sum, force) => sum + force.getMagnitude(),
        0
      );

      const length = this.beam_.Length;
      let eqR1 = new Array(supports.length).fill(1);
      let equations = [eqR1];
      for (let j = 0; j < supports.length - 1; j++) {
        let eqR = [];
        for (let i = 0; i < supports.length; i++) {
          eqR.push(supports[i].Location - supports[j].Location);
        }
        equations.push(eqR);
      }
      const lhs = [forceSum];
      for (let j = 0; j < supports.length - 1; j++) {
        const magSum = forces.reduce(
          (sum, force) => sum + force.getMomentAround(supports[j].Location),
          0
        );
        lhs.push(magSum);
      }

      const reactionResults = BaseSolver.solveLinearSystem(equations, lhs);
      console.log("equations", equations);
      console.log("lhs", lhs);
      console.log("results", reactionResults);
      for (let j = 0; j < supports.length; j++) {
        const reaction = supports[j].Reaction as DoubleReaction;
        reaction.setMagnitude(reactionResults[j]);
      }
      return true;
    }
    return true;
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
