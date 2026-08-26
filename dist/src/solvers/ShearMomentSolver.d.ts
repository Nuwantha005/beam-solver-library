import { Beam } from "../objects/beam";
export interface ExtremumResult {
    x: number;
    value: number;
}
export declare class ShearMomentSolver {
    private beam;
    private tolerance;
    constructor(beam: Beam);
    /**
     * Evaluates the internal shear force V(x) at coordinate x.
     *
     * @param x Coordinate along the beam span [0, L]
     * @param side 'left' for V(x^-), 'right' for V(x^+), 'exact' for point evaluation (defaults to 'exact')
     */
    getShearAt(x: number, side?: "left" | "right" | "exact"): number;
    /**
     * Evaluates the internal bending moment M(x) at coordinate x (sagging is positive).
     *
     * @param x Coordinate along the beam span [0, L]
     * @param side 'left' for M(x^-), 'right' for M(x^+), 'exact' for point evaluation (defaults to 'exact')
     */
    getMomentAt(x: number, side?: "left" | "right" | "exact"): number;
    /**
     * Identifies all coordinates x in [0, L] where internal shear V(x) crosses zero
     * or has a step discontinuity spanning zero.
     * These locations correspond to local extrema of the bending moment diagram (dM/dx = 0).
     */
    getZeroCrossings(): number[];
    /**
     * Returns the global maximum shear force and its position.
     */
    getMaxShear(): ExtremumResult;
    /**
     * Returns the global minimum shear force and its position.
     */
    getMinShear(): ExtremumResult;
    /**
     * Returns the global maximum bending moment and its position.
     */
    getMaxMoment(): ExtremumResult;
    /**
     * Returns the global minimum bending moment and its position.
     */
    getMinMoment(): ExtremumResult;
    /**
     * Samples the shear curve into discrete points for plotting/visualization.
     */
    sampleShearCurve(points?: number): {
        x: number;
        v: number;
    }[];
    /**
     * Samples the bending moment curve into discrete points for plotting/visualization.
     */
    sampleMomentCurve(points?: number): {
        x: number;
        m: number;
    }[];
}
export default ShearMomentSolver;
