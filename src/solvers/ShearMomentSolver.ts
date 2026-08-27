import { Beam } from "../objects/beam";
import ReactionSolver from "./ReactionSolver";
import BeamEventEngine from "./BeamEventEngine";
import UniformlyDistributedLoad from "../objects/Forces/Loads/UniformlyDistributedLoad";
import TaperzoidLoad from "../objects/Forces/Loads/TaperzoidLoad";
import FunctionLoad from "../objects/Forces/Loads/FunctionLoad";
import MomentLoad from "../objects/Forces/Loads/MomentLoad";
import { LoadType } from "../objects/Forces/Loads/ILoad";

export interface ExtremumResult {
  x: number;
  value: number;
}

export class ShearMomentSolver {
  private beam: Beam;
  private tolerance: number = 1e-7;

  constructor(beam: Beam) {
    this.beam = beam;
    // Ensure reactions are solved
    ReactionSolver.solve(this.beam);
  }

  /**
   * Evaluates the internal shear force V(x) at coordinate x.
   *
   * @param x Coordinate along the beam span [0, L]
   * @param side 'left' for V(x^-), 'right' for V(x^+), 'exact' for point evaluation (defaults to 'exact')
   */
  getShearAt(x: number, side: "left" | "right" | "exact" = "exact"): number {
    const clampedX = Math.max(0, Math.min(this.beam.Length, x));
    let shear = 0;

    // Upward support reactions to the left of x
    this.beam.getSupports().forEach((support) => {
      const sx = support.Location;
      const isIncluded =
        side === "left"
          ? sx < clampedX - this.tolerance
          : sx <= clampedX + this.tolerance;

      if (isIncluded) {
        shear += support.Reaction.getYComponent();
      }
    });

    // Applied loads to the left of x
    this.beam.getLoads().forEach((load) => {
      if (load.loadType === LoadType.POINT) {
        const lx = load.startLocation;
        const isIncluded =
          side === "left"
            ? lx < clampedX - this.tolerance
            : lx <= clampedX + this.tolerance;

        if (isIncluded) {
          shear += load.getTotalVerticalForce();
        }
      } else if (load instanceof UniformlyDistributedLoad) {
        if (clampedX > load.startLocation) {
          const effectiveEnd = Math.min(clampedX, load.endLocation);
          const activeLength = effectiveEnd - load.startLocation;
          if (activeLength > 0) {
            shear += -load.loadVal * activeLength;
          }
        }
      } else if (load instanceof TaperzoidLoad) {
        if (clampedX > load.startLocation) {
          const effectiveEnd = Math.min(clampedX, load.endLocation);
          const activeLength = effectiveEnd - load.startLocation;
          const totalSpan = load.endLocation - load.startLocation;
          if (activeLength > 0 && totalSpan > 0) {
            const wEnd =
              load.startLoad + (activeLength / totalSpan) * (load.endLoad - load.startLoad);
            const activeLoadMag = 0.5 * (load.startLoad + wEnd) * activeLength;
            shear += -activeLoadMag;
          }
        }
      } else if (load instanceof FunctionLoad) {
        shear += load.getShearContribution(clampedX);
      }
    });

    return Math.abs(shear) < 1e-10 ? 0 : shear;
  }

  /**
   * Evaluates the internal bending moment M(x) at coordinate x (sagging is positive).
   *
   * @param x Coordinate along the beam span [0, L]
   * @param side 'left' for M(x^-), 'right' for M(x^+), 'exact' for point evaluation (defaults to 'exact')
   */
  getMomentAt(x: number, side: "left" | "right" | "exact" = "exact"): number {
    const clampedX = Math.max(0, Math.min(this.beam.Length, x));
    let moment = 0;

    // Upward support reactions to the left of x: +Ry * (x - sx)
    this.beam.getSupports().forEach((support) => {
      const sx = support.Location;
      if (sx <= clampedX) {
        const arm = clampedX - sx;
        moment += support.Reaction.getYComponent() * arm;

        // Support reaction moment (fixed wall): CCW reaction moment reduces sagging (-M_R)
        if (support.Moment.magnitude > 0) {
          const mSign = support.Moment.direction === "ccw" ? -1 : 1;
          moment += mSign * support.Moment.magnitude;
        }
      }
    });

    // Applied loads to the left of x
    this.beam.getLoads().forEach((load) => {
      if (load.loadType === LoadType.POINT) {
        const lx = load.startLocation;
        if (lx <= clampedX) {
          const arm = clampedX - lx;
          moment += load.getTotalVerticalForce() * arm;
        }
      } else if (load instanceof UniformlyDistributedLoad) {
        if (clampedX > load.startLocation) {
          const effectiveEnd = Math.min(clampedX, load.endLocation);
          const activeLength = effectiveEnd - load.startLocation;
          if (activeLength > 0) {
            const activeCentroid = load.startLocation + activeLength / 2;
            const arm = clampedX - activeCentroid;
            moment += -load.loadVal * activeLength * arm;
          }
        }
      } else if (load instanceof TaperzoidLoad) {
        if (clampedX > load.startLocation) {
          const effectiveEnd = Math.min(clampedX, load.endLocation);
          const activeLength = effectiveEnd - load.startLocation;
          const totalSpan = load.endLocation - load.startLocation;
          if (activeLength > 0 && totalSpan > 0) {
            const wEnd =
              load.startLoad + (activeLength / totalSpan) * (load.endLoad - load.startLoad);
            // Rectangular part
            const rectMag = load.startLoad * activeLength;
            const rectArm = clampedX - (load.startLocation + activeLength / 2);
            // Triangular part
            const triMag = 0.5 * (wEnd - load.startLoad) * activeLength;
            const triArm = clampedX - (load.startLocation + (activeLength * 2) / 3);
            moment += -(rectMag * rectArm + triMag * triArm);
          }
        }
      } else if (load instanceof FunctionLoad) {
        moment += load.getMomentContribution(clampedX);
      } else if (load instanceof MomentLoad) {
        const mx = load.startLocation;
        const isIncluded =
          side === "left"
            ? mx < clampedX - this.tolerance
            : mx <= clampedX + this.tolerance;

        if (isIncluded) {
          // CCW applied moment causes a downward step in sagging BMD (-M_ext)
          const sign = load.direction === "ccw" ? -1 : 1;
          moment += sign * load.magnitude;
        }
      }
    });

    return Math.abs(moment) < 1e-10 ? 0 : moment;
  }

  /**
   * Identifies all coordinates x in [0, L] where internal shear V(x) crosses zero
   * or has a step discontinuity spanning zero.
   * These locations correspond to local extrema of the bending moment diagram (dM/dx = 0).
   */
  getZeroCrossings(): number[] {
    const events = BeamEventEngine.extractEvents(this.beam);
    const crossings: number[] = [];

    // 1. Check endpoints
    if (Math.abs(this.getShearAt(0, "right")) < 1e-7) {
      crossings.push(0);
    }
    const L = this.beam.Length;
    if (Math.abs(this.getShearAt(L, "left")) < 1e-7) {
      crossings.push(L);
    }

    // 2. Check internal events with step discontinuities (e.g. concentrated point loads)
    for (let i = 1; i < events.length - 1; i++) {
      const x = events[i];
      const vLeft = this.getShearAt(x, "left");
      const vRight = this.getShearAt(x, "right");

      if (
        Math.abs(vLeft) < 1e-7 ||
        Math.abs(vRight) < 1e-7 ||
        vLeft * vRight < 0
      ) {
        if (!crossings.some((c) => Math.abs(c - x) < 1e-5)) {
          crossings.push(x);
        }
      }
    }

    // 3. Bisection root finding within open continuous intervals (x_i, x_{i+1})
    for (let i = 0; i < events.length - 1; i++) {
      const x1 = events[i];
      const x2 = events[i + 1];
      const v1 = this.getShearAt(x1, "right");
      const v2 = this.getShearAt(x2, "left");

      if (v1 * v2 < 0) {
        let a = x1;
        let b = x2;
        for (let iter = 0; iter < 40; iter++) {
          const mid = (a + b) / 2;
          const vMid = this.getShearAt(mid);
          if (Math.abs(vMid) < 1e-9 || b - a < 1e-9) {
            a = mid;
            break;
          }
          if (v1 * vMid <= 0) {
            b = mid;
          } else {
            a = mid;
          }
        }
        const root = a;
        if (
          root > x1 + 1e-5 &&
          root < x2 - 1e-5 &&
          !crossings.some((c) => Math.abs(c - root) < 1e-5)
        ) {
          crossings.push(root);
        }
      }
    }

    return crossings.sort((a, b) => a - b);
  }

  /**
   * Returns the global maximum shear force and its position.
   */
  getMaxShear(): ExtremumResult {
    const events = BeamEventEngine.extractEvents(this.beam);
    let maxV = -Infinity;
    let maxX = 0;

    events.forEach((x) => {
      const vLeft = this.getShearAt(x, "left");
      const vRight = this.getShearAt(x, "right");

      if (vLeft > maxV) {
        maxV = vLeft;
        maxX = x;
      }
      if (vRight > maxV) {
        maxV = vRight;
        maxX = x;
      }
    });

    return { x: maxX, value: maxV };
  }

  /**
   * Returns the global minimum shear force and its position.
   */
  getMinShear(): ExtremumResult {
    const events = BeamEventEngine.extractEvents(this.beam);
    let minV = Infinity;
    let minX = 0;

    events.forEach((x) => {
      const vLeft = this.getShearAt(x, "left");
      const vRight = this.getShearAt(x, "right");

      if (vLeft < minV) {
        minV = vLeft;
        minX = x;
      }
      if (vRight < minV) {
        minV = vRight;
        minX = x;
      }
    });

    return { x: minX, value: minV };
  }

  /**
   * Returns the global maximum bending moment and its position.
   */
  getMaxMoment(): ExtremumResult {
    const criticalPoints = [
      ...BeamEventEngine.extractEvents(this.beam),
      ...this.getZeroCrossings(),
    ];

    let maxM = -Infinity;
    let maxX = 0;

    criticalPoints.forEach((x) => {
      const mLeft = this.getMomentAt(x, "left");
      const mRight = this.getMomentAt(x, "right");

      if (mLeft > maxM) {
        maxM = mLeft;
        maxX = x;
      }
      if (mRight > maxM) {
        maxM = mRight;
        maxX = x;
      }
    });

    return { x: maxX, value: maxM };
  }

  /**
   * Returns the global minimum bending moment and its position.
   */
  getMinMoment(): ExtremumResult {
    const criticalPoints = [
      ...BeamEventEngine.extractEvents(this.beam),
      ...this.getZeroCrossings(),
    ];

    let minM = Infinity;
    let minX = 0;

    criticalPoints.forEach((x) => {
      const mLeft = this.getMomentAt(x, "left");
      const mRight = this.getMomentAt(x, "right");

      if (mLeft < minM) {
        minM = mLeft;
        minX = x;
      }
      if (mRight < minM) {
        minM = mRight;
        minX = x;
      }
    });

    return { x: minX, value: minM };
  }

  /**
   * Samples the shear curve into discrete points for plotting/visualization.
   */
  sampleShearCurve(points: number = 100): { x: number; v: number }[] {
    const samples: { x: number; v: number }[] = [];
    const step = this.beam.Length / points;

    for (let i = 0; i <= points; i++) {
      const x = i * step;
      samples.push({ x, v: this.getShearAt(x) });
    }
    return samples;
  }

  /**
   * Samples the bending moment curve into discrete points for plotting/visualization.
   */
  sampleMomentCurve(points: number = 100): { x: number; m: number }[] {
    const samples: { x: number; m: number }[] = [];
    const step = this.beam.Length / points;

    for (let i = 0; i <= points; i++) {
      const x = i * step;
      samples.push({ x, m: this.getMomentAt(x) });
    }
    return samples;
  }
}

export default ShearMomentSolver;
