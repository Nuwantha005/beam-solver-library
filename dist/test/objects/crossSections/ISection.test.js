"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ISection_1 = require("../../../src/objects/crossSections/ISection");
describe("ISection", () => {
    it("should create an ISection with valid dimensions", () => {
        const section = new ISection_1.ISection(10, 20, 2, 1);
        expect(section.width).toBe(10);
        expect(section.height).toBe(20);
        expect(section.flangeThickness).toBe(2);
        expect(section.webThickness).toBe(1);
    });
    it("should throw an error if any dimension is non-positive", () => {
        expect(() => new ISection_1.ISection(-10, 20, 2, 1)).toThrow("Dimensions must be positive numbers.");
        expect(() => new ISection_1.ISection(10, -20, 2, 1)).toThrow("Dimensions must be positive numbers.");
        expect(() => new ISection_1.ISection(10, 20, -2, 1)).toThrow("Dimensions must be positive numbers.");
        expect(() => new ISection_1.ISection(10, 20, 2, -1)).toThrow("Dimensions must be positive numbers.");
    });
    it("should calculate the correct area", () => {
        const section = new ISection_1.ISection(10, 20, 2, 1);
        expect(section.getArea()).toBe(56);
    });
    it("should calculate the correct inertia", () => {
        const section = new ISection_1.ISection(10, 20, 2, 1);
        const expectedInertia = 2 * ((10 * Math.pow(2, 3)) / 12) + (1 * Math.pow(20 - 2 * 2, 3)) / 12;
        expect(section.getInertia()).toBeCloseTo(expectedInertia);
    });
    it("should calculate the correct perimeter", () => {
        const section = new ISection_1.ISection(10, 20, 2, 1);
        expect(section.getPerimeter()).toBe(78);
    });
});
