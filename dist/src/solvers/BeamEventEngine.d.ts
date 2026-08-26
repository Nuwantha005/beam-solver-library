import { Beam } from "../objects/beam";
export interface BeamInterval {
    start: number;
    end: number;
    length: number;
}
export declare class BeamEventEngine {
    /**
     * Extracts, deduplicates, and sorts all critical boundary coordinates
     * along the beam span [0, L] where internal response equations may change.
     */
    static extractEvents(beam: Beam, tolerance?: number): number[];
    /**
     * Constructs open/closed contiguous intervals from sorted events.
     */
    static createIntervals(events: number[]): BeamInterval[];
}
export default BeamEventEngine;
