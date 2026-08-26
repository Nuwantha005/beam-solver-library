import SimpleForce from "../Forces/SimpleForce";
import { BaseSupport } from "./BaseSupport";
export declare class RollerSupport extends BaseSupport {
    private _reaction;
    constructor(location: number);
    get Reaction(): SimpleForce;
    set Reaction(reaction: SimpleForce);
}
export default RollerSupport;
