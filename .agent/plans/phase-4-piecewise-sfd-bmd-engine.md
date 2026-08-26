# Phase 4 Implementation Plan — Piecewise Analytical SFD & BMD Calculation Engine

## 1. Objectives
1. **Critical Event Extractor (`BeamEventEngine`)**:
   Extract and sort all critical boundary $x$-coordinates along the beam:
   - Beam boundaries ($x = 0$, $x = L$)
   - Support locations
   - Concentrated point loads & reactions
   - Concentrated applied moments & reaction moments
   - Distributed load start and end locations
2. **Piecewise Interval Segmentation**:
   Construct contiguous intervals $[x_i, x_{i+1}]$ covering the full span $[0, L]$ where response functions are continuous.
3. **Exact Analytical $V(x)$ and $M(x)$ Evaluation (`ShearMomentSolver`)**:
   - Evaluate left cut internal shear force:
     $$V(x) = \sum_{x_j \le x} F_{y,j}$$
   - Evaluate left cut internal bending moment:
     $$M(x) = \sum_{x_j \le x} F_{y,j} \cdot (x - x_j) + \sum_{x_k \le x} M_{z,k}$$
   - Confirm differential compatibility: $\frac{dM}{dx} = V(x)$.
4. **Limit & Discontinuity Queries**:
   - Query exact left limit $V(x^-)$, right limit $V(x^+)$, and step jump $\Delta V(x)$.
   - Query exact left limit $M(x^-)$, right limit $M(x^+)$, and step jump $\Delta M(x)$.
5. **Zero-Crossings & Extrema Detection**:
   - Identify points where $V(x) = 0$ within each segment.
   - Calculate global maximum and minimum shear ($V_{max}, V_{min}$) and bending moment ($M_{max}, M_{min}$).
6. **Update `BaseSolver` and `MCSolver`**:
   - Wire `getShearAt(x)`, `getMomentAt(x)`, `getMaxShear()`, `getMaxMoment()` to return verified analytical values.
7. **Comprehensive Unit Tests**:
   - Point loads on simply supported spans.
   - Full and partial UDLs with parabolic moment curves.
   - Triangular / trapezoidal distributed loads.
   - Cantilever tip loads and UDLs.
   - Applied concentrated moments creating step jumps in BMD.

---

## 2. Technical Architecture & Implementation Steps

### Step 4.1: Critical Event Engine (`src/solvers/BeamEventEngine.ts`)
- Extract all critical $x$-positions:
  - Supports: `support.Location`
  - Loads: `load.startLocation`, `load.endLocation`
  - Domain boundaries: `0`, `beam.Length`
- Deduplicate with tolerance $\epsilon = 10^{-6}$ and sort ascending.
- Define interval segments $[x_i, x_{i+1}]$.

### Step 4.2: Piecewise Shear & Moment Solver (`src/solvers/ShearMomentSolver.ts`)
- Methods:
  - `getShearAt(x: number, side?: 'left' | 'right' | 'exact'): number`
  - `getMomentAt(x: number, side?: 'left' | 'right' | 'exact'): number`
  - `getZeroCrossings(): number[]`
  - `getMaxShear(): { x: number; value: number }`
  - `getMinShear(): { x: number; value: number }`
  - `getMaxMoment(): { x: number; value: number }`
  - `getMinMoment(): { x: number; value: number }`
  - `sampleShearCurve(points?: number): { x: number; v: number }[]`
  - `sampleMomentCurve(points?: number): { x: number; m: number }[]`

### Step 4.3: Integration with `BaseSolver` & `MCSolver`
- Update `BaseSolver` and `MCSolver` methods to return real calculated forces/moments.

### Step 4.4: Unit Tests (`test/solvers/ShearMomentSolver.test.ts`)
- Simply supported with midspan point load ($V = \pm P/2$, $M_{max} = PL/4$).
- Simply supported with full UDL ($V(0) = wL/2$, $V(L) = -wL/2$, $M_{max} = wL^2/8$).
- Cantilever with end load ($V = P$, $M_{wall} = -PL$, $M_{tip} = 0$).
- Cantilever with full UDL ($V_{wall} = wL$, $M_{wall} = -wL^2/2$).
- Concentrated couple jump test.

---

## 3. Verification Criteria
- [ ] `npx tsc --noEmit` succeeds with 0 errors.
- [ ] All unit and benchmark tests pass.
- [ ] Differential relationship $dM/dx = V(x)$ verified on all continuous segments.
- [ ] Documentation updated in `.agent/docs/` and task execution log updated.
