import BaseForce from "../objects/Forces/BaseForce";
import Moment from "../objects/Forces/Moment";
export interface ISolver {
    solve(): boolean;
    getShearAt(x: number): BaseForce;
    getMomentAt(x: number): Moment;
    getMaxShear(): BaseForce;
    getMaxMoment(): Moment;
    getDeflectionAt(x: number): number;
}
