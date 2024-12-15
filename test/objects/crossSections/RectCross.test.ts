import { RectangleCrossSection } from "../../../src/objects/crossSections/RectCross";

describe("RectangleCrossSection", () => {
  it("should correctly calculate the area", () => {
    const rect = new RectangleCrossSection(5, 10);
    expect(rect.getArea()).toBe(50);
  });

  it("should correctly calculate the inertia", () => {
    const rect = new RectangleCrossSection(5, 10);
    expect(rect.getInertia()).toBeCloseTo(416.67, 2);
  });

  it("should correctly calculate the perimeter", () => {
    const rect = new RectangleCrossSection(5, 10);
    expect(rect.getPerimeter()).toBe(30);
  });

  it("should correctly set the width and height", () => {
    const rect = new RectangleCrossSection(5, 10);
    expect(rect.width).toBe(5);
    expect(rect.height).toBe(10);
  });

  it("should throw an error if width or height is negative", () => {
    expect(() => new RectangleCrossSection(-5, 10)).toThrow();
    expect(() => new RectangleCrossSection(5, -10)).toThrow();
  });
});
