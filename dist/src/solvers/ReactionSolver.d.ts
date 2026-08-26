import { Beam } from "../objects/beam";
import { BaseSupport } from "../objects/supports/BaseSupport";
export declare enum ReactionDOFType {
    FX = "FX",
    FY = "FY",
    MOMENT = "MOMENT"
}
export interface ReactionDOF {
    support: BaseSupport;
    type: ReactionDOFType;
    x: number;
    y: number;
}
export declare class ReactionSolver {
    /**
     * Solves for reaction forces and moments on the given beam using
     * the 2D general static equilibrium equations:
     *   Σ Fx = 0
     *   Σ Fy = 0
     *   Σ M_z(0,0) = 0
     *
     * @param beam The Beam model containing supports and applied loads.
     * @returns true if reactions were solved and populated successfully.
     */
    static solve(beam: Beam): boolean;
}
export default ReactionSolver;
