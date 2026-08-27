"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeamAnalyzer = void 0;
const ReactionSolver_1 = __importDefault(require("./ReactionSolver"));
const ShearMomentSolver_1 = __importDefault(require("./ShearMomentSolver"));
const DeflectionSolver_1 = __importDefault(require("./DeflectionSolver"));
const BeamEventEngine_1 = __importDefault(require("./BeamEventEngine"));
const UniformlyDistributedLoad_1 = __importDefault(require("../objects/Forces/Loads/UniformlyDistributedLoad"));
const TaperzoidLoad_1 = __importDefault(require("../objects/Forces/Loads/TaperzoidLoad"));
const FunctionLoad_1 = __importDefault(require("../objects/Forces/Loads/FunctionLoad"));
class BeamAnalyzer {
    /**
     * Executes a complete structural analysis on the provided Beam model,
     * producing strongly typed reaction results, shear force diagrams,
     * bending moment diagrams, and elastic deflection curves.
     *
     * @param beam The Beam model to analyze.
     * @param options Configuration options for sampling resolution and precision.
     * @returns Complete AnalysisResult bundle.
     */
    static analyze(beam, options) {
        var _a;
        const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
        // 1. Solve Support Reactions
        ReactionSolver_1.default.solve(beam);
        // 2. Extract Reaction Results
        const reactions = beam.getSupports().map((support, index) => {
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
        // 3. Initialize Analytical SFD/BMD & Deflection Engines
        const smSolver = new ShearMomentSolver_1.default(beam);
        const deflectionSolver = new DeflectionSolver_1.default(beam);
        const events = BeamEventEngine_1.default.extractEvents(beam);
        const intervals = BeamEventEngine_1.default.createIntervals(events);
        const samplesPerSegment = (_a = options === null || options === void 0 ? void 0 : options.samplesPerSegment) !== null && _a !== void 0 ? _a : 20;
        // Helper: Determine polynomial degrees on an interval [x1, x2]
        const getIntervalDegrees = (x1, x2) => {
            const mid = (x1 + x2) / 2;
            let hasFunction = false;
            let hasTrapezoid = false;
            let hasUDL = false;
            beam.getLoads().forEach((l) => {
                if (mid >= l.startLocation && mid <= l.endLocation) {
                    if (l instanceof FunctionLoad_1.default) {
                        hasFunction = true;
                    }
                    else if (l instanceof TaperzoidLoad_1.default) {
                        hasTrapezoid = true;
                    }
                    else if (l instanceof UniformlyDistributedLoad_1.default) {
                        hasUDL = true;
                    }
                }
            });
            if (hasFunction) {
                return { shearDegree: -1, momentDegree: -1, deflectionDegree: -1 };
            }
            if (hasTrapezoid) {
                return { shearDegree: 2, momentDegree: 3, deflectionDegree: 5 };
            }
            if (hasUDL) {
                return { shearDegree: 1, momentDegree: 2, deflectionDegree: 4 };
            }
            return { shearDegree: 0, momentDegree: 1, deflectionDegree: 3 };
        };
        // 4. Construct Shear Diagram
        const shearSegments = [];
        const shearPoints = [];
        intervals.forEach((interval) => {
            const { shearDegree } = getIntervalDegrees(interval.start, interval.end);
            const segmentSamples = [];
            for (let i = 0; i <= samplesPerSegment; i++) {
                const t = i / samplesPerSegment;
                const x = interval.start + t * interval.length;
                let v;
                if (i === 0) {
                    v = smSolver.getShearAt(x, "right");
                }
                else if (i === samplesPerSegment) {
                    v = smSolver.getShearAt(x, "left");
                }
                else {
                    v = smSolver.getShearAt(x);
                }
                const point = {
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
        const shearDiagram = {
            diagramType: "SHEAR",
            points: shearPoints,
            segments: shearSegments,
            max: shearMax,
            min: shearMin,
            zeroCrossings,
        };
        // 5. Construct Bending Moment Diagram
        const momentSegments = [];
        const momentPoints = [];
        intervals.forEach((interval) => {
            const { momentDegree } = getIntervalDegrees(interval.start, interval.end);
            const segmentSamples = [];
            for (let i = 0; i <= samplesPerSegment; i++) {
                const t = i / samplesPerSegment;
                const x = interval.start + t * interval.length;
                let m;
                if (i === 0) {
                    m = smSolver.getMomentAt(x, "right");
                }
                else if (i === samplesPerSegment) {
                    m = smSolver.getMomentAt(x, "left");
                }
                else {
                    m = smSolver.getMomentAt(x);
                }
                const point = {
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
        const momentDiagram = {
            diagramType: "MOMENT",
            points: momentPoints,
            segments: momentSegments,
            max: momentMax,
            min: momentMin,
            zeroCrossings,
        };
        // 6. Construct Deflection Diagram
        const deflectionSegments = [];
        const deflectionPoints = [];
        intervals.forEach((interval) => {
            const { deflectionDegree } = getIntervalDegrees(interval.start, interval.end);
            const segmentSamples = [];
            for (let i = 0; i <= samplesPerSegment; i++) {
                const t = i / samplesPerSegment;
                const x = interval.start + t * interval.length;
                const v = deflectionSolver.getDeflectionAt(x);
                const point = {
                    x,
                    value: v,
                };
                segmentSamples.push(point);
                deflectionPoints.push(point);
            }
            deflectionSegments.push({
                startX: interval.start,
                endX: interval.end,
                length: interval.length,
                polynomialDegree: deflectionDegree,
                samples: segmentSamples,
            });
        });
        const defMax = deflectionSolver.getMaxDeflection();
        const defMin = deflectionSolver.getMinDeflection();
        const deflectionDiagram = {
            diagramType: "DEFLECTION",
            points: deflectionPoints,
            segments: deflectionSegments,
            max: defMax,
            min: defMin,
            zeroCrossings: [],
        };
        const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
        return {
            beamLength: beam.Length,
            eModulus: beam.EModulus,
            reactions,
            shearDiagram,
            momentDiagram,
            deflectionDiagram,
            isStaticallyDeterminate: true,
            solveTimeMs: Math.max(0, endTime - startTime),
        };
    }
}
exports.BeamAnalyzer = BeamAnalyzer;
exports.default = BeamAnalyzer;
