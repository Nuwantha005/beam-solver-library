import BaseForce from "../BaseFroce";
import Moment from "../Moment";
import { IReaction } from "./IReaction";
declare class BaseReaction extends BaseForce implements IReaction {
    private moment;
    constructor(magnitude: number, direction: number, x: number, y: number, moment?: Moment);
    setMoment(moment: Moment): void;
    getMoment(): Moment;
}
export default BaseReaction;
