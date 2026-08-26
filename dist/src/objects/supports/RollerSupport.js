"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollerSupport = void 0;
const SimpleForce_1 = __importDefault(require("../Forces/SimpleForce"));
const BaseSupport_1 = require("./BaseSupport");
const Moment_1 = __importDefault(require("../Forces/Moment"));
class RollerSupport extends BaseSupport_1.BaseSupport {
    constructor(location) {
        super(location, BaseSupport_1.supportType.ROLLER, new Moment_1.default(0, "cw", location, 0));
        this._reaction = new SimpleForce_1.default(0, "up", location);
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
