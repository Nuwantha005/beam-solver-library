"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleForce_1 = __importDefault(require("../../../src/objects/Forces/SimpleForce"));
describe("SimpleForce", () => {
    let simpleForce;
    beforeEach(() => {
        simpleForce = new SimpleForce_1.default(10, "up", 5);
    });
    describe("Getters and Setters", () => {
        test("should get and set magnitude", () => {
            simpleForce.setMagnitude(25);
            expect(simpleForce.getMagnitude()).toBe(25);
        });
        test("should get and set direction", () => {
            simpleForce.setDirection(90);
            expect(simpleForce.getDirection()).toBe(90);
        });
        test("should get and set x", () => {
            simpleForce.setX(8);
            expect(simpleForce.getX()).toBe(8);
        });
        test("should always return y as 0", () => {
            expect(simpleForce.getY()).toBe(0);
        });
        test("should not allow setting y", () => {
            expect(() => simpleForce.setY(10)).toThrow("Modification of y is not allowed.");
        });
    });
    describe("Calculation Methods", () => {
        test("should calculate X component correctly", () => {
            expect(simpleForce.getXComponent()).toBeCloseTo(0);
        });
        test("should calculate Y component correctly", () => {
            expect(simpleForce.getYComponent()).toBeCloseTo(10);
        });
        test("should calculate moment around a point", () => {
            const moment = simpleForce.getMomentAround(1);
            // Expected value calculated manually
            expect(moment).toBeCloseTo(40);
        });
        test("should calculate moment around a point with y coordinate", () => {
            const moment = simpleForce.getMomentAround(1, 2);
            // Expected values calculated manually
            expect(moment.magnitude).toBeCloseTo(40);
            expect(moment.direction).toBe("ccw");
            expect(moment.location).toBe(1);
        });
    });
});
