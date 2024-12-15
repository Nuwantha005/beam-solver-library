import { Beam } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseFroce";
import Moment from "../objects/Forces/Moment";
export interface ISolver {
    getBeam(): Beam;
    setBeam(beam: Beam): void;
    getShearAt(x: number): BaseForce;
    getMomentAt(x: number): Moment;
    getShearCurve(): number[];
    getMomentCurve(): number[];
}
