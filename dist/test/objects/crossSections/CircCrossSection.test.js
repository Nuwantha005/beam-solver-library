"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CircCrossSection_1 = require("../../../src/objects/crossSections/CircCrossSection");
describe("CircularCrossSection", () => {
    describe("constructor", () => {
        it("should create an instance with a valid radius", () => {
            const radius = 5;
            const crossSection = new CircCrossSection_1.CircularCrossSection(radius);
            expect(crossSection.radius).toBe(radius);
        });
        it("should throw an error if the radius is zero", () => {
            expect(() => new CircCrossSection_1.CircularCrossSection(0)).toThrow("Radius must be a positive number.");
        });
        it("should throw an error if the radius is negative", () => {
            expect(() => new CircCrossSection_1.CircularCrossSection(-1)).toThrow("Radius must be a positive number.");
        });
    });
    describe("getArea", () => {
        it("should return the area of the cross-section", () => {
            const radius = 5;
            const crossSection = new CircCrossSection_1.CircularCrossSection(radius);
            expect(crossSection.getArea()).toBe(Math.PI * radius * radius);
        });
    });
    describe("getInertia", () => {
        it("should return the inertia of the cross-section", () => {
            const radius = 5;
            const crossSection = new CircCrossSection_1.CircularCrossSection(radius);
            expect(crossSection.getInertia()).toBe((Math.PI * Math.pow(radius, 4)) / 4);
        });
    });
});
