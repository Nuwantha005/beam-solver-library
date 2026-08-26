# Beam Solver Library — Master Implementation Plan

## 1. Overview & Vision

This master implementation plan establishes the architectural roadmap to complete the **Beam Solver Library** (`beam-library`). The library provides a robust, UI-agnostic, client-side TypeScript calculation engine for 2D statically determinate beams, reactions, piecewise shear force diagrams (SFD), bending moment diagrams (BMD), and elastic deflection profiles.

The roadmap is structured into 7 sequential phases. Each phase will have its own dedicated sub-plan executed with strict Test-Driven Development (TDD) before moving to the next.

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│                        MASTER IMPLEMENTATION ROADMAP                           │
└────────────────────────────────────────────────────────────────────────────────┘
  Phase 1: Foundation Refactoring & Model Completion
    │ (Fix BaseForce typo, BaseSupport typing, implement FixedSupport, domain errors)
    ▼
  Phase 2: Unified Load Hierarchy & Beam Integration
    │ (Unify PointLoad, UDL, TaperzoidLoad, MomentLoad; attach directly to Beam)
    ▼
  Phase 3: Generalized Matrix Equilibrium Reaction Solver
    │ (Formulate [A]{R} = {b} for 2D equilibrium; replace hardcoded 2-support logic)
    ▼
  Phase 4: Piecewise Analytical SFD & BMD Calculation Engine
    │ (Event extraction, interval segments, exact V(x)/M(x), limits, zero crossings)
    ▼
  Phase 5: First-Class Structured Result Objects & Diagram Models
    │ (ReactionResult, ShearResult, MomentResult, DiagramResult, AnalysisResult)
    ▼
  Phase 6: Deflection Solver & Elastic Curve Engine
    │ (Moment-Curvature / Macaulay integration for deflection v(x) & slope θ(x))
    ▼
  Phase 7: Comprehensive Benchmark Verification & Test Suite
    │ (Canonical analytical verification problems, edge cases, regression suite)
```

---

## 2. Detailed Phase Breakdown

---

### Phase 1: Foundation Refactoring & Model Completion
**Goal**: Clean up type inconsistencies, fix file naming, complete support models, and establish structured domain errors.

* **Key Deliverables**:
  1. **Rename File**: Rename `src/objects/Forces/BaseFroce.ts` $\rightarrow$ `BaseForce.ts` and update all internal/external imports and tests.
  2. **Fix `BaseSupport` Type Signature**: Correct `abstract set Reaction(reaction: BaseSupport)` to `abstract set Reaction(reaction: BaseForce)`.
  3. **Implement `FixedSupport`**: Create `src/objects/supports/FixedSupport.ts` modeling fully restrained boundary condition ($R_x, R_y, M_{reaction}$) and corresponding unit tests.
  4. **Domain Errors**: Create `src/errors/` with typed exceptions:
     - `UnstableBeamError` (under-constrained / mechanism)
     - `IndeterminateBeamError` (over-constrained for static solver)
     - `InvalidGeometryError` (out-of-bounds positions, negative lengths)
* **Files to Touch**:
  - `src/objects/Forces/BaseForce.ts` (rename & fix imports)
  - `src/objects/supports/BaseSupport.ts` (fix signature)
  - `src/objects/supports/FixedSupport.ts` (new)
  - `src/errors/BeamErrors.ts` (new)
  - `src/index.ts` (update exports)
  - `test/objects/supports/FixedSupport.test.ts` (new)

---

### Phase 2: Unified Load Hierarchy & Beam Integration
**Goal**: Unify all load types into a cohesive hierarchy and allow `Beam` to store and manage them seamlessly.

* **Key Deliverables**:
  1. **Common `ILoad` / `BaseLoad` Hierarchy**:
     - Ensure `PointLoad`, `DistributedLoad` (`UniformlyDistributedLoad`, `TaperzoidLoad`), and concentrated `MomentLoad` implement a unified load interface.
     - Add `getTotalForce()`, `getCentroid()`, and `getMomentAround(x)` across all load types.
  2. **Beam Load Management**:
     - Update `Beam` class to store both point forces and distributed loads in a unified collection (`_loads: BaseLoad[]`).
     - Provide clean methods: `addLoad()`, `getLoads()`, `removeLoads()`, maintaining backwards-compatible `addForce()` / `getForces()`.
  3. **Applied Moments**:
     - Ensure concentrated couples/moments can be applied at any position along the span.
* **Files to Touch**:
  - `src/objects/Forces/Loads/BaseLoad.ts` (new/refactored base)
  - `src/objects/Forces/Loads/PointLoad.ts`
  - `src/objects/Forces/Loads/DistributedLoad.ts`
  - `src/objects/Forces/Loads/UniformlyDistributedLoad.ts`
  - `src/objects/Forces/Loads/TaperzoidLoad.ts`
  - `src/objects/beam.ts`
  - `test/objects/beam.test.ts`

---

### Phase 3: Generalized Matrix Equilibrium Reaction Solver
**Goal**: Implement a robust 2D static equilibrium matrix solver $[A]\{R\} = \{b\}$ that handles any determinate support configuration.

* **Key Deliverables**:
  1. **Equation Formulation**:
     $$\sum F_x = 0 \implies \sum R_{xi} + \sum F_{x,applied} = 0$$
     $$\sum F_y = 0 \implies \sum R_{yi} + \sum F_{y,applied} = 0$$
     $$\sum M_{O} = 0 \implies \sum (R_{yi} \cdot x_i - R_{xi} \cdot y_i + M_{Ri}) + \sum M_{applied} = 0$$
  2. **Matrix Construction $[A]\{R\} = \{b\}$**:
     - Unknown vector $\{R\}$ of size $N_{DOF}$ constructed dynamically from support DOFs.
     - Roller support $\rightarrow 1$ DOF ($R_y$).
     - Pinned support $\rightarrow 2$ DOFs ($R_x, R_y$).
     - Fixed support $\rightarrow 3$ DOFs ($R_x, R_y, M$).
  3. **Solvability & Determinacy Classification**:
     - If $N_{DOF} < 3 \implies$ throw `UnstableBeamError`.
     - If $N_{DOF} > 3 \implies$ throw `IndeterminateBeamError`.
     - If $\det(A) \approx 0 \implies$ throw `UnstableBeamError` (e.g. 3 parallel rollers or collinear constraints).
  4. **Solve & Reaction Assignment**:
     - Solve linear system using Gaussian elimination / `mathjs`.
     - Populate reaction vectors and moments directly into corresponding support instances.
* **Files to Touch**:
  - `src/solvers/ReactionSolver.ts` (new / extracted)
  - `src/solvers/BaseSolver.ts`
  - `test/solvers/ReactionSolver.test.ts` (new)

---

### Phase 4: Piecewise Analytical SFD & BMD Calculation Engine
**Goal**: Calculate exact piecewise continuous functions for Shear Force $V(x)$ and Bending Moment $M(x)$ using an event-driven interval architecture.

* **Key Deliverables**:
  1. **Event Sorter**:
     - Extract and sort all unique critical $x$-coordinates: $x = 0$, support locations, point load locations, concentrated moment locations, distributed load start/end points, and $x = L$.
  2. **Piecewise Interval Segments**:
     - Divide beam into $N$ open intervals: $[x_0, x_1], [x_1, x_2], \dots, [x_{N-1}, x_N]$.
     - Formulate polynomial expressions for $V_i(x)$ and $M_i(x)$ on each segment.
  3. **Limit & Discontinuity Handling**:
     - Support querying $V(x^-)$ (left limit), $V(x^+)$ (right limit), and step jump $\Delta V(x) = V(x^+) - V(x^-)$.
     - Handle step discontinuities in $M(x)$ from concentrated applied moments.
  4. **Extrema & Zero Crossings**:
     - Automatically find zero-crossings where $V(x) = 0$ to identify maximum/minimum bending moments ($dM/dx = V$).
* **Files to Touch**:
  - `src/solvers/BeamEventEngine.ts` (new)
  - `src/solvers/ShearMomentSolver.ts` (new)
  - `src/solvers/BaseSolver.ts`
  - `src/solvers/MCSolver.ts`
  - `test/solvers/ShearMomentSolver.test.ts` (new)

---

### Phase 5: First-Class Structured Result Objects & Diagram Models
**Goal**: Replace raw arrays and void returns with structured, immutable, typed result objects for clean presentation consumption.

* **Key Deliverables**:
  1. **Result Data Models**:
     - `ReactionResult`: Support ID/location, reaction components $(R_x, R_y)$, moment $M_R$.
     - `ShearResult`: Query coordinate $x$, left value $V(x^-)$, right value $V(x^+)$, step jump.
     - `MomentResult`: Query coordinate $x$, value $M(x)$, slope $dM/dx$.
     - `SegmentResult`: Interval $[x_a, x_b]$, polynomial coefficients for $V(x)$ and $M(x)$.
     - `DiagramResult`: Collection of segments, critical points, zero crossings, and extrema $(V_{max}, V_{min}, M_{max}, M_{min})$.
     - `AnalysisResult`: Complete bundle containing equilibrium status, reactions, shear diagram, moment diagram, and deflection diagram.
* **Files to Touch**:
  - `src/results/ReactionResult.ts` (new)
  - `src/results/ShearResult.ts` (new)
  - `src/results/MomentResult.ts` (new)
  - `src/results/DiagramResult.ts` (new)
  - `src/results/AnalysisResult.ts` (new)
  - `src/index.ts`

---

### Phase 6: Deflection Solver & Elastic Curve Engine
**Goal**: Implement elastic deflection $v(x)$ and slope $\theta(x)$ calculations via Moment-Curvature / Macaulay integration.

* **Key Deliverables**:
  1. **Governing Equation & Integration**:
     $$EI \frac{d^2 v}{dx^2} = M(x) \implies EI \theta(x) = \int M(x) dx + C_1 \implies EI v(x) = \iint M(x) dx^2 + C_1 x + C_2$$
  2. **Boundary Conditions**:
     - Determine integration constants $C_1, C_2$ from support constraints:
       - Pinned/Roller at $x_i \implies v(x_i) = 0$.
       - Fixed support at $x_j \implies v(x_j) = 0$ and $\theta(x_j) = 0$.
  3. **Deflection API**:
     - `getDeflectionAt(x: number): number`
     - `getSlopeAt(x: number): number`
     - `getMaxDeflection(): { x: number, deflection: number }`
* **Files to Touch**:
  - `src/solvers/DeflectionSolver.ts` (new)
  - `src/solvers/MCSolver.ts`
  - `test/solvers/DeflectionSolver.test.ts` (new)

---

### Phase 7: Comprehensive Benchmark Verification & Test Suite
**Goal**: Verify the entire calculation pipeline against classical analytical benchmarks from structural mechanics literature.

* **Benchmark Suite**:
  1. **Simply Supported + Center Point Load**: Exact reactions ($P/2$), $V_{max} = P/2$, $M_{max} = PL/4$, $\delta_{max} = PL^3 / (48EI)$.
  2. **Simply Supported + Full UDL**: Exact reactions ($wL/2$), $V(0) = wL/2$, $M_{max} = wL^2/8$, $\delta_{max} = 5wL^4 / (384EI)$.
  3. **Cantilever + End Point Load**: Fixed wall reaction ($P, -PL$), $M_{max} = -PL$, $\delta_{max} = PL^3 / (3EI)$.
  4. **Cantilever + Full UDL**: Fixed wall reaction ($wL, -wL^2/2$), $M_{max} = -wL^2/2$, $\delta_{max} = wL^4 / (8EI)$.
  5. **Overhanging Beam**: Two supports with overhanging span, point load and partial UDL.
  6. **Beam with Applied Pure Moments**: Discontinuity in bending moment diagram verification.
* **Files to Touch**:
  - `test/benchmarks/SimplySupported.test.ts` (new)
  - `test/benchmarks/Cantilever.test.ts` (new)
  - `test/benchmarks/Overhanging.test.ts` (new)
  - `test/benchmarks/AppliedMoment.test.ts` (new)

---

## 3. Implementation Process & Rules

For each phase:
1. **Create Phase Plan**: Write a granular step-by-step plan under `.agent/plans/phase-X-<name>.md`.
2. **Execute with TDD**:
   - Write failing unit/benchmark tests under `test/`.
   - Implement the minimal clean TypeScript logic in `src/`.
   - Verify tests pass (`npm test`) and type check succeeds (`npx tsc --noEmit`).
3. **Log Progress**: Record completed work and touched files in `.agent/TASK_LOG.md`.
