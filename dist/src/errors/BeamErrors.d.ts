/**
 * Base class for all beam-related domain errors.
 */
export declare class BeamError extends Error {
    constructor(message: string);
}
/**
 * Thrown when a beam configuration is kinematically unstable,
 * under-constrained (fewer than 3 degrees of restraint in 2D),
 * or has redundant parallel/concurrent supports that cannot prevent motion.
 */
export declare class UnstableBeamError extends BeamError {
    constructor(message?: string);
}
/**
 * Thrown when a beam has more constraints than equilibrium equations
 * (statically indeterminate) and cannot be solved with basic static equilibrium.
 */
export declare class IndeterminateBeamError extends BeamError {
    constructor(message?: string);
}
/**
 * Thrown when invalid geometry, length, or boundary locations are supplied.
 */
export declare class InvalidGeometryError extends BeamError {
    constructor(message: string);
}
/**
 * Thrown when the equilibrium matrix cannot be inverted due to singular layout.
 */
export declare class SingularMatrixError extends BeamError {
    constructor(message?: string);
}
