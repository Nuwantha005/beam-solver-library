import { Beam } from "../objects/beam";
import { AnalysisResult, AnalysisOptions } from "../results/AnalysisResult";
export declare class BeamAnalyzer {
    /**
     * Executes a complete structural analysis on the provided Beam model,
     * producing strongly typed reaction results, shear force diagrams,
     * bending moment diagrams, and elastic deflection curves.
     *
     * @param beam The Beam model to analyze.
     * @param options Configuration options for sampling resolution and precision.
     * @returns Complete AnalysisResult bundle.
     */
    static analyze(beam: Beam, options?: AnalysisOptions): AnalysisResult;
}
export default BeamAnalyzer;
