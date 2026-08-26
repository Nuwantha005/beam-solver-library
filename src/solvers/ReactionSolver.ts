import { Beam } from "../objects/beam";
import { BaseSupport, supportType } from "../objects/supports/BaseSupport";
import { PinnedSupport } from "../objects/supports/PinnedSupport";
import { RollerSupport } from "../objects/supports/RollerSupport";
import { FixedSupport } from "../objects/supports/FixedSupport";
import Force2D from "../objects/Forces/Force2D";
import SimpleForce from "../objects/Forces/SimpleForce";
import Moment from "../objects/Forces/Moment";
import DistributedLoad from "../objects/Forces/Loads/DistributedLoad";
import MomentLoad from "../objects/Forces/Loads/MomentLoad";
import {
  UnstableBeamError,
  IndeterminateBeamError,
} from "../errors/BeamErrors";

export enum ReactionDOFType {
  FX = "FX",
  FY = "FY",
  MOMENT = "MOMENT",
}

export interface ReactionDOF {
  support: BaseSupport;
  type: ReactionDOFType;
  x: number;
  y: number;
}

export class ReactionSolver {
  /**
   * Solves for reaction forces and moments on the given beam using
   * the 2D general static equilibrium equations:
   *   Σ Fx = 0
   *   Σ Fy = 0
   *   Σ M_z(0,0) = 0
   *
   * @param beam The Beam model containing supports and applied loads.
   * @returns true if reactions were solved and populated successfully.
   */
  static solve(beam: Beam): boolean {
    const supports = beam.getSupports();
    const dofs: ReactionDOF[] = [];

    // Extract degrees of freedom from each support
    supports.forEach((support) => {
      if (support.SupportType === supportType.ROLLER) {
        dofs.push({
          support,
          type: ReactionDOFType.FY,
          x: support.Location,
          y: 0,
        });
      } else if (support.SupportType === supportType.PINNED) {
        dofs.push({
          support,
          type: ReactionDOFType.FX,
          x: support.Location,
          y: 0,
        });
        dofs.push({
          support,
          type: ReactionDOFType.FY,
          x: support.Location,
          y: 0,
        });
      } else if (support.SupportType === supportType.FIXED) {
        dofs.push({
          support,
          type: ReactionDOFType.FX,
          x: support.Location,
          y: 0,
        });
        dofs.push({
          support,
          type: ReactionDOFType.FY,
          x: support.Location,
          y: 0,
        });
        dofs.push({
          support,
          type: ReactionDOFType.MOMENT,
          x: support.Location,
          y: 0,
        });
      }
    });

    // Check determinacy
    if (dofs.length < 3) {
      throw new UnstableBeamError(
        `Beam is kinematically unstable: only ${dofs.length} reaction degree(s) of freedom provided (minimum 3 required for 2D statics).`
      );
    }
    if (dofs.length > 3) {
      throw new IndeterminateBeamError(
        `Beam is statically indeterminate: ${dofs.length} reaction degrees of freedom present (static equilibrium can only solve 3).`
      );
    }

    // Assemble 3x3 matrix A
    // Row 0: Σ Fx = 0
    // Row 1: Σ Fy = 0
    // Row 2: Σ Mo = 0 (Moment about origin (0, 0))
    const A: number[][] = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    for (let j = 0; j < 3; j++) {
      const dof = dofs[j];
      if (dof.type === ReactionDOFType.FX) {
        A[0][j] = 1;
        A[1][j] = 0;
        A[2][j] = -dof.y; // 0 on beam axis
      } else if (dof.type === ReactionDOFType.FY) {
        A[0][j] = 0;
        A[1][j] = 1;
        A[2][j] = dof.x;
      } else if (dof.type === ReactionDOFType.MOMENT) {
        A[0][j] = 0;
        A[1][j] = 0;
        A[2][j] = 1;
      }
    }

    // Assemble load vector b
    // b = - [Σ Fx_applied, Σ Fy_applied, Σ Mz_applied]
    let sumFx = 0;
    let sumFy = 0;
    let sumMo = 0;

    const loads = beam.getLoads();
    loads.forEach((load) => {
      const fx = load.getTotalHorizontalForce();
      const fy = load.getTotalVerticalForce();
      sumFx += fx;
      sumFy += fy;

      if (load instanceof MomentLoad) {
        sumMo += load.getSignedMagnitude();
      } else if (load instanceof DistributedLoad) {
        const xc = load.getEquivalentPointLoad().getX();
        sumMo += xc * fy;
      } else {
        const xf = load.startLocation;
        sumMo += xf * fy;
      }
    });

    const b = [-sumFx, -sumFy, -sumMo];

    // Compute determinant of A
    const detA =
      A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
      A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
      A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

    if (Math.abs(detA) < 1e-9) {
      throw new UnstableBeamError(
        "Support configuration is unstable (singular equilibrium matrix; e.g. parallel rollers or concurrent constraints)."
      );
    }

    // Solve [A]{R} = {b} using Cramer's Rule
    const R: number[] = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const Ai = [
        [...A[0]],
        [...A[1]],
        [...A[2]],
      ];
      Ai[0][i] = b[0];
      Ai[1][i] = b[1];
      Ai[2][i] = b[2];

      const detAi =
        Ai[0][0] * (Ai[1][1] * Ai[2][2] - Ai[1][2] * Ai[2][1]) -
        Ai[0][1] * (Ai[1][0] * Ai[2][2] - Ai[1][2] * Ai[2][0]) +
        Ai[0][2] * (Ai[1][0] * Ai[2][1] - Ai[1][1] * Ai[2][0]);

      R[i] = detAi / detA;
    }

    // Group solved reaction values by support instance
    const supportResults = new Map<
      BaseSupport,
      { rx: number; ry: number; m: number }
    >();

    supports.forEach((s) => {
      supportResults.set(s, { rx: 0, ry: 0, m: 0 });
    });

    for (let j = 0; j < 3; j++) {
      const dof = dofs[j];
      const res = supportResults.get(dof.support)!;
      if (dof.type === ReactionDOFType.FX) {
        res.rx = R[j];
      } else if (dof.type === ReactionDOFType.FY) {
        res.ry = R[j];
      } else if (dof.type === ReactionDOFType.MOMENT) {
        res.m = R[j];
      }
    }

    // Populate reactions directly into support instances
    supports.forEach((support) => {
      const res = supportResults.get(support)!;
      if (support instanceof RollerSupport) {
        const direction = res.ry >= 0 ? "up" : "down";
        support.Reaction = new SimpleForce(Math.abs(res.ry), direction, support.Location);
      } else if (support instanceof PinnedSupport) {
        const mag = Math.sqrt(res.rx * res.rx + res.ry * res.ry);
        const angle = Math.atan2(res.ry, res.rx);
        support.Reaction = new Force2D(mag, angle, support.Location);
      } else if (support instanceof FixedSupport) {
        const mag = Math.sqrt(res.rx * res.rx + res.ry * res.ry);
        const angle = Math.atan2(res.ry, res.rx);
        support.Reaction = new Force2D(mag, angle, support.Location);
        const mDir = res.m >= 0 ? "ccw" : "cw";
        support.Moment = new Moment(Math.abs(res.m), mDir, support.Location, 0);
      }
    });

    return true;
  }
}

export default ReactionSolver;
