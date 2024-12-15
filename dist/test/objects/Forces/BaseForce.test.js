"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFroce_1 = __importDefault(require("../../../src/objects/Forces/BaseFroce"));
class TestForce extends BaseFroce_1.default {
    constructor(magnitude, direction, x, y) {
        super(magnitude, direction, x, y);
    }
}
describe("BaseForce", () => {
    let force;
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
            expect(moment.x).toBe(3);
            expect(moment.y).toBe(2);
        });
        test("should calculate moment around x-axis", () => {
            const moment = force.getMomentAround(3);
            // Expected value calculated manually
            expect(moment).toBeCloseTo(-21.21);
        });
    });
});
