import { Beam, BeamType } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseFroce";
import Moment from "../objects/Forces/Moment";
import SimpleForce from "../objects/Forces/SimpleForce";
import { BaseSolver } from "./BaseSolver";

// Use Moment-Curvature Relationship to solve for the shear and moment at a given point on the beam.

export class MCSolver extends BaseSolver {
  constructor(beam: Beam, stepSize: number = beam.Length / 100) {
    super(beam, stepSize);
  }

  solve(): boolean {
    const L = this.beam_.Length;
    const EI = this.beam_.EModulus * this.beam_.crossSection.getInertia();

    return true;
  }

  getShearAt(x: number): BaseForce {
    // Implement shear calculation at position x
    return new SimpleForce(0, "down", x);
  }

  getMomentAt(x: number): Moment {
    // Implement moment calculation at position x
    return new Moment(0);
  }

  getMaxShear(): BaseForce {
    return new SimpleForce(0, "down", 0);
  }

  getMaxMoment(): Moment {
    // Implement maximum moment calculation
    return new Moment();
  }

  getDeflectionAt(x: number): number {
    // Implement deflection calculation at position x using integration
    // ...implementation code...
    return 0;
  }
}
