"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFroce_1 = __importDefault(require("../BaseFroce"));
const Moment_1 = __importDefault(require("../Moment"));
class BaseReaction extends BaseFroce_1.default {
    constructor(magnitude, direction, x, y, moment = new Moment_1.default(0, "ccw", x, y)) {
        super(magnitude, direction, x, y);
        this.moment = moment;
    }
    setMoment(moment) {
        this.moment = moment;
    }
    getMoment() {
        return this.moment;
    }
}
exports.default = BaseReaction;
