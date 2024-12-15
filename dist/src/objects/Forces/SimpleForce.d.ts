import BaseForce from "./BaseFroce";
import Moment from "./Moment";
declare class SimpleForce extends BaseForce {
    constructor(magnitude: number, direction: "up" | "down", x: number);
    setY(y: number): void;
    getY(): number;
    getMomentAround(x: number, y: number): Moment;
    getMomentAround(x: number): number;
    getXComponent(): number;
    getYComponent(): number;
}
export default SimpleForce;
