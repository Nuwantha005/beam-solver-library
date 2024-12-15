"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleReaction_1 = __importDefault(require("../../../src/objects/Forces/reactions/SimpleReaction"));
describe("SimpleReaction", () => {
    it("should create a SimpleReaction with upward direction", () => {
        const reaction = new SimpleReaction_1.default(10, "up", 5);
        expect(reaction.getMagnitude()).toBe(10);
        expect(reaction.getDirection()).toBe(90);
        expect(reaction.getX()).toBe(5);
    });
    it("should create a SimpleReaction with downward direction", () => {
        const reaction = new SimpleReaction_1.default(15, "down", 10);
        expect(reaction.getMagnitude()).toBe(15);
        expect(reaction.getDirection()).toBe(-90);
        expect(reaction.getX()).toBe(10);
    });
    it("should throw an error when setMoment is called", () => {
        const reaction = new SimpleReaction_1.default(10, "up", 5);
        expect(() => reaction.setMoment()).toThrow("SimpleReaction does not support moments.");
    });
    it("should throw an error when getMoment is called", () => {
        const reaction = new SimpleReaction_1.default(10, "up", 5);
        expect(() => reaction.getMoment()).toThrow("SimpleReaction does not support moments.");
    });
});
