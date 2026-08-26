"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedSupport = void 0;
const Force2D_1 = __importDefault(require("../Forces/Force2D"));
const Moment_1 = __importDefault(require("../Forces/Moment"));
const BaseSupport_1 = require("./BaseSupport");
class FixedSupport extends BaseSupport_1.BaseSupport {
    constructor(location) {
        super(location, BaseSupport_1.supportType.FIXED, new Moment_1.default(0, "cw", location, 0));
        this._reaction = new Force2D_1.default(0, 0, location);
    }
    get Reaction() {
        return this._reaction;
    }
    set Reaction(reaction) {
        this._reaction = reaction;
    }
}
exports.FixedSupport = FixedSupport;
exports.default = FixedSupport;
