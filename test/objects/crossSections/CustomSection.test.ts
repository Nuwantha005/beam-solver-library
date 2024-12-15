import { CustomSection } from "../../../src/objects/crossSections/CustomSection";

describe("CustomSection", () => {
  let customSection: CustomSection;

  beforeEach(() => {
    customSection = new CustomSection(10, 20, 30);
  });

  test("should create an instance with given values", () => {
    expect(customSection.area).toBe(10);
    expect(customSection.perimeter).toBe(20);
    expect(customSection.inertia).toBe(30);
  });

  test("should get and set area", () => {
    customSection.area = 15;
    expect(customSection.area).toBe(15);
  });

  test("should get and set perimeter", () => {
    customSection.perimeter = 25;
    expect(customSection.perimeter).toBe(25);
  });

  test("should get and set inertia", () => {
    customSection.inertia = 35;
    expect(customSection.inertia).toBe(35);
  });
});
