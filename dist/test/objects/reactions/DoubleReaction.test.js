"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moment_1 = __importDefault(require("../../../src/objects/Forces/Moment"));
const DoubleReaction_1 = __importDefault(require("../../../src/objects/Forces/reactions/DoubleReaction"));
describe("DoubleReaction", () => {
    let doubleReaction;
    beforeEach(() => {
        doubleReaction = new DoubleReaction_1.default(10, 45, 5, 5);
    });
    test("should create an instance of DoubleReaction", () => {
        expect(doubleReaction).toBeInstanceOf(DoubleReaction_1.default);
    });
    test("should throw error when accessing moments getter", () => {
        expect(() => doubleReaction.Moment).toThrow("DoubleReaction does not support moments.");
    });
    test("should throw error when setting moments", () => {
        const testMoment = new Moment_1.default(10, "cw", 0);
        expect(() => {
            doubleReaction.Moment(testMoment);
        }).toThrow("DoubleReaction does not support moments.");
    });
    // Add more tests as needed
    test("should have correct magnitude, direction, x, and y values", () => {
        expect(doubleReaction.getMagnitude()).toBe(10);
        expect(doubleReaction.getDirection()).toBe(45);
        expect(doubleReaction.getX()).toBe(5);
        expect(doubleReaction.getY()).toBe(5);
    });
    // Add tests for any overridden methods if necessary
});
