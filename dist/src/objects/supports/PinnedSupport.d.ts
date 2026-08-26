import Force2D from "../Forces/Force2D";
import { BaseSupport } from "./BaseSupport";
export declare class PinnedSupport extends BaseSupport {
    private _reaction;
    constructor(location: number);
    get Reaction(): Force2D;
    set Reaction(reaction: Force2D);
}
export default PinnedSupport;
