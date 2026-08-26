import { Beam } from "../objects/beam";
export interface DeflectionExtremum {
    x: number;
    value: number;
}
export declare class DeflectionSolver {
    private beam;
    private smSolver;
    private numIntervals;
    private xGrid;
    private thetaGrid;
    private vGrid;
    private c1;
    private c2;
    private EI;
    constructor(beam: Beam, numIntervals?: number);
    private computeDeflection;
    /**
     * Returns slope (rotation) theta(x) in radians.
     */
    getSlopeAt(x: number): number;
    /**
     * Returns vertical deflection v(x) in length units (negative is downward sagging).
     */
    getDeflectionAt(x: number): number;
    /**
     * Returns maximum (peak upward or peak downward) deflection along the span.
     */
    getMaxDeflection(): DeflectionExtremum;
    /**
     * Returns minimum (most negative downward) deflection along the span.
     */
    getMinDeflection(): DeflectionExtremum;
    /**
     * Samples the deflection curve into discrete points.
     */
    sampleDeflectionCurve(points?: number): {
        x: number;
        v: number;
    }[];
    /**
     * Samples the slope curve into discrete points.
     */
    sampleSlopeCurve(points?: number): {
        x: number;
        theta: number;
    }[];
}
export default DeflectionSolver;
