import { Beam } from "../objects/beam";
import BaseForce from "../objects/Forces/BaseForce";
import Moment from "../objects/Forces/Moment";
import { ISolver } from "./ISolver";
export declare abstract class BaseSolver implements ISolver {
    protected beam_: Beam;
    protected shearCurve_: number[];
    protected momentCurve_: number[];
    protected stepSize_: number;
    constructor(beam: Beam, stepSize?: number);
    abstract solve(): boolean;
    abstract getShearAt(x: number): BaseForce;
    abstract getMomentAt(x: number): Moment;
    abstract getMaxShear(): BaseForce;
    abstract getMaxMoment(): Moment;
    abstract getDeflectionAt(x: number): number;
    findReactions(): boolean;
    solveReactions(): boolean;
    get beam(): Beam;
    set beam(value: Beam);
    get shearCurve(): number[];
    get momentCurve(): number[];
    set stepSize(stepSize: number);
    get stepSize(): number;
}
