import DistributedLoad from "./DistributedLoad";
import PointLoad from "./PointLoad";
import Moment from "../Moment";
import { LoadType } from "./ILoad";
export type LoadFunction = (x: number, localX?: number) => number;
export interface FunctionLoadOptions {
    expression?: string;
}
export declare class FunctionLoad extends DistributedLoad {
    private _loadFn;
    private _expression?;
    constructor(startLocation: number, endLocation: number, loadFn: LoadFunction, options?: FunctionLoadOptions);
    get loadType(): LoadType;
    get loadFn(): LoadFunction;
    set loadFn(fn: LoadFunction);
    get expression(): string | undefined;
    set expression(expr: string | undefined);
    /**
     * Evaluates the load intensity w(x) at coordinate x.
     */
    evaluateAt(x: number): number;
    /**
     * Computes the total scalar magnitude of the load area:
     * W = ∫ w(x) dx
     */
    getTotalForceMagnitude(): number;
    /**
     * Returns total vertical resultant force (downward is negative).
     */
    getTotalVerticalForce(): number;
    /**
     * Returns total horizontal force (0 for purely vertical distributed load).
     */
    getTotalHorizontalForce(): number;
    /**
     * Calculates equivalent point load with total magnitude and centroid position:
     * xc = (∫ x * w(x) dx) / (∫ w(x) dx)
     */
    getEquivalentPointLoad(): PointLoad;
    /**
     * Evaluates internal shear contribution V_load(x) = -∫_a^x w(t) dt
     */
    getShearContribution(x: number): number;
    /**
     * Evaluates internal bending moment contribution M_load(x) = -∫_a^x w(t) * (x - t) dt
     */
    getMomentContribution(x: number): number;
    /**
     * Returns Moment around a given reference point (x, y).
     */
    getMomentAround(x: number, y?: number): Moment;
    /**
     * Convenience factory to create a FunctionLoad from a mathematical expression string.
     * Supports: x, localX, L, pi, e, sin, cos, tan, sqrt, abs, exp, log, pow, ^
     *
     * Example: FunctionLoad.fromExpression("20 * sin(pi * x / 10)", 0, 10)
     */
    static fromExpression(expression: string, startLocation: number, endLocation: number): FunctionLoad;
}
export default FunctionLoad;
