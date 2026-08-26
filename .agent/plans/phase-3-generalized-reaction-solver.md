# Phase 3 Implementation Plan — Generalized Matrix Equilibrium Reaction Solver

## 1. Objectives
1. **Implement Generalized 2D Static Equilibrium Formulation**:
   Formulate and solve $[A]\{R\} = \{b\}$ for any statically determinate boundary condition configuration (pinned-roller, cantilever, double roller with horizontal restraint, overhanging spans) under arbitrary loads (point loads, UDLs, trapezoidal loads, applied moments).
2. **Dynamic Degree of Freedom (DOF) Extraction**:
   Query supports for their unknown reaction components:
   - `RollerSupport`: 1 DOF ($R_y$ at $x_i$)
   - `PinnedSupport`: 2 DOFs ($R_x, R_y$ at $x_i$)
   - `FixedSupport`: 3 DOFs ($R_x, R_y, M_R$ at $x_i$)
3. **Equilibrium Equations & Load Vector $\{b\}$**:
   - Equation 1 ($\sum F_x = 0$): $\sum R_{x,i} = -\sum F_{x,applied}$
   - Equation 2 ($\sum F_y = 0$): $\sum R_{y,i} = -\sum F_{y,applied}$
   - Equation 3 ($\sum M_O = 0$): $\sum (R_{y,i} \cdot x_i - R_{x,i} \cdot y_i + M_{R,i}) = -\sum M_{O,applied}$
4. **Kinematic Determinacy & Stability Detection**:
   - $N_{DOF} < 3 \implies$ Throw `UnstableBeamError`
   - $N_{DOF} > 3 \implies$ Throw `IndeterminateBeamError`
   - $|\det(A)| < 10^{-9} \implies$ Throw `UnstableBeamError` (unstable layout, e.g. 3 parallel rollers)
5. **Populate Support Reactions**:
   Assign solved scalar/vector values and moments directly into the corresponding support instances.
6. **Unit Tests**:
   - Simply supported beams with symmetric & asymmetric point loads, UDLs, trapezoids.
   - Cantilever beams (fixed support at left or right) with tip loads, UDLs, and applied moments.
   - Overhanging beams.
   - Unstable configurations (e.g. 1 roller, 2 rollers, 3 parallel rollers) and indeterminate configurations (2 pins, 2 fixed).

---

## 2. Technical Architecture & Implementation Steps

### Step 3.1: Reaction Degree of Freedom Model
- Create helper / interface for support unknown DOFs:
  ```typescript
  export enum ReactionDOFType {
    FX = "FX",
    FY = "FY",
    MOMENT = "MOMENT",
  }

  export interface ReactionDOF {
    support: BaseSupport;
    type: ReactionDOFType;
    x: number;
    y: number;
  }
  ```

### Step 3.2: Create `ReactionSolver` (`src/solvers/ReactionSolver.ts`)
- Implement `solve(beam: Beam): boolean`:
  1. Collect DOFs from `beam.getSupports()`.
  2. Validate $N_{DOF} == 3$.
  3. Assemble $3 \times 3$ matrix $A$ and $3 \times 1$ load vector $b$:
     - For each DOF $j$:
       - If `type === FX`: $A[0][j] = 1$, $A[1][j] = 0$, $A[2][j] = -y_j$ (usually $0$).
       - If `type === FY`: $A[0][j] = 0$, $A[1][j] = 1$, $A[2][j] = x_j$.
       - If `type === MOMENT`: $A[0][j] = 0$, $A[1][j] = 0$, $A[2][j] = 1$.
     - Aggregate $\{b\}$ from `beam.getLoads()`:
       - $b[0] = -\sum \text{load.getTotalHorizontalForce()}$
       - $b[1] = -\sum \text{load.getTotalVerticalForce()}$
       - $b[2] = -\sum \text{moment of load about origin } (0, 0)$
  4. Compute $\det(A)$ and solve $[A]\{R\} = \{b\}$ using exact $3 \times 3$ matrix inversion / Gaussian elimination with partial pivoting.
  5. Assign solved reaction forces and moments back to `support.Reaction` and `support.Moment`.

### Step 3.3: Update `BaseSolver` & `MCSolver`
- Update `BaseSolver.solveReactions()` to invoke `ReactionSolver.solve(this.beam_)`.
- Export `ReactionSolver` in `src/index.ts`.

### Step 3.4: Comprehensive Unit Tests (`test/solvers/ReactionSolver.test.ts`)
- Standard simply supported problems.
- Cantilever problems with fixed support at $x=0$ or $x=L$.
- Overhanging beams with combined point loads and UDLs.
- Error cases: unstable (fewer than 3 DOFs, parallel rollers), indeterminate (over 3 DOFs).

---

## 3. Verification Criteria
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] All unit tests pass with 100% success.
- [ ] Cantilevers, simply supported, overhanging, and distributed load reaction problems verified against closed-form analytical statics.
- [ ] `.agent/docs/` updated and task log appended.
