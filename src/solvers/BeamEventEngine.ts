import { Beam } from "../objects/beam";

export interface BeamInterval {
  start: number;
  end: number;
  length: number;
}

export class BeamEventEngine {
  /**
   * Extracts, deduplicates, and sorts all critical boundary coordinates
   * along the beam span [0, L] where internal response equations may change.
   */
  static extractEvents(beam: Beam, tolerance: number = 1e-6): number[] {
    const rawEvents: number[] = [0, beam.Length];

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
    const uniqueEvents: number[] = [];
    rawEvents.forEach((x) => {
      const clamped = Math.max(0, Math.min(beam.Length, x));
      if (
        uniqueEvents.length === 0 ||
        Math.abs(clamped - uniqueEvents[uniqueEvents.length - 1]) > tolerance
      ) {
        uniqueEvents.push(clamped);
      }
    });

    return uniqueEvents;
  }

  /**
   * Constructs open/closed contiguous intervals from sorted events.
   */
  static createIntervals(events: number[]): BeamInterval[] {
    const intervals: BeamInterval[] = [];
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

export default BeamEventEngine;
