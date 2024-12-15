import BaseReaction from "../Forces/reactions/BaseReaction";
import SimpleReaction from "../Forces/reactions/SimpleReaction";
import { BaseSupport } from "./BaseSupport";
export declare class RollerSupport extends BaseSupport {
    constructor(location: number);
    get Reaction(): BaseReaction;
    set Reaction(reaction: SimpleReaction);
    private _reaction;
}
export default RollerSupport;
