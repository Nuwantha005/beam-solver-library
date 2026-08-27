# Implementation Plan — Arbitrary Distributed Loads ($w(x) = f(x)$)

## 1. Context & Architectural Overview

The library currently supports:
- Point Loads (`PointLoad`, `SimpleForce`, `Force2D`)
- Uniformly Distributed Loads (`UniformlyDistributedLoad` — degree 0)
- Trapezoidal / Triangular Distributed Loads (`TaperzoidLoad` — degree 1)
- Concentrated Couples (`MomentLoad`)

To support arbitrary continuous/piecewise distributed load profiles (e.g. parabolic $w(x) = w_0 (x/L)^2$, sinusoidal $w(x) = w_0 \sin(\pi x / L)$, exponential, or arbitrary mathematical expressions), we need a generalized `FunctionLoad` class in the `DistributedLoad` hierarchy.

---

## 2. Design Analysis: Function Callbacks vs. String Parsing

### Library-Level Design (Recommended: Function Callback with Metadata)
- **Signature**: `new FunctionLoad(startLocation: number, endLocation: number, loadFn: (x: number, localX: number) => number, options?: FunctionLoadOptions)`
- **Why this is optimal**:
  1. **Zero-Dependency & Lightweight**: Keeps `beam_Solver_library_ts` pure, headless, and without heavy external parser bloat.
  2. **Maximum Performance**: Executed directly by V8/JavaScript JIT compiler (~$100\times$ faster than interpreting an AST in tight integration loops).
  3. **Universal Flexibility**: Supports any mathematical curve, spline interpolation, empirical data table, or standard equation.
  4. **Optional Expression Metadata**: Accepts an optional `expression?: string` property (e.g. `"20 * sin(pi * x / 10)"`) for serialization, debugging, and UI round-tripping.

### UI-Level Integration
- In the frontend application (e.g. `beam-solver-website`), the UI can take a user-typed string expression, compile it safely via `mathjs.compile(expr)` into a JS function `x => compiled.evaluate({ x })`, and pass it to `FunctionLoad`.

---

## 3. Mathematical Formulation

For an arbitrary distributed load $w(x)$ acting on span $[a, b]$:

1. **Total Vertical Resultant Force**:
   $$W = -\int_a^b w(x) \, dx$$
2. **Centroid Coordinate $x_c$**:
   $$M_0 = \int_a^b x \cdot w(x) \, dx, \quad x_c = \frac{M_0}{\int_a^b w(x) \, dx}$$
3. **Equivalent Point Load**:
   $$\text{PointLoad}(|W|, x_c)$$
4. **Internal Shear Force Contribution $V_{load}(x)$** at section cut $x \in [a, b]$:
   $$V_{load}(x) = -\int_a^x w(\xi) \, d\xi$$
5. **Internal Bending Moment Contribution $M_{load}(x)$** at section cut $x \in [a, b]$:
   $$M_{load}(x) = -\int_a^x w(\xi) \cdot (x - \xi) \, d\xi$$

### High-Precision Numerical Quadrature
All definite integrals over $[a, x]$ are evaluated using **16-point Gauss-Legendre Quadrature**:
- Exact for all polynomials up to degree $2n - 1 = 31$.
- Relative error $< 10^{-10}$ for smooth transcendental functions ($\sin, \cos, \exp, \ln$).
- Extremely fast execution ($< 1\,\mu\text{s}$ per evaluation).

---

## 4. Proposed Changes to `beam_Solver_library_ts`

### 4.1 New Load Class
#### [NEW] `src/objects/Forces/Loads/FunctionLoad.ts`
- Extends `DistributedLoad`.
- Implements `ILoad` contract:
  - `startLocation`, `endLocation`, `loadType = LoadType.DISTRIBUTED`
  - `loadFn: (x: number, localX: number) => number`
  - `expression?: string`
  - `getTotalVerticalForce()`, `getTotalHorizontalForce()`
  - `getEquivalentPointLoad()`
  - `getMomentAround(x: number, y?: number)`
  - `getShearContribution(x: number): number`
  - `getMomentContribution(x: number): number`
  - Static factory helper: `FunctionLoad.fromExpression(expr: string, start: number, end: number)` (optional safe JS expression parser using `Function` or math evaluator).

### 4.2 Solver Integration
#### [MODIFY] `src/solvers/ShearMomentSolver.ts`
- In `getShearAt(x)`: handle `FunctionLoad` by delegating to its exact quadrature integration.
- In `getMomentAt(x)`: handle `FunctionLoad` by delegating to its exact moment quadrature integration.

#### [MODIFY] `src/solvers/BeamAnalyzer.ts`
- In `getIntervalDegrees()`: detect `FunctionLoad` and mark `polynomialDegree = -1` (or `"custom"`).

#### [MODIFY] `src/index.ts`
- Export `FunctionLoad` and `LoadFunction` type.

---

## 5. Verification & Testing Plan

### 5.1 Unit Tests (`test/objects/Forces/Loads/FunctionLoad.test.ts`)
- **Uniform function**: $w(x) = 10 \implies$ matches `UniformlyDistributedLoad` exactly.
- **Linear ramp**: $w(x) = 2x \implies$ matches `TaperzoidLoad` triangular profile.
- **Parabolic distribution**: $w(x) = 6 - \frac{6}{36} x^2$ on $[0, 6]$:
  - Exact analytical area $\int_0^6 (6 - x^2/6) dx = [6x - x^3/18]_0^6 = 36 - 12 = 24$ kN.
  - Centroid: $\int_0^6 (6x - x^3/6) dx = [3x^2 - x^4/24]_0^6 = 108 - 54 = 54 \implies x_c = 54 / 24 = 2.25$ m.
- **Sinusoidal half-wave**: $w(x) = w_0 \sin(\pi x / L)$ on $[0, L]$:
  - Exact analytical area: $\frac{2 w_0 L}{\pi}$.
  - Midspan moment on simple beam: $M_{mid} = \frac{w_0 L^2}{\pi^2}$.
  - Midspan deflection on simple beam: $v_{mid} = -\frac{w_0 L^4}{\pi^4 E I}$.

### 5.2 End-to-End Analysis (`test/solvers/ShearMomentSolver.test.ts` & `BeamAnalyzer.test.ts`)
- Verify reaction solving, SFD, BMD, and elastic curve deflections for parabolic and sinusoidal loads.

### 5.3 Automated Checks
- `npx tsc --noEmit`
- `npm test`
