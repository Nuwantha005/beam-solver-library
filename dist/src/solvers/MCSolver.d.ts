import { Beam } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseForce";
import Moment from "../objects/Forces/Moment";
import { BaseSolver } from "./BaseSolver";
export declare class MCSolver extends BaseSolver {
    private _smSolver;
    private _deflectionSolver;
    constructor(beam: Beam, stepSize?: number);
    solve(): boolean;
    getShearAt(x: number): BaseForce;
    getMomentAt(x: number): Moment;
    getMaxShear(): BaseForce;
    getMaxMoment(): Moment;
    getDeflectionAt(x: number): number;
}
export default MCSolver;
