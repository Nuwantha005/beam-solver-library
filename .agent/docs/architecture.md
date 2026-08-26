# Architecture & Domain Model

## 1. Architectural Principles

1. **Separation of Physics Engine & UI**:
   The library is a headless TypeScript calculation engine. It knows nothing about DOM, React, Canvas, SVG, or rendering frameworks. The presentation layer consumes data structures produced by this library.

2. **Model vs. Solver Separation**:
   - **Domain Objects** (`Beam`, `Forces`, `Loads`, `Supports`, `CrossSections`) describe the physical problem definition and geometry.
   - **Solver Classes** (`ReactionSolver`, `MCSolver`, `ShearSolver`, `MomentSolver`) consume the beam definition, perform analytical/equilibrium calculations, and populate results.

3. **Client-Side & Deterministic**:
   All computations execute client-side with zero backend dependencies, enabling offline support, fast interactive recomputations, and static hosting (e.g. Cloudflare Pages).

---

## 2. Domain Object Hierarchy

```text
Beam
 ├── Length: number
 ├── EModulus: number
 ├── CrossSection: BaseSection (RectCross, CircCrossSection, ISection, CustomSection)
 ├── Supports: BaseSupport[] (PinnedSupport, RollerSupport, FixedSupport)
 └── Forces: BaseForce[]
      ├── Force2D (Concentrated force at angle)
      ├── SimpleForce (Pure vertical upward/downward force)
      ├── Moment (Concentrated couple/moment)
      └── DistributedLoad (PointLoad, UniformlyDistributedLoad, TaperzoidLoad)
```

---

## 3. Solver Pipeline

The standard calculation pipeline processes the beam model through distinct stages:

```text
       ┌──────────────┐
       │     Beam     │ (Length, Supports, Applied Loads, Section)
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ReactionSolver│ Formulates [A]{R} = {b} equilibrium equations
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ Support Reac │ Assigned back to support objects on the beam
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ Event Sorter │ Collects critical boundary points (supports, load boundaries)
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ SFD/BMD      │ Piecewise analytical equations & boundary evaluations
       │ Generator    │ V(x), M(x), dM/dx = V(x), extrema, discontinuities
       └──────────────┘
```

---

## 4. Key Subsystems

- **`src/objects/beam.ts`**: Central aggregate root representing the physical span, boundary conditions, applied loads, and cross section.
- **`src/objects/Forces/`**: Force primitives and load abstractions:
  - `BaseFroce.ts` / `IForce.ts`: Interface and base vector force class with 2D moment resolution.
  - `SimpleForce.ts`: Constrained 1D vertical force ($y=0$).
  - `Moment.ts`: Concentrated torque/couple ($M$, CW/CCW).
  - `Loads/`: Distributed loads converted to equivalent point loads and regional contributions.
- **`src/objects/supports/`**: Support boundary conditions declaring reaction unknowns (Pinned: $R_x, R_y$; Roller: $R_y$; Fixed: $R_x, R_y, M$).
- **`src/objects/crossSections/`**: Section geometric properties ($A, \bar{y}, I_{xx}, I_{yy}$).
- **`src/solvers/`**: Numerical & analytical solvers (`BaseSolver`, `MCSolver` for moment-curvature/Macaulay calculations).
