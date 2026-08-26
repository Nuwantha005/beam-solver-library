import Moment from "../Moment";
import { ILoad, LoadType } from "./ILoad";
export declare class MomentLoad implements ILoad {
    private _magnitude;
    private _direction;
    private _location;
    constructor(magnitude: number, direction?: "cw" | "ccw", location?: number);
    get loadType(): LoadType;
    get startLocation(): number;
    get endLocation(): number;
    get location(): number;
    set location(value: number);
    get magnitude(): number;
    set magnitude(value: number);
    get direction(): "cw" | "ccw";
    set direction(value: "cw" | "ccw");
    /**
     * Pure moments exert no net vertical force.
     */
    getTotalVerticalForce(): number;
    /**
     * Pure moments exert no net horizontal force.
     */
    getTotalHorizontalForce(): number;
    /**
     * Returns the concentrated moment contribution.
     * A pure couple produces an invariant moment about any coordinate.
     */
    getMomentAround(x: number, y?: number): Moment;
    /**
     * Returns signed scalar moment value (positive for CCW, negative for CW).
     */
    getSignedMagnitude(): number;
}
export default MomentLoad;
