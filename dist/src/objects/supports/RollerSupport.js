"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollerSupport = void 0;
const SimpleReaction_1 = __importDefault(require("../Forces/reactions/SimpleReaction"));
const BaseSupport_1 = require("./BaseSupport");
class RollerSupport extends BaseSupport_1.BaseSupport {
    constructor(location) {
        super(location, BaseSupport_1.supportType.rollerSupport);
        this._reaction = new SimpleReaction_1.default(0, "up", 0);
    }
    get Reaction() {
        return this._reaction;
    }
    set Reaction(reaction) {
        this._reaction = reaction;
    }
}
exports.RollerSupport = RollerSupport;
exports.default = RollerSupport;
