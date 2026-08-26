# Phase 6 Implementation Plan — Deflection Solver & Elastic Curve Engine

## 1. Objectives
1. **Implement Direct Integration Deflection Solver (`DeflectionSolver`)**:
   Solve Euler-Bernoulli elastic curve equation:
   $$EI \frac{d^2 v}{dx^2} = M(x)$$
   $$\theta(x) = \frac{1}{EI} \int M(x) \, dx + C_1$$
   $$v(x) = \int \theta(x) \, dx + C_2$$
2. **Kinematic Boundary Condition Resolution**:
   - Two supports ($x_A, x_B$): $v(x_A) = 0, v(x_B) = 0 \implies$ solve for $C_1, C_2$.
   - Fixed support ($x_0$): $v(x_0) = 0, \theta(x_0) = 0 \implies C_1 = -\theta_{base}(x_0), C_2 = -v_{base}(x_0) - C_1 x_0$.
3. **High-Precision Composite Integration**:
   Use piecewise composite Simpson's integration over intervals to compute slope $\theta(x)$ and deflection $v(x)$ with $< 10^{-5}$ relative error for arbitrary load combinations.
4. **Integration into `BeamAnalyzer` & `MCSolver`**:
   - Include `deflectionDiagram` and slope in `AnalysisResult`.
   - Wire `MCSolver.getDeflectionAt(x)`.
5. **Canonical Benchmark Verification**:
   - Simply supported midspan load: $v_{max} = -\frac{PL^3}{48EI}$.
   - Simply supported full UDL: $v_{max} = -\frac{5wL^4}{384EI}$.
   - Cantilever tip load: $v_{tip} = -\frac{PL^3}{3EI}$.
   - Cantilever full UDL: $v_{tip} = -\frac{wL^4}{8EI}$.

---

## 2. Technical Architecture & Implementation Steps

### Step 6.1: Create `DeflectionSolver` (`src/solvers/DeflectionSolver.ts`)
- Methods:
  - `getSlopeAt(x: number): number` (in radians)
  - `getDeflectionAt(x: number): number` (in meters/length units)
  - `getMaxDeflection(): { x: number; value: number }`
  - `sampleDeflectionCurve(points?: number): { x: number; v: number }[]`
  - `sampleSlopeCurve(points?: number): { x: number; theta: number }[]`

### Step 6.2: Integrate with `BeamAnalyzer` & `MCSolver`
- Populate `analysisResult.deflectionDiagram` in `BeamAnalyzer.analyze()`.
- Connect `MCSolver.getDeflectionAt(x)` to `DeflectionSolver.getDeflectionAt(x)`.

### Step 6.3: Export in `src/index.ts`
- Export `DeflectionSolver`.

### Step 6.4: Comprehensive Unit Tests (`test/solvers/DeflectionSolver.test.ts`)
- Verify all 4 classical closed-form deflection cases against theoretical values.
- Verify overhang and multi-load deflection profiles.

---

## 3. Verification Criteria
- [ ] `npx tsc --noEmit` succeeds with 0 errors.
- [ ] All unit and analytical benchmark tests pass.
- [ ] Documentation updated in `.agent/docs/` and task execution log updated.
