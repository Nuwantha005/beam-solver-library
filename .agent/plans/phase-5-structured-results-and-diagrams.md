# Phase 5 Implementation Plan — First-Class Structured Result Objects & Diagram Models

## 1. Objectives
1. **Define Strongly-Typed Result Data Structures**:
   Create standardized, framework-agnostic interfaces in `src/results/`:
   - `ReactionResult`: Reaction force components ($F_x, F_y$) and reaction moment ($M_R$) with support metadata.
   - `DiagramPoint`: Coordinate $x$, scalar value, limit evaluations ($V^- / V^+$), and semantic tags (`isDiscontinuity`, `isExtremum`).
   - `DiagramSegment`: Sub-span $[x_i, x_{i+1}]$ with polynomial degree (0, 1, 2, 3) and sampled point series.
   - `DiagramResult`: Complete diagram representation with sampled points, piecewise segments, global extrema, and zero-crossings.
   - `AnalysisResult`: Complete bundle containing beam metadata, reactions, SFD, BMD, determinacy status, and solver execution time.
2. **Implement `BeamAnalyzer` Service**:
   Provide a unified facade `BeamAnalyzer.analyze(beam: Beam, options?: AnalysisOptions): AnalysisResult` (with sampling resolution, unit formatting options).
3. **Add `Beam.analyze()` Convenience Method**:
   Allow direct invocation on any `Beam` instance: `const results = beam.analyze();`.
4. **Unit Tests**:
   - Comprehensive test suite in `test/results/BeamAnalyzer.test.ts` verifying that `AnalysisResult` contains exact reactions, diagram curves, piecewise segments, extrema, and discontinuities.
5. **Documentation & Public API Exports**:
   - Export all result types from `src/index.ts`.
   - Update `.agent/docs/api-and-conventions.md` and `.agent/docs/architecture.md`.

---

## 2. Technical Architecture & Implementation Steps

### Step 5.1: Create Result Interfaces (`src/results/AnalysisResult.ts`)
- `ReactionResult`
- `DiagramPoint`
- `DiagramSegment`
- `DiagramResult`
- `AnalysisResult`
- `AnalysisOptions`

### Step 5.2: Create `BeamAnalyzer` Engine (`src/solvers/BeamAnalyzer.ts`)
- Solves reactions using `ReactionSolver`.
- Constructs `ReactionResult[]`.
- Uses `ShearMomentSolver` and `BeamEventEngine` to construct `DiagramResult` for shear and bending moment:
  - Discontinuity handling at concentrated loads (populates `leftLimit`, `rightLimit`, `isDiscontinuity: true`).
  - Extrema handling at zero-crossings (populates `isExtremum: true`).
  - Piecewise segment construction with polynomial degrees (0 for pure shear between point loads, 1 for linear shear under UDL, 2 for parabolic moment under UDL, 3 for cubic moment under triangular load).
- Wraps into `AnalysisResult`.

### Step 5.3: Extend `Beam` with `analyze()`
- Add `analyze(options?: AnalysisOptions): AnalysisResult` method to `Beam` in `src/objects/beam.ts`.

### Step 5.4: Unit Tests (`test/results/BeamAnalyzer.test.ts`)
- Validate schema conformance of `AnalysisResult`.
- Test simply supported, cantilever, and overhanging configurations.
- Verify that UI-friendly diagram segments and points are correctly structured.

---

## 3. Verification Criteria
- [ ] `npx tsc --noEmit` succeeds with 0 errors.
- [ ] All unit tests pass.
- [ ] `AnalysisResult` verified with exact values and segment polynomial degrees.
- [ ] Documentation updated in `.agent/docs/` and task execution log updated.
