"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FixedSupport_1 = require("../../../src/objects/supports/FixedSupport");
const BaseSupport_1 = require("../../../src/objects/supports/BaseSupport");
const Force2D_1 = __importDefault(require("../../../src/objects/Forces/Force2D"));
const Moment_1 = __importDefault(require("../../../src/objects/Forces/Moment"));
describe("FixedSupport", () => {
    let fixedSupport;
    beforeEach(() => {
        fixedSupport = new FixedSupport_1.FixedSupport(0);
    });
    it("should have correct supportType", () => {
        expect(fixedSupport.SupportType).toBe(BaseSupport_1.supportType.FIXED);
    });
    it("should initialize with default reaction at location", () => {
        expect(fixedSupport.Location).toBe(0);
        expect(fixedSupport.Reaction.getMagnitude()).toBe(0);
        expect(fixedSupport.Reaction.getX()).toBe(0);
        expect(fixedSupport.Moment.magnitude).toBe(0);
    });
    it("should allow setting location", () => {
        fixedSupport.Location = 5;
        expect(fixedSupport.Location).toBe(5);
    });
    it("should allow setting and getting reaction force", () => {
        const newReaction = new Force2D_1.default(50, 90, 0);
        fixedSupport.Reaction = newReaction;
        expect(fixedSupport.Reaction).toBe(newReaction);
        expect(fixedSupport.Reaction.getMagnitude()).toBe(50);
    });
    it("should allow setting and getting reaction moment", () => {
        const newMoment = new Moment_1.default(120, "ccw", 0, 0);
        fixedSupport.Moment = newMoment;
        expect(fixedSupport.Moment).toBe(newMoment);
        expect(fixedSupport.Moment.magnitude).toBe(120);
        expect(fixedSupport.Moment.direction).toBe("ccw");
    });
});
