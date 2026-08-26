"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BeamErrors_1 = require("../../src/errors/BeamErrors");
describe("BeamErrors", () => {
    it("should create UnstableBeamError with proper inheritance and default message", () => {
        const error = new BeamErrors_1.UnstableBeamError();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(BeamErrors_1.BeamError);
        expect(error).toBeInstanceOf(BeamErrors_1.UnstableBeamError);
        expect(error.name).toBe("UnstableBeamError");
        expect(error.message).toContain("unstable");
    });
    it("should create IndeterminateBeamError with custom message", () => {
        const error = new BeamErrors_1.IndeterminateBeamError("Custom indeterminate message");
        expect(error).toBeInstanceOf(BeamErrors_1.BeamError);
        expect(error.name).toBe("IndeterminateBeamError");
        expect(error.message).toBe("Custom indeterminate message");
    });
    it("should create InvalidGeometryError", () => {
        const error = new BeamErrors_1.InvalidGeometryError("Length cannot be negative");
        expect(error).toBeInstanceOf(BeamErrors_1.BeamError);
        expect(error.name).toBe("InvalidGeometryError");
        expect(error.message).toBe("Length cannot be negative");
    });
    it("should create SingularMatrixError", () => {
        const error = new BeamErrors_1.SingularMatrixError();
        expect(error).toBeInstanceOf(BeamErrors_1.BeamError);
        expect(error.name).toBe("SingularMatrixError");
    });
});
