import BaseForce from "./BaseForce";
import Moment from "./Moment";
declare class SimpleForce extends BaseForce {
    constructor(magnitude: number, direction: "up" | "down", x: number);
    setY(_y: number): void;
    getY(): number;
    getMomentAround(x: number, y: number): Moment;
    getMomentAround(x: number): number;
    getXComponent(): number;
    getYComponent(): number;
    getTotalVerticalForce(): number;
    setMagnitude(magnitude: number): void;
}
export default SimpleForce;
