import BaseForce from "../../../src/objects/Forces/BaseFroce";

class TestForce extends BaseForce {
  constructor(magnitude: number, direction: number, x: number, y: number) {
    super(magnitude, direction, x, y);
  }
}

describe("BaseForce", () => {
  let force: TestForce;

  beforeEach(() => {
    force = new TestForce(10, Math.PI / 4, 5, 5);
  });

  describe("Getters and Setters", () => {
    test("should get and set magnitude", () => {
      force.setMagnitude(20);
      expect(force.getMagnitude()).toBe(20);
    });

    test("should get and set direction", () => {
      force.setDirection(Math.PI / 2);
      expect(force.getDirection()).toBe(Math.PI / 2);
    });

    test("should get and set x", () => {
      force.setX(10);
      expect(force.getX()).toBe(10);
    });

    test("should get and set y", () => {
      force.setY(15);
      expect(force.getY()).toBe(15);
    });
  });

  describe("Calculation Methods", () => {
    test("should calculate X component correctly", () => {
      expect(force.getXComponent()).toBeCloseTo(10 * Math.cos(Math.PI / 4));
    });

    test("should calculate Y component correctly", () => {
      expect(force.getYComponent()).toBeCloseTo(10 * Math.sin(Math.PI / 4));
    });

    test("should calculate moment around a point", () => {
      const moment = force.getMomentAround(3, 2);
      // Expected value calculated manually
      expect(moment.magnitude).toBeCloseTo(-7.07);
      expect(moment.direction).toBe("cw");
      expect(moment.location).toBe(3);
    });

    test("should calculate moment around x-axis", () => {
      const moment = force.getMomentAround(3) as number;
      // Expected value calculated manually
      expect(moment).toBeCloseTo(-21.21);
    });
  });
});
