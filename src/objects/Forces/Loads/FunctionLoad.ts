import DistributedLoad from "./DistributedLoad";
import PointLoad from "./PointLoad";
import Moment from "../Moment";
import { LoadType } from "./ILoad";

export type LoadFunction = (x: number, localX?: number) => number;

export interface FunctionLoadOptions {
  expression?: string;
}

// 16-point Gauss-Legendre quadrature nodes and weights on [-1, 1]
const GAUSS_POINTS_16 = [
  { x: 0.09501250983763744, w: 0.1894506104550685 },
  { x: -0.09501250983763744, w: 0.1894506104550685 },
  { x: 0.2816035507792589, w: 0.1826034150449236 },
  { x: -0.2816035507792589, w: 0.1826034150449236 },
  { x: 0.4580167776572274, w: 0.1691565193950025 },
  { x: -0.4580167776572274, w: 0.1691565193950025 },
  { x: 0.6178762444026438, w: 0.1495959888165767 },
  { x: -0.6178762444026438, w: 0.1495959888165767 },
  { x: 0.755404408355003, w: 0.1246289712555339 },
  { x: -0.755404408355003, w: 0.1246289712555339 },
  { x: 0.8656312023878318, w: 0.0951585116824928 },
  { x: -0.8656312023878318, w: 0.0951585116824928 },
  { x: 0.9445750230732326, w: 0.0622535239386479 },
  { x: -0.9445750230732326, w: 0.0622535239386479 },
  { x: 0.9894009349916499, w: 0.0271524594117541 },
  { x: -0.9894009349916499, w: 0.0271524594117541 },
];

/**
 * Numerically integrates function g(t) over [a, b] using 16-point Gauss-Legendre quadrature.
 */
function gaussLegendre16(g: (t: number) => number, a: number, b: number): number {
  if (Math.abs(b - a) < 1e-12) return 0;
  const c = (b - a) / 2;
  const m = (a + b) / 2;
  let sum = 0;
  for (let i = 0; i < GAUSS_POINTS_16.length; i++) {
    const pt = GAUSS_POINTS_16[i];
    sum += pt.w * g(m + c * pt.x);
  }
  return c * sum;
}

export class FunctionLoad extends DistributedLoad {
  private _loadFn: LoadFunction;
  private _expression?: string;

  constructor(
    startLocation: number,
    endLocation: number,
    loadFn: LoadFunction,
    options?: FunctionLoadOptions
  ) {
    super(startLocation, endLocation);
    this._loadFn = loadFn;
    this._expression = options?.expression;
  }

  get loadType(): LoadType {
    return LoadType.DISTRIBUTED;
  }

  get loadFn(): LoadFunction {
    return this._loadFn;
  }

  set loadFn(fn: LoadFunction) {
    this._loadFn = fn;
  }

  get expression(): string | undefined {
    return this._expression;
  }

  set expression(expr: string | undefined) {
    this._expression = expr;
  }

  /**
   * Evaluates the load intensity w(x) at coordinate x.
   */
  evaluateAt(x: number): number {
    const localX = x - this.startLocation;
    return this._loadFn(x, localX);
  }

  /**
   * Computes the total scalar magnitude of the load area:
   * W = ∫ w(x) dx
   */
  getTotalForceMagnitude(): number {
    return gaussLegendre16(
      (t) => this.evaluateAt(t),
      this.startLocation,
      this.endLocation
    );
  }

  /**
   * Returns total vertical resultant force (downward is negative).
   */
  getTotalVerticalForce(): number {
    return -this.getTotalForceMagnitude();
  }

  /**
   * Returns total horizontal force (0 for purely vertical distributed load).
   */
  getTotalHorizontalForce(): number {
    return 0;
  }

  /**
   * Calculates equivalent point load with total magnitude and centroid position:
   * xc = (∫ x * w(x) dx) / (∫ w(x) dx)
   */
  getEquivalentPointLoad(): PointLoad {
    const a = this.startLocation;
    const b = this.endLocation;
    const totalW = this.getTotalForceMagnitude();

    if (Math.abs(totalW) < 1e-12) {
      return new PointLoad(0, (a + b) / 2);
    }

    const firstMoment = gaussLegendre16((t) => t * this.evaluateAt(t), a, b);
    const xc = firstMoment / totalW;

    return new PointLoad(totalW, xc);
  }

  /**
   * Evaluates internal shear contribution V_load(x) = -∫_a^x w(t) dt
   */
  getShearContribution(x: number): number {
    if (x <= this.startLocation) return 0;
    const upper = Math.min(x, this.endLocation);
    const wPartial = gaussLegendre16(
      (t) => this.evaluateAt(t),
      this.startLocation,
      upper
    );
    return -wPartial;
  }

  /**
   * Evaluates internal bending moment contribution M_load(x) = -∫_a^x w(t) * (x - t) dt
   */
  getMomentContribution(x: number): number {
    if (x <= this.startLocation) return 0;
    const a = this.startLocation;
    const b = this.endLocation;

    if (x >= b) {
      const eq = this.getEquivalentPointLoad();
      return -eq.getMagnitude() * (x - eq.getX());
    }

    // Within load span [a, b]
    const mPartial = gaussLegendre16(
      (t) => this.evaluateAt(t) * (x - t),
      a,
      x
    );
    return -mPartial;
  }

  /**
   * Returns Moment around a given reference point (x, y).
   */
  getMomentAround(x: number, y?: number): Moment {
    const eqLoad = this.getEquivalentPointLoad();
    if (x <= this.startLocation) {
      // Equivalent point load is entirely to the right
      const momentVal = eqLoad.getMagnitude() * (eqLoad.getX() - x);
      return new Moment(momentVal, "ccw", x, y ?? 0);
    } else if (x >= this.endLocation) {
      // Equivalent point load is entirely to the left
      const momentVal = -eqLoad.getMagnitude() * (x - eqLoad.getX());
      return new Moment(momentVal, "cw", x, y ?? 0);
    } else {
      // Point lies within the distributed load
      const momentVal = this.getMomentContribution(x);
      return new Moment(momentVal, "cw", x, y ?? 0);
    }
  }

  /**
   * Convenience factory to create a FunctionLoad from a mathematical expression string.
   * Supports: x, localX, L, pi, e, sin, cos, tan, sqrt, abs, exp, log, pow, ^
   *
   * Example: FunctionLoad.fromExpression("20 * sin(pi * x / 10)", 0, 10)
   */
  static fromExpression(
    expression: string,
    startLocation: number,
    endLocation: number
  ): FunctionLoad {
    const span = endLocation - startLocation;
    const sanitized = expression
      .replace(/\^/g, "**")
      .replace(/\bpi\b/gi, "Math.PI")
      .replace(/\be\b/gi, "Math.E")
      .replace(/\bsin\b/gi, "Math.sin")
      .replace(/\bcos\b/gi, "Math.cos")
      .replace(/\btan\b/gi, "Math.tan")
      .replace(/\bsqrt\b/gi, "Math.sqrt")
      .replace(/\babs\b/gi, "Math.abs")
      .replace(/\bexp\b/gi, "Math.exp")
      .replace(/\blog\b/gi, "Math.log")
      .replace(/\bpow\b/gi, "Math.pow");

    const fn = new Function(
      "x",
      "localX",
      "L",
      `
      try {
        return (${sanitized});
      } catch (e) {
        return 0;
      }
    `
    ) as (x: number, localX: number, L: number) => number;

    return new FunctionLoad(
      startLocation,
      endLocation,
      (x, localX) => fn(x, localX ?? x - startLocation, span),
      { expression }
    );
  }
}

export default FunctionLoad;
