# Testing Strategy & Development Roadmap

## 1. Test Architecture

The test suite is built with Jest (`ts-jest`) and mirrors the `src/` directory layout:

```text
test/
├── objects/
│   ├── beam.test.ts
│   ├── Forces/
│   │   ├── BaseForce.test.ts
│   │   ├── SimpleForce.test.ts
│   │   ├── Moment.test.ts
│   │   └── Loads/
│   │       └── PointLoad.test.ts
│   ├── crossSections/
│   │   ├── CircCrossSection.test.ts
│   │   ├── CustomSection.test.ts
│   │   ├── ISection.test.ts
│   │   └── RectCross.test.ts
│   └── supports/
│       ├── PinnedSupport.test.ts
│       └── RollerSupport.test.ts
└── solvers/
    └── MCSolver.test.ts
```

---

## 2. Standard Analytical Verification Benchmarks

When implementing or validating solvers, use canonical analytical test problems:

### Benchmark 1: Simply Supported Beam with Midspan Point Load
- **Length**: $L$, **Load**: $P$ downward at $x = L/2$.
- **Reactions**: $R_A = R_B = P/2$.
- **Max Shear**: $V_{max} = P/2$.
- **Max Moment**: $M_{max} = \frac{P L}{4}$ at $x = L/2$.
- **Max Deflection**: $\delta_{max} = \frac{P L^3}{48 E I}$ at $x = L/2$.

### Benchmark 2: Simply Supported Beam with Uniformly Distributed Load
- **Length**: $L$, **Load**: $w$ downward across full span $[0, L]$.
- **Reactions**: $R_A = R_B = \frac{w L}{2}$.
- **Max Shear**: $V(0) = \frac{w L}{2}$, $V(L) = -\frac{w L}{2}$.
- **Max Moment**: $M_{max} = \frac{w L^2}{8}$ at $x = L/2$.
- **Max Deflection**: $\delta_{max} = \frac{5 w L^4}{384 E I}$ at $x = L/2$.

### Benchmark 3: Cantilever Beam with Tip Point Load
- **Length**: $L$, Fixed at $x=0$, Load $P$ downward at $x = L$.
- **Reactions**: $R_y = P$, $M_{wall} = -P L$.
- **Max Moment**: $|M| = P L$ at $x = 0$.
- **Max Deflection**: $\delta_{max} = \frac{P L^3}{3 E I}$ at $x = L$.

---

## 3. Implementation Roadmap

1. **Phase 1 — Core Reaction Solver**:
   - Implement generalized equilibrium matrix solver $[A]\{R\} = \{b\}$ for determinate systems (Pin + Roller, Cantilever Fixed).
   - Set reactions onto support objects.
2. **Phase 2 — Analytical Piecewise SFD & BMD Engine**:
   - Event collector for all critical positions ($x$ coordinates of supports, point loads, distributed load starts/ends).
   - Evaluate exact $V(x)$ and $M(x)$ equations per segment.
   - Extract extrema and zero-crossings (locations where $V(x)=0 \implies M_{max}$).
3. **Phase 3 — Moment-Curvature & Macaulay Deflection Solver**:
   - Finish `MCSolver` or integrate Macaulay singularity function solver for continuous deflection $v(x)$ curves.
4. **Phase 4 — Distributed & Trapezoidal Load Integration**:
   - Full support for `UniformlyDistributedLoad` and `TaperzoidLoad` in the equilibrium and piecewise SFD/BMD calculations.
