import BaseReaction from "./BaseReaction";
import Moment from "../Moment";
declare class SimpleReaction extends BaseReaction {
    constructor(magnitude: number, direction: "up" | "down", x: number);
    setMoment(): void;
    getMoment(): Moment;
}
export default SimpleReaction;
