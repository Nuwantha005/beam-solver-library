# API Contracts & Codebase Conventions

## 1. Public API Surface

All consumers of this library import exclusively from [`src/index.ts`](file:///src/index.ts).

### Currently Exported Entities
- **Beam Model**: `Beam`, `BeamType`
- **Errors**: `BeamError`, `UnstableBeamError`, `IndeterminateBeamError`, `InvalidGeometryError`, `SingularMatrixError`
- **Forces & Loads**: `ILoad`, `LoadType`, `BaseForce`, `SimpleForce`, `Force2D`, `Moment`, `IForce`, `PointLoad`, `DistributedLoad`, `UniformlyDistributedLoad`, `TaperzoidLoad`, `MomentLoad`
- **Cross Sections**: `BaseSection`, `CrossSectionType`, `CircularCrossSection`, `ICrossSection`, `CustomSection`, `RectangularCrossSection`
- **Supports**: `BaseSupport`, `supportType`, `PinnedSupport`, `RollerSupport`, `FixedSupport`
- **Solvers**: `ISolver`, `BaseSolver`, `MCSolver`, `ReactionSolver`

### Planned / Upcoming Exports
- `ShearMomentSolver`, `DeflectionSolver`
- `ReactionResult`, `ShearResult`, `MomentResult`, `DiagramResult`, `AnalysisResult`

---

## 2. Standard Interfaces

### `IForce`
```typescript
export interface IForce {
  getMomentAround(x: number, y: number): Moment;
  getMomentAround(x: number): number;
  getXComponent(): number;
  getYComponent(): number;
  getMagnitude(): number;
  getDirection(): number;
  setMagnitude(magnitude: number): void;
  setDirection(direction: number): void;
  getX(): number;
  setX(x: number): void;
  getY(): number;
  setY(y: number): void;
}
```

### `ISection` / `BaseSection`
```typescript
export interface ISection {
  getArea(): number;
  getCentroidY(): number;
  getInertia(): number; // Ixx about neutral axis
}
```

### `ISolver`
```typescript
export interface ISolver {
  solve(): boolean;
  getShearAt(x: number): BaseForce;
  getMomentAt(x: number): Moment;
  getMaxShear(): BaseForce;
  getMaxMoment(): Moment;
  getDeflectionAt?(x: number): number;
}
```

---

## 3. Codebase Conventions

1. **BaseForce Filename**:
   The base force module is named `src/objects/Forces/BaseForce.ts` and exports `BaseForce`.
2. **Accessors vs Methods**:
   - `beam.Length`, `beam.EModulus`, `beam.crossSection`, `support.Location` are getter/setter properties (`PascalCase` / `camelCase`).
   - `beam.getForces()`, `beam.setForces()`, `beam.getSupports()` are methods.
   - Maintain backwards-compatibility for existing call-sites when adding new properties or methods.
3. **Units & Consistency**:
   - Standard SI units are assumed throughout: meters ($\text{m}$), Newtons ($\text{N}$), Pascals ($\text{Pa} = \text{N/m}^2$), Joules/Newton-meters ($\text{N}\cdot\text{m}$).
