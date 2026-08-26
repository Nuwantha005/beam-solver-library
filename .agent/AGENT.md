# Beam Solver Library — Agent Guidelines

Welcome to the **beam-library** codebase. This is a pure TypeScript engineering calculation engine for statically determinate 2D beams, reactions, shear force diagrams (SFD), bending moment diagrams (BMD), and cross-sectional properties.

---

## 1. Agentic Workflow Protocol

Every agent working in this repository must follow this sequence:

1. **Review Recent Tasks**:
   Check recent history by inspecting the task log before starting:
   ```bash
   tail -n 30 .agent/TASK_LOG.md
   ```
2. **Plan & Document**:
   Save all implementation plans in the [`.agent/plans/`](file:///.agent/plans/) folder as markdown files (e.g., `.agent/plans/<feature-or-fix-name>.md`).
3. **Reference Deep Context (As Needed)**:
   For detailed engineering specs and formulas, consult [`.agent/PROJECT_SPECIFICATION.md`](file:///.agent/PROJECT_SPECIFICATION.md) and [`.agent/docs/`](file:///.agent/docs/).
4. **Implement with TDD**:
   Write/update Jest tests under `test/` for any new logic or bug fix before or alongside modifying `src/`.
5. **Verify**:
   Run tests and type checks (`npm test` / `npx jest`).
6. **Log Completed Work**:
   **Always append an entry** at the bottom of [`.agent/TASK_LOG.md`](file:///.agent/TASK_LOG.md) describing what was accomplished.
7. **Documentation** if the task is significant enough and requires edits in one or more of files in the `.agent/docs/` folder (or even a new file) modify them so future agents can use them.
8. **Source Control** After each successful implementation (and testing to make sure things work) commit the changes to github.

---

## 2. Casing & Coding Conventions

- **Classes / Types / Enums**: `PascalCase` (e.g., `Beam`, `PinnedSupport`, `SimpleForce`, `MCSolver`, `BeamType`)
- **Interfaces**: `I` prefix with `PascalCase` (e.g., `IForce`, `ISection`, `ISolver`)
- **Methods & Functions**: `camelCase` (e.g., `getMomentAround`, `getShearAt`, `addForce`, `solve`)
- **Properties & Getters**: Maintain consistency with existing accessors (e.g., `beam.Length`, `beam.EModulus`, `support.Location`)
- **Files**: PascalCase matching primary class name (e.g., `MCSolver.ts`, `RectCross.ts`, `PointLoad.ts`)
- **Public API**: Export public classes/types only via [`src/index.ts`](file:///src/index.ts). Keep internal helpers unexported from root.

---

## 3. Key Commands

```bash
# Run all unit tests
npm test

# Run a specific test suite
npx jest test/solvers/MCSolver.test.ts

# Type-check without emit
npx tsc --noEmit

# Build the project
npx tsc
```

---

## 4. Documentation & Directory Reference

- **Agent Plans**: [`.agent/plans/`](file:///.agent/plans/) — Architecture & task plans
- **Task Log**: [`.agent/TASK_LOG.md`](file:///.agent/TASK_LOG.md) — Chronological record of completed agent tasks
- **Full Engineering Spec**: [`.agent/PROJECT_SPECIFICATION.md`](file:///.agent/PROJECT_SPECIFICATION.md) — Comprehensive 1800+ line specification
- **Modular Docs**: [`.agent/docs/`](file:///.agent/docs/)
  - [`architecture.md`](file:///.agent/docs/architecture.md): Object model hierarchy & design patterns
  - [`physics-and-math.md`](file:///.agent/docs/physics-and-math.md): Sign conventions, coordinate system, SFD/BMD math
  - [`api-and-conventions.md`](file:///.agent/docs/api-and-conventions.md): API contract, exports & known codebase notes
  - [`testing-and-roadmap.md`](file:///.agent/docs/testing-and-roadmap.md): Test cases, benchmarks & future roadmap
