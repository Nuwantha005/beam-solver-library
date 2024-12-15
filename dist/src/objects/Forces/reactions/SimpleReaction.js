"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseReaction_1 = __importDefault(require("./BaseReaction"));
class SimpleReaction extends BaseReaction_1.default {
    constructor(magnitude, direction, x) {
        const angle = direction === "up" ? 90 : -90;
        super(magnitude, angle, x, 0);
    }
    // Override setMoment to prevent setting a moment
    setMoment() {
        throw new Error("SimpleReaction does not support moments.");
    }
    // Override getMoment to prevent getting a moment
    getMoment() {
        throw new Error("SimpleReaction does not support moments.");
    }
}
exports.default = SimpleReaction;
