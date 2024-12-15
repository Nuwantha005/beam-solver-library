import Moment from "./Moment";
declare abstract class BaseForce {
    protected magnitude: number;
    protected angle: number;
    protected x: number;
    protected y: number;
    constructor(magnitude: number, direction: number, x: number, y: number);
    getMomentAround(x: number, y: number): Moment;
    getMomentAround(x: number): number;
    getXComponent(): number;
    getYComponent(): number;
    getMagnitude(): number;
    getDirection(): number;
    setMagnitude(magnitude: number): void;
    setDirection(direction: number): void;
    getX(): number;
    setX(x: number): void;
    getY(): number;
    setY(y: number): void;
}
export default BaseForce;
