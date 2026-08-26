import MomentLoad from "../../../../src/objects/Forces/Loads/MomentLoad";
import { LoadType } from "../../../../src/objects/Forces/Loads/ILoad";

describe("MomentLoad", () => {
  let momentLoad: MomentLoad;

  beforeEach(() => {
    momentLoad = new MomentLoad(30, "ccw", 4);
  });

  it("should have correct loadType and location", () => {
    expect(momentLoad.loadType).toBe(LoadType.MOMENT);
    expect(momentLoad.startLocation).toBe(4);
    expect(momentLoad.endLocation).toBe(4);
    expect(momentLoad.location).toBe(4);
    expect(momentLoad.magnitude).toBe(30);
    expect(momentLoad.direction).toBe("ccw");
  });

  it("should have zero resultant forces", () => {
    expect(momentLoad.getTotalHorizontalForce()).toBe(0);
    expect(momentLoad.getTotalVerticalForce()).toBe(0);
  });

  it("should compute signed magnitude correctly", () => {
    expect(momentLoad.getSignedMagnitude()).toBe(30);
    momentLoad.direction = "cw";
    expect(momentLoad.getSignedMagnitude()).toBe(-30);
  });

  it("should return invariant moment about any coordinate", () => {
    const m1 = momentLoad.getMomentAround(0);
    expect(m1.magnitude).toBe(30);
    expect(m1.direction).toBe("ccw");

    const m2 = momentLoad.getMomentAround(10, 5);
    expect(m2.magnitude).toBe(30);
    expect(m2.direction).toBe("ccw");
  });

  it("should allow mutating magnitude and location", () => {
    momentLoad.magnitude = 50;
    momentLoad.location = 7;
    expect(momentLoad.magnitude).toBe(50);
    expect(momentLoad.location).toBe(7);
    expect(momentLoad.startLocation).toBe(7);
  });
});
