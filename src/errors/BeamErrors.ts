/**
 * Base class for all beam-related domain errors.
 */
export class BeamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BeamError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a beam configuration is kinematically unstable,
 * under-constrained (fewer than 3 degrees of restraint in 2D),
 * or has redundant parallel/concurrent supports that cannot prevent motion.
 */
export class UnstableBeamError extends BeamError {
  constructor(message: string = "Beam support configuration is unstable.") {
    super(message);
    this.name = "UnstableBeamError";
  }
}

/**
 * Thrown when a beam has more constraints than equilibrium equations
 * (statically indeterminate) and cannot be solved with basic static equilibrium.
 */
export class IndeterminateBeamError extends BeamError {
  constructor(
    message: string = "Solving statically indeterminate beams is not supported by the static equilibrium solver."
  ) {
    super(message);
    this.name = "IndeterminateBeamError";
  }
}

/**
 * Thrown when invalid geometry, length, or boundary locations are supplied.
 */
export class InvalidGeometryError extends BeamError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidGeometryError";
  }
}

/**
 * Thrown when the equilibrium matrix cannot be inverted due to singular layout.
 */
export class SingularMatrixError extends BeamError {
  constructor(
    message: string = "Equilibrium matrix is singular; supports cannot maintain static equilibrium."
  ) {
    super(message);
    this.name = "SingularMatrixError";
  }
}
