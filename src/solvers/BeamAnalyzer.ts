import { Beam } from "../objects/beam";
import {
  AnalysisResult,
  AnalysisOptions,
  ReactionResult,
  DiagramResult,
  DiagramPoint,
  DiagramSegment,
} from "../results/AnalysisResult";
import ReactionSolver from "./ReactionSolver";
import ShearMomentSolver from "./ShearMomentSolver";
import BeamEventEngine from "./BeamEventEngine";
import UniformlyDistributedLoad from "../objects/Forces/Loads/UniformlyDistributedLoad";
import TaperzoidLoad from "../objects/Forces/Loads/TaperzoidLoad";

export class BeamAnalyzer {
  /**
   * Executes a complete structural analysis on the provided Beam model,
   * producing strongly typed reaction results, shear force diagrams,
   * and bending moment diagrams.
   *
   * @param beam The Beam model to analyze.
   * @param options Configuration options for sampling resolution and precision.
   * @returns Complete AnalysisResult bundle.
   */
  static analyze(beam: Beam, options?: AnalysisOptions): AnalysisResult {
    const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

    // 1. Solve Support Reactions
    ReactionSolver.solve(beam);

    // 2. Extract Reaction Results
    const reactions: ReactionResult[] = beam.getSupports().map((support, index) => {
      const rx = support.Reaction.getXComponent();
      const ry = support.Reaction.getYComponent();
      const mag = Math.sqrt(rx * rx + ry * ry);
      const angle = Math.atan2(ry, rx);
      const mDir = support.Moment.direction === "ccw" ? 1 : -1;
      const mVal = support.Moment.magnitude > 0 ? mDir * support.Moment.magnitude : 0;

      return {
        supportIndex: index,
        location: support.Location,
        supportType: support.SupportType,
        fx: Math.abs(rx) < 1e-10 ? 0 : rx,
        fy: Math.abs(ry) < 1e-10 ? 0 : ry,
        moment: Math.abs(mVal) < 1e-10 ? 0 : mVal,
        magnitude: Math.abs(mag) < 1e-10 ? 0 : mag,
        angle,
      };
    });

    // 3. Initialize Analytical SFD/BMD Engine
    const smSolver = new ShearMomentSolver(beam);
    const events = BeamEventEngine.extractEvents(beam);
    const intervals = BeamEventEngine.createIntervals(events);
    const samplesPerSegment = options?.samplesPerSegment ?? 20;

    // Helper: Determine polynomial degrees on an interval [x1, x2]
    const getIntervalDegrees = (x1: number, x2: number) => {
      const mid = (x1 + x2) / 2;
      let hasTrapezoid = false;
      let hasUDL = false;

      beam.getLoads().forEach((l) => {
        if (mid >= l.startLocation && mid <= l.endLocation) {
          if (l instanceof TaperzoidLoad) {
            hasTrapezoid = true;
          } else if (l instanceof UniformlyDistributedLoad) {
            hasUDL = true;
          }
        }
      });

      if (hasTrapezoid) {
        return { shearDegree: 2, momentDegree: 3 };
      }
      if (hasUDL) {
        return { shearDegree: 1, momentDegree: 2 };
      }
      return { shearDegree: 0, momentDegree: 1 };
    };

    // 4. Construct Shear Diagram
    const shearSegments: DiagramSegment[] = [];
    const shearPoints: DiagramPoint[] = [];

    intervals.forEach((interval) => {
      const { shearDegree } = getIntervalDegrees(interval.start, interval.end);
      const segmentSamples: DiagramPoint[] = [];

      for (let i = 0; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        const x = interval.start + t * interval.length;
        const v = smSolver.getShearAt(x);

        const point: DiagramPoint = {
          x,
          value: v,
        };

        if (i === 0) {
          const vLeft = smSolver.getShearAt(x, "left");
          const vRight = smSolver.getShearAt(x, "right");
          if (Math.abs(vLeft - vRight) > 1e-4) {
            point.isDiscontinuity = true;
            point.leftLimit = vLeft;
            point.rightLimit = vRight;
          }
        }

        segmentSamples.push(point);
        shearPoints.push(point);
      }

      shearSegments.push({
        startX: interval.start,
        endX: interval.end,
        length: interval.length,
        polynomialDegree: shearDegree,
        samples: segmentSamples,
      });
    });

    const shearMax = smSolver.getMaxShear();
    const shearMin = smSolver.getMinShear();
    const zeroCrossings = smSolver.getZeroCrossings();

    const shearDiagram: DiagramResult = {
      diagramType: "SHEAR",
      points: shearPoints,
      segments: shearSegments,
      max: shearMax,
      min: shearMin,
      zeroCrossings,
    };

    // 5. Construct Bending Moment Diagram
    const momentSegments: DiagramSegment[] = [];
    const momentPoints: DiagramPoint[] = [];

    intervals.forEach((interval) => {
      const { momentDegree } = getIntervalDegrees(interval.start, interval.end);
      const segmentSamples: DiagramPoint[] = [];

      for (let i = 0; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        const x = interval.start + t * interval.length;
        const m = smSolver.getMomentAt(x);

        const point: DiagramPoint = {
          x,
          value: m,
        };

        if (i === 0) {
          const mLeft = smSolver.getMomentAt(x, "left");
          const mRight = smSolver.getMomentAt(x, "right");
          if (Math.abs(mLeft - mRight) > 1e-4) {
            point.isDiscontinuity = true;
            point.leftLimit = mLeft;
            point.rightLimit = mRight;
          }
        }

        // Tag extremum if close to a zero-crossing
        if (zeroCrossings.some((zc) => Math.abs(zc - x) < interval.length / samplesPerSegment / 2)) {
          point.isExtremum = true;
        }

        segmentSamples.push(point);
        momentPoints.push(point);
      }

      momentSegments.push({
        startX: interval.start,
        endX: interval.end,
        length: interval.length,
        polynomialDegree: momentDegree,
        samples: segmentSamples,
      });
    });

    const momentMax = smSolver.getMaxMoment();
    const momentMin = smSolver.getMinMoment();

    const momentDiagram: DiagramResult = {
      diagramType: "MOMENT",
      points: momentPoints,
      segments: momentSegments,
      max: momentMax,
      min: momentMin,
      zeroCrossings,
    };

    const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();

    return {
      beamLength: beam.Length,
      eModulus: beam.EModulus,
      reactions,
      shearDiagram,
      momentDiagram,
      isStaticallyDeterminate: true,
      solveTimeMs: Math.max(0, endTime - startTime),
    };
  }
}

export default BeamAnalyzer;
