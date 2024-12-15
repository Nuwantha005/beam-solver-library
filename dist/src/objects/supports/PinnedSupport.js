"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinnedSupport = void 0;
const DoubleReaction_1 = __importDefault(require("../Forces/reactions/DoubleReaction"));
const BaseSupport_1 = require("./BaseSupport");
class PinnedSupport extends BaseSupport_1.BaseSupport {
    constructor(location) {
        super(location, BaseSupport_1.supportType.pinnedSupport);
        this._reaction = new DoubleReaction_1.default(0, 0, 0, 0);
    }
    get Reaction() {
        return this._reaction;
    }
    set Reaction(reaction) {
        this._reaction = reaction;
    }
}
exports.PinnedSupport = PinnedSupport;
exports.default = PinnedSupport;
