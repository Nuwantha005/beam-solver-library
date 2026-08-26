# Beam Solver Library

A pure TypeScript structural engineering calculation engine for statically determinate 2D beam analysis. Designed to power web applications, visualizers, and engineering tools by cleanly separating mathematical computation from UI presentation.

---

## Features

- **Object-Oriented Beam Modeling**: Define beam spans, material elastic modulus ($E$), and geometric cross sections declaratively.
- **Comprehensive Boundary Conditions**: Support for pinned, roller, and fixed supports with automated reaction resolution.
- **Versatile Loading Capabilities**:
  - Concentrated vertical and 2D vector forces
  - Concentrated moments / couples (CW & CCW)
  - Point loads and distributed loads (Uniformly Distributed Loads & Trapezoidal Loads)
- **Cross-Section Analysis**:
  - Rectangular (`RectangularCrossSection`)
  - Circular (`CircularCrossSection`)
  - I-Section (`ICrossSection`)
  - Custom / General Cross Sections (`CustomSection`)
  - Automated area, centroid ($\bar{y}$), and second moment of area ($I_{xx}$) calculations.
- **Analytical & Event-Based Solvers**:
  - Global equilibrium system formulation ($[A]\{R\} = \{b\}$)
  - Exact piecewise Shear Force $V(x)$ and Bending Moment $M(x)$ functions
  - Moment-Curvature and elastic curve deflection calculations ($EI \frac{d^2v}{dx^2} = M(x)$)
- **Headless & Zero-Dependency**: Zero UI framework dependencies; runs client-side in browsers, workers, Node.js, and static deployments (e.g., Cloudflare Pages).

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Nuwantha005/beam_Solver_library_ts.git
cd beam_Solver_library_ts
npm install
```

---

## Quick Start

```typescript
import {
  Beam,
  PinnedSupport,
  RectangularCrossSection,
  SimpleForce
} from "beam-library";

// 1. Create a 6-meter beam with rectangular cross section (0.2m x 0.4m) and steel modulus (200 GPa)
const section = new RectangularCrossSection(0.2, 0.4);
const beam = new Beam(6.0, 200e9, section);

// 2. Add boundary supports (Pin at x = 0m, Roller at x = 6m)
beam.addSupport(new PinnedSupport(0));

// 3. Add applied loads (10 kN downward at midspan x = 3m)
beam.addForce(new SimpleForce(10000, "down", 3.0));

// 4. Access beam properties
console.log(`Beam Type: ${beam.BeamType}`);
console.log(`Cross-Section Inertia (Ixx): ${beam.crossSection.getInertia()} m^4`);
```

---

## Project Structure

```text
.
├── src/
│   ├── index.ts                  # Public library exports
│   ├── objects/
│   │   ├── beam.ts               # Core Beam aggregate root
│   │   ├── Forces/               # Vector forces, moments, and load types
│   │   │   ├── BaseFroce.ts      # Base vector force class
│   │   │   ├── SimpleForce.ts    # 1D vertical forces
│   │   │   ├── Moment.ts         # Concentrated moments
│   │   │   └── Loads/            # PointLoad, DistributedLoad, UDL, Trapezoid
│   │   ├── supports/             # Pinned, Roller, and Fixed support definitions
│   │   └── crossSections/        # Rectangular, Circular, I-Section, and Custom profiles
│   └── solvers/                  # Equilibrium & Moment-Curvature analysis engines
├── test/                         # Unit and analytical benchmark test suites
├── .agent/                       # AI Agent instructions, plans, task log, and deep specs
│   ├── AGENT.md                  # Operating instructions and conventions
│   ├── TASK_LOG.md               # Task execution history
│   ├── plans/                    # Task and feature implementation plans
│   ├── PROJECT_SPECIFICATION.md  # Comprehensive engineering specification
│   └── docs/                     # Modular documentation (architecture, math, API)
├── package.json
└── tsconfig.json
```

---

## Development & Testing

Run the automated test suite powered by Jest:

```bash
# Run all unit tests
npm test

# Run a specific test suite
npx jest test/objects/beam.test.ts

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
- **Moments**: Counter-Clockwise (`"ccw"`) is positive; Clockwise (`"cw"`) is negative.
- **Shear & Bending Moment**: Follows standard structural mechanics conventions ($\frac{dM}{dx} = V(x)$, sagging moments are positive).

For in-depth mathematical formulas, singularity functions, and solver specifications, consult [`.agent/docs/physics-and-math.md`](file:///.agent/docs/physics-and-math.md) and [`.agent/PROJECT_SPECIFICATION.md`](file:///.agent/PROJECT_SPECIFICATION.md).

---

## License

This project is licensed under the [ISC License](file:///LICENSE).
