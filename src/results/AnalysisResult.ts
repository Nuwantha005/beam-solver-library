import { supportType } from "../objects/supports/BaseSupport";

export interface ReactionResult {
  supportIndex: number;
  location: number;
  supportType: supportType;
  fx: number;
  fy: number;
  moment: number;
  magnitude: number;
  angle: number;
}

export interface DiagramPoint {
  x: number;
  value: number;
  leftLimit?: number;
  rightLimit?: number;
  isDiscontinuity?: boolean;
  isExtremum?: boolean;
  label?: string;
}

export interface DiagramSegment {
  startX: number;
  endX: number;
  length: number;
  polynomialDegree: number;
  samples: DiagramPoint[];
}

export type DiagramType = "SHEAR" | "MOMENT" | "DEFLECTION" | "SLOPE";

export interface DiagramResult {
  diagramType: DiagramType;
  points: DiagramPoint[];
  segments: DiagramSegment[];
  max: { x: number; value: number };
  min: { x: number; value: number };
  zeroCrossings: number[];
}

export interface AnalysisResult {
  beamLength: number;
  eModulus: number;
  reactions: ReactionResult[];
  shearDiagram: DiagramResult;
  momentDiagram: DiagramResult;
  deflectionDiagram?: DiagramResult;
  isStaticallyDeterminate: boolean;
  solveTimeMs: number;
}

export interface AnalysisOptions {
  samplingPoints?: number;
  samplesPerSegment?: number;
  tolerance?: number;
}
