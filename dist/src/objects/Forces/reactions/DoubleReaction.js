"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseReaction_1 = __importDefault(require("./BaseReaction"));
class DoubleReaction extends BaseReaction_1.default {
    constructor(magnitude, direction, x, y) {
        super(magnitude, direction, x, y);
    }
    set Moment(value) {
        throw new Error("DoubleReaction does not support moments.");
    }
    get Moment() {
        throw new Error("DoubleReaction does not support moments.");
    }
}
exports.default = DoubleReaction;
