import SimpleForce from "../SimpleForce";
declare class PointLoad extends SimpleForce {
    constructor(magnitude: number, x: number);
    getMagnitude(): number;
    setMagnitude(value: number): void;
}
export default PointLoad;
