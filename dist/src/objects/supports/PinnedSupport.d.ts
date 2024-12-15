import BaseReaction from "../Forces/reactions/BaseReaction";
import DoubleReaction from "../Forces/reactions/DoubleReaction";
import { BaseSupport } from "./BaseSupport";
export declare class PinnedSupport extends BaseSupport {
    constructor(location: number);
    get Reaction(): BaseReaction;
    set Reaction(reaction: DoubleReaction);
    private _reaction;
}
export default PinnedSupport;
