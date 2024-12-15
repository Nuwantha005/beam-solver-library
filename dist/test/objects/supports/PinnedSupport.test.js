"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PinnedSupport_1 = __importDefault(require("../../../src/objects/supports/PinnedSupport"));
const DoubleReaction_1 = __importDefault(require("../../../src/objects/Forces/reactions/DoubleReaction"));
const src_1 = require("../../../src");
describe("PinnedSupport", () => {
    it("should create a PinnedSupport with the correct location and reaction", () => {
        const location = 10;
        const pinnedSupport = new PinnedSupport_1.default(location);
        expect(pinnedSupport.Location).toBe(location);
        expect(pinnedSupport.Reaction).toBeInstanceOf(DoubleReaction_1.default);
    });
    it("should set and get the reaction correctly", () => {
        const location = 10;
        const pinnedSupport = new PinnedSupport_1.default(location);
        const newReaction = new DoubleReaction_1.default(1, 2, 3, 4);
        pinnedSupport.Reaction = newReaction;
        expect(pinnedSupport.Reaction).toBe(newReaction);
    });
    it("should have the correct support type", () => {
        const location = 10;
        const pinnedSupport = new PinnedSupport_1.default(location);
        expect(pinnedSupport.SupportType).toBe(src_1.supportType.pinnedSupport);
    });
});
