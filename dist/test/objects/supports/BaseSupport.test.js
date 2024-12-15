"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseReaction_1 = __importDefault(require("../../../src/objects/Forces/reactions/BaseReaction"));
const BaseSupport_1 = require("../../../src/objects/supports/BaseSupport");
class TestReaction extends BaseReaction_1.default {
}
class TestSupport extends BaseSupport_1.BaseSupport {
    get Reaction() {
        return this.reaction;
    }
    set Reaction(reaction) {
        this.reaction = reaction;
    }
    constructor(location, supportType) {
        super(location, supportType);
        this.reaction = new TestReaction(0, 0, 0, 0); // Initialize with a default TestReaction
    }
}
describe("BaseSupport", () => {
    it("should create an instance of BaseSupport", () => {
        const support = new TestSupport(10, BaseSupport_1.supportType.pinnedSupport);
        expect(support).toBeInstanceOf(BaseSupport_1.BaseSupport);
    });
    it("should get the correct location", () => {
        const support = new TestSupport(10, BaseSupport_1.supportType.rollerSupport);
        expect(support.Location).toBe(10);
    });
    it("should set the correct location", () => {
        const support = new TestSupport(10, BaseSupport_1.supportType.fixedSupport);
        support.Location = 20;
        expect(support.Location).toBe(20);
    });
    it("should get the correct support type", () => {
        const support = new TestSupport(10, BaseSupport_1.supportType.simpleSupport);
        expect(support.SupportType).toBe(BaseSupport_1.supportType.simpleSupport);
    });
});
