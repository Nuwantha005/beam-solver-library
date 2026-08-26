# Beam Solver Library

[![Live Web Application](https://img.shields.io/badge/Live%20Web%20App-Nuwantha005.github.io%2Fbeam--solver--website-blue?style=flat-square&logo=githubpages)](https://Nuwantha005.github.io/beam-solver-website/)

A pure TypeScript structural engineering calculation engine for statically determinate 2D beam analysis. Designed to power web applications, visualizers, and engineering tools by cleanly separating mathematical computation from UI presentation.

> 🌐 **Live Interactive Web App**: Try the solver live in your browser at **[https://Nuwantha005.github.io/beam-solver-website/](https://Nuwantha005.github.io/beam-solver-website/)** ([GitHub Repository](https://github.com/Nuwantha005/beam-solver-website)). Features direct SVG manipulation, live 60 FPS SFD/BMD/Deflection diagrams, and step-by-step equilibrium derivations.

---

## Features

- **Object-Oriented Beam Modeling**: Define beam spans, material elastic modulus ($E$), and geometric cross sections declaratively.
- **Comprehensive Boundary Conditions**: Pinned (`PinnedSupport`), roller (`RollerSupport`), and fixed (`FixedSupport`) boundary conditions with dynamic degree-of-freedom reaction solving ($[A]\{R\} = \{b\}$).
- **Versatile Loading Capabilities**:
  - Point loads (`PointLoad`, `SimpleForce`, `Force2D`)
  - Uniformly distributed loads (`UniformlyDistributedLoad`)
  - Linearly varying / trapezoidal loads (`TaperzoidLoad`)
  - Concentrated couples / moments (`MomentLoad`, `Moment`)
- **Cross-Section Analysis**:
  - Rectangular (`RectangularCrossSection`)
  - Circular (`CircularCrossSection`)
  - I-Section (`ICrossSection`)
  - Custom / General Cross Sections (`CustomSection`)
  - Automated area, centroid ($\bar{y}$), and second moment of area ($I_{xx}$) calculations.
- **Analytical Solvers & Diagram Engines**:
  - `ReactionSolver`: 2D static equilibrium matrix solver ($[A]\{R\} = \{b\}$) with kinematic stability and determinacy detection (`UnstableBeamError`, `IndeterminateBeamError`).
  - `ShearMomentSolver`: Exact piecewise analytical shear force $V(x)$ and bending moment $M(x)$ with discontinuity limit queries and bisection zero-crossing detection.
  - `DeflectionSolver`: High-precision Euler-Bernoulli integration solving $EI \frac{d^2v}{dx^2} = M(x)$ for beam slopes ($\theta(x)$) and elastic deflection ($v(x)$).
  - `BeamAnalyzer`: High-level orchestrator returning strongly typed `AnalysisResult` bundles with piecewise polynomial degree segmentation (constant, linear, quadratic, cubic, quintic).
- **Headless & Zero-Dependency**: Zero UI framework dependencies; runs client-side in browsers, Web Workers, Node.js, and static deployments (e.g., Cloudflare Pages).

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Nuwantha005/beam-solver-library.git
cd beam-solver-library
npm install
```

---

## Quick Start

```typescript
import {
  Beam,
  PinnedSupport,
  RollerSupport,
  RectangularCrossSection,
  PointLoad,
  UniformlyDistributedLoad,
  MomentLoad,
} from "beam-library";

// 1. Create a 10-meter beam with rectangular cross section (0.2m x 0.4m) and steel modulus (200 GPa = 200e6 kPa)
const section = new RectangularCrossSection(0.2, 0.4);
const beam = new Beam(10.0, 200e6, section);

// 2. Add boundary supports (Pin at x = 0m, Roller at x = 10m)
beam.setSupports([
  new PinnedSupport(0),
  new RollerSupport(10)
]);

// 3. Add applied loads
beam.addLoad(new UniformlyDistributedLoad(0, 10, 2.0)); // 2 kN/m UDL across entire span
beam.addLoad(new PointLoad(15.0, 5.0));                 // 15 kN point load at midspan
beam.addLoad(new MomentLoad(20.0, "ccw", 7.0));         // 20 kNm CCW couple at x = 7m

// 4. Perform complete structural analysis
const result = beam.analyze({ samplesPerSegment: 20 });

// 5. Access strongly typed results
console.log("Reactions:", result.reactions);
console.log(`Max Bending Moment: ${result.momentDiagram.max.value} kNm at x = ${result.momentDiagram.max.x} m`);
console.log(`Min Deflection: ${result.deflectionDiagram?.min.value} m at x = ${result.deflectionDiagram?.min.x} m`);
```

---

## Project Structure

```text
.
├── src/
│   ├── index.ts                  # Public library exports
│   ├── objects/
│   │   ├── beam.ts               # Core Beam aggregate root & analyze()
│   │   ├── Forces/               # Vector forces, moments, and load types
│   │   │   ├── BaseForce.ts      # Base vector force class implementing ILoad
│   │   │   ├── SimpleForce.ts    # 1D vertical forces
│   │   │   ├── Force2D.ts        # 2D angled forces
│   │   │   ├── Moment.ts         # Concentrated moments
│   │   │   └── Loads/            # PointLoad, DistributedLoad, UDL, Trapezoid, MomentLoad
│   │   ├── supports/             # Pinned, Roller, and Fixed support definitions
│   │   └── crossSections/        # Rectangular, Circular, I-Section, and Custom profiles
│   ├── errors/
│   │   └── BeamErrors.ts         # Typed domain errors (UnstableBeamError, etc.)
│   ├── results/
│   │   └── AnalysisResult.ts     # Strongly typed AnalysisResult & DiagramResult models
│   └── solvers/
│       ├── ReactionSolver.ts     # Generalized static equilibrium solver [A]{R} = {b}
│       ├── BeamEventEngine.ts    # Critical event extractor & interval segmenter
│       ├── ShearMomentSolver.ts  # Piecewise analytical SFD & BMD calculation engine
│       ├── DeflectionSolver.ts   # Euler-Bernoulli integration elastic curve engine
│       ├── BeamAnalyzer.ts       # Unified facade service
│       └── MCSolver.ts           # Moment-Curvature solver
├── test/                         # Unit and canonical analytical benchmark test suites
│   ├── objects/                  # Beam, loads, cross sections, supports tests
│   ├── solvers/                  # Reaction, shear/moment, deflection tests
│   ├── results/                  # BeamAnalyzer end-to-end tests
│   ├── errors/                   # Domain error tests
│   └── benchmarks/               # 7 canonical civil/mechanical engineering benchmark cases
├── .agent/                       # AI Agent instructions, plans, task log, and deep specs
│   ├── AGENT.md                  # Operating instructions and conventions
│   ├── TASK_LOG.md               # Task execution history
│   ├── plans/                    # Master plan and phased implementation sub-plans
│   ├── PROJECT_SPECIFICATION.md  # Comprehensive engineering specification
│   └── docs/                     # Modular documentation (architecture, math, API, testing)
├── package.json
└── tsconfig.json
```

---

## Development & Testing

Run the automated test suite powered by Jest:

```bash
# Run all unit and benchmark tests
npm test

# Run a specific test suite
npx jest test/benchmarks/CanonicalBenchmarks.test.ts

# Type-check TypeScript sources
npx tsc --noEmit

# Compile to JavaScript (/dist)
npm run build # or npx tsc
```

---

## Coordinate & Sign Conventions

- **Origin**: Left end of the beam is $x = 0$.
- **Axes**: $+x$ extends to the right; $+y$ extends upwards.
- **Forces**: Upward forces are positive ($+y$); downward applied loads act in $-y$.
- **Moments**: Counter-Clockwise (`"ccw"`) is positive ($+M$); Clockwise (`"cw"`) is negative ($-M$).
- **Shear & Bending Moment**: Standard civil/mechanical mechanics conventions ($\frac{dM}{dx} = V(x)$, sagging moments are positive with compression at top and tension at bottom).
- **Elastic Curve Deflection**: Euler-Bernoulli relation $EI \frac{d^2v}{dx^2} = M(x)$, downward sagging deflection is negative.

For in-depth mathematical formulas, boundary conditions, and solver specifications, consult [`.agent/docs/physics-and-math.md`](file:///.agent/docs/physics-and-math.md) and [`.agent/PROJECT_SPECIFICATION.md`](file:///.agent/PROJECT_SPECIFICATION.md).

---

## 🌐 Interactive Web Application

Experience the library in action with the live web application:
- 🚀 **Live Web App**: **[https://Nuwantha005.github.io/beam-solver-website/](https://Nuwantha005.github.io/beam-solver-website/)**
- 📦 **Source Repository**: [**Nuwantha005/beam-solver-website**](https://github.com/Nuwantha005/beam-solver-website)

### Key Web Features:
- **Direct SVG Canvas Manipulation**: Drag supports, point loads, UDLs, trapezoidal loads, and moments with magnetic snapping.
- **Synchronized Real-Time Diagrams**: 60 FPS live SFD, BMD, and elastic deflection profiles.
- **Educational Step-by-Step Derivations**: KaTeX-rendered static equilibrium math ($\sum F_x = 0, \sum F_y = 0, \sum M = 0$).

---

## License

This project is licensed under the [ISC License](file:///LICENSE).

