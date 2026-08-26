"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeamEventEngine = void 0;
class BeamEventEngine {
    /**
     * Extracts, deduplicates, and sorts all critical boundary coordinates
     * along the beam span [0, L] where internal response equations may change.
     */
    static extractEvents(beam, tolerance = 1e-6) {
        const rawEvents = [0, beam.Length];
        // Supports
        beam.getSupports().forEach((s) => {
            rawEvents.push(s.Location);
        });
        // Loads
        beam.getLoads().forEach((l) => {
            rawEvents.push(l.startLocation);
            rawEvents.push(l.endLocation);
        });
        // Sort ascending
        rawEvents.sort((a, b) => a - b);
        // Deduplicate within tolerance
        const uniqueEvents = [];
        rawEvents.forEach((x) => {
            const clamped = Math.max(0, Math.min(beam.Length, x));
            if (uniqueEvents.length === 0 ||
                Math.abs(clamped - uniqueEvents[uniqueEvents.length - 1]) > tolerance) {
                uniqueEvents.push(clamped);
            }
        });
        return uniqueEvents;
    }
    /**
     * Constructs open/closed contiguous intervals from sorted events.
     */
    static createIntervals(events) {
        const intervals = [];
        for (let i = 0; i < events.length - 1; i++) {
            const start = events[i];
            const end = events[i + 1];
            intervals.push({
                start,
                end,
                length: end - start,
            });
        }
        return intervals;
    }
}
exports.BeamEventEngine = BeamEventEngine;
exports.default = BeamEventEngine;
