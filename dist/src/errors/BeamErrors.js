"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingularMatrixError = exports.InvalidGeometryError = exports.IndeterminateBeamError = exports.UnstableBeamError = exports.BeamError = void 0;
/**
 * Base class for all beam-related domain errors.
 */
class BeamError extends Error {
    constructor(message) {
        super(message);
        this.name = "BeamError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.BeamError = BeamError;
/**
 * Thrown when a beam configuration is kinematically unstable,
 * under-constrained (fewer than 3 degrees of restraint in 2D),
 * or has redundant parallel/concurrent supports that cannot prevent motion.
 */
class UnstableBeamError extends BeamError {
    constructor(message = "Beam support configuration is unstable.") {
        super(message);
        this.name = "UnstableBeamError";
    }
}
exports.UnstableBeamError = UnstableBeamError;
/**
 * Thrown when a beam has more constraints than equilibrium equations
 * (statically indeterminate) and cannot be solved with basic static equilibrium.
 */
class IndeterminateBeamError extends BeamError {
    constructor(message = "Solving statically indeterminate beams is not supported by the static equilibrium solver.") {
        super(message);
        this.name = "IndeterminateBeamError";
    }
}
exports.IndeterminateBeamError = IndeterminateBeamError;
/**
 * Thrown when invalid geometry, length, or boundary locations are supplied.
 */
class InvalidGeometryError extends BeamError {
    constructor(message) {
        super(message);
        this.name = "InvalidGeometryError";
    }
}
exports.InvalidGeometryError = InvalidGeometryError;
/**
 * Thrown when the equilibrium matrix cannot be inverted due to singular layout.
 */
class SingularMatrixError extends BeamError {
    constructor(message = "Equilibrium matrix is singular; supports cannot maintain static equilibrium.") {
        super(message);
        this.name = "SingularMatrixError";
    }
}
exports.SingularMatrixError = SingularMatrixError;
