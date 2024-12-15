import Moment from "./Moment";
export interface IForce {
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
