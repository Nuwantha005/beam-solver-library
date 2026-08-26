# Phase 1 Implementation Plan — Foundation Refactoring & Model Completion

## 1. Objectives
1. **Fix File Naming Typo**: Rename `src/objects/Forces/BaseFroce.ts` to `src/objects/Forces/BaseForce.ts` and update all imports.
2. **Fix Type Inconsistencies**: Fix `BaseSupport` reaction setter type signature (`BaseForce` instead of `BaseSupport`).
3. **Implement `FixedSupport`**: Complete support models with full 2D fixed/clamped boundary condition ($R_x, R_y, M$).
4. **Implement Domain Errors**: Create typed exception hierarchy in `src/errors/BeamErrors.ts`.
5. **Add Comprehensive Tests**: Unit test `FixedSupport`, domain errors, and ensure all existing tests pass.

---

## 2. Step-by-Step Implementation Details

### Step 1.1: File Renaming & Import Fixes
- Create `src/objects/Forces/BaseForce.ts` with correct naming.
- Update import paths in:
  - `src/objects/Forces/Force2D.ts`
  - `src/objects/Forces/SimpleForce.ts`
  - `src/objects/beam.ts`
  - `src/objects/supports/BaseSupport.ts`
  - `src/solvers/ISolver.ts`
  - `src/solvers/BaseSolver.ts`
  - `src/solvers/MCSolver.ts`
  - `src/index.ts`
  - `test/objects/Forces/BaseForce.test.ts`
- Remove old `src/objects/Forces/BaseFroce.ts`.

### Step 1.2: Fix `BaseSupport.ts`
- Fix setter signature:
  ```typescript
  abstract get Reaction(): BaseForce;
  abstract set Reaction(reaction: BaseForce);
  ```
- Ensure getters/setters for `Moment` work consistently across all supports:
  ```typescript
  abstract get Moment(): Moment;
  abstract set Moment(moment: Moment);
  ```

### Step 1.3: Implement `FixedSupport.ts`
- Path: `src/objects/supports/FixedSupport.ts`
- Implement class extending `BaseSupport`:
  ```typescript
  import Force2D from "../Forces/Force2D";
  import Moment from "../Forces/Moment";
  import { BaseSupport, supportType } from "./BaseSupport";

  export class FixedSupport extends BaseSupport {
    private _reaction: Force2D;
    private _moment: Moment;

    constructor(location: number) {
      super(location, supportType.FIXED, new Moment(0, "cw", location, 0));
      this._reaction = new Force2D(0, 0, location);
      this._moment = new Moment(0, "cw", location, 0);
    }

    get Reaction(): Force2D {
      return this._reaction;
    }
    set Reaction(reaction: Force2D) {
      this._reaction = reaction;
    }

    get Moment(): Moment {
      return this._moment;
    }
    set Moment(moment: Moment) {
      this._moment = moment;
    }
  }

  export default FixedSupport;
  ```

### Step 1.4: Implement Domain Errors
- Path: `src/errors/BeamErrors.ts`
- Classes:
  - `BeamError extends Error`
  - `UnstableBeamError extends BeamError`
  - `IndeterminateBeamError extends BeamError`
  - `InvalidGeometryError extends BeamError`

### Step 1.5: Update `src/index.ts`
- Export `BaseForce`, `FixedSupport`, `RollerSupport`, `BeamErrors`.

### Step 1.6: Unit Tests & Verification
- Create `test/objects/supports/FixedSupport.test.ts`.
- Create `test/errors/BeamErrors.test.ts`.
- Run `npm test` and `npx tsc --noEmit`.

---

## 3. Verification Criteria
- [ ] No compilation or lint errors on `npx tsc --noEmit`.
- [ ] All tests in `test/` pass without regression.
- [ ] `BaseForce` imported consistently.
- [ ] `FixedSupport` correctly instantiable and tested.
- [ ] Task log updated in `.agent/TASK_LOG.md`.
