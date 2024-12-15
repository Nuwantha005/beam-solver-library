"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseReaction_1 = __importDefault(require("../../../src/objects/Forces/reactions/BaseReaction"));
const Moment_1 = __importDefault(require("../../../src/objects/Forces/Moment"));
describe("BaseReaction", () => {
    it("should create an instance of BaseReaction", () => {
        const moment = new Moment_1.default(10, "ccw", 5, 5);
        const baseReaction = new BaseReaction_1.default(100, 45, 10, 10, moment);
        expect(baseReaction).toBeInstanceOf(BaseReaction_1.default);
        expect(baseReaction.getMoment()).toBe(moment);
    });
    it("should set and get moment correctly", () => {
        const moment1 = new Moment_1.default(10, "ccw", 5, 5);
        const moment2 = new Moment_1.default(20, "cw", 15, 15);
        const baseReaction = new BaseReaction_1.default(100, 45, 10, 10, moment1);
        baseReaction.setMoment(moment2);
        expect(baseReaction.getMoment()).toBe(moment2);
    });
    it("should create an instance of BaseReaction with default moment", () => {
        const baseReaction = new BaseReaction_1.default(100, 45, 10, 10);
        expect(baseReaction).toBeInstanceOf(BaseReaction_1.default);
        expect(baseReaction.getMoment()).toBeInstanceOf(Moment_1.default);
        expect(baseReaction.getMoment().magnitude).toBe(0);
        expect(baseReaction.getMoment().direction).toBe("ccw");
    });
});
