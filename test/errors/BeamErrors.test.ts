import {
  BeamError,
  UnstableBeamError,
  IndeterminateBeamError,
  InvalidGeometryError,
  SingularMatrixError,
} from "../../src/errors/BeamErrors";

describe("BeamErrors", () => {
  it("should create UnstableBeamError with proper inheritance and default message", () => {
    const error = new UnstableBeamError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(BeamError);
    expect(error).toBeInstanceOf(UnstableBeamError);
    expect(error.name).toBe("UnstableBeamError");
    expect(error.message).toContain("unstable");
  });

  it("should create IndeterminateBeamError with custom message", () => {
    const error = new IndeterminateBeamError("Custom indeterminate message");
    expect(error).toBeInstanceOf(BeamError);
    expect(error.name).toBe("IndeterminateBeamError");
    expect(error.message).toBe("Custom indeterminate message");
  });

  it("should create InvalidGeometryError", () => {
    const error = new InvalidGeometryError("Length cannot be negative");
    expect(error).toBeInstanceOf(BeamError);
    expect(error.name).toBe("InvalidGeometryError");
    expect(error.message).toBe("Length cannot be negative");
  });

  it("should create SingularMatrixError", () => {
    const error = new SingularMatrixError();
    expect(error).toBeInstanceOf(BeamError);
    expect(error.name).toBe("SingularMatrixError");
  });
});
