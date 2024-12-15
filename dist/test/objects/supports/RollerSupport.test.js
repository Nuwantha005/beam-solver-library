"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RollerSupport_1 = __importDefault(require("../../../src/objects/supports/RollerSupport"));
const SimpleReaction_1 = __importDefault(require("../../../src/objects/Forces/reactions/SimpleReaction"));
describe("RollerSupport", () => {
    it("should create a RollerSupport instance with correct location and reaction", () => {
        const location = 10;
        const rollerSupport = new RollerSupport_1.default(location);
        expect(rollerSupport.Location).toBe(location);
        expect(rollerSupport.Reaction).toBeInstanceOf(SimpleReaction_1.default);
        expect(rollerSupport.Reaction.getDirection()).toBe(90);
        expect(rollerSupport.Reaction.getMagnitude()).toBe(0);
    });
    it("should allow setting a new reaction", () => {
        const location = 10;
        const rollerSupport = new RollerSupport_1.default(location);
        const newReaction = new SimpleReaction_1.default(5, "down", 10);
        rollerSupport.Reaction = newReaction;
        expect(rollerSupport.Reaction).toBe(newReaction);
        expect(rollerSupport.Reaction.getDirection()).toBe(-90);
        expect(rollerSupport.Reaction.getMagnitude()).toBe(5);
    });
});
