import { IForce } from "../IForce";
import Moment from "../Moment";
export interface IReaction extends IForce {
    setMoment(moment: Moment): void;
    getMoment(): Moment;
}
