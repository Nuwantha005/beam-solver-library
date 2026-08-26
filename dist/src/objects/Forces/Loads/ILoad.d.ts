import Moment from "../Moment";
export declare enum LoadType {
    POINT = "POINT",
    DISTRIBUTED = "DISTRIBUTED",
    MOMENT = "MOMENT"
}
export interface ILoad {
    readonly loadType: LoadType;
    readonly startLocation: number;
    readonly endLocation: number;
    /**
     * Returns the net vertical force resultant (in N).
     * Upward is positive (+), downward is negative (-).
     */
    getTotalVerticalForce(): number;
    /**
     * Returns the net horizontal force resultant (in N).
     * Rightward is positive (+), leftward is negative (-).
     */
    getTotalHorizontalForce(): number;
    /**
     * Calculates the moment produced by the entire load (or relevant portion)
     * about an arbitrary reference coordinate (x, y).
     * Counter-clockwise is positive ('ccw'), clockwise is negative ('cw').
     */
    getMomentAround(x: number, y?: number): Moment | number;
}
