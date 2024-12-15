import { Beam } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseFroce";
import Moment from "../objects/Forces/Moment";
import { ISolver } from "./ISolver";
export declare abstract class BaseSolver implements ISolver {
    protected beam: Beam;
    constructor(beam: Beam);
    abstract getShearAt(x: number): BaseForce;
    abstract getMomentAt(x: number): Moment;
    abstract getShearCurve(): number[];
    abstract getMomentCurve(): number[];
    getBeam(): Beam;
    setBeam(beam: Beam): void;
}
