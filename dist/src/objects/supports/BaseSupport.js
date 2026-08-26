"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSupport = exports.supportType = void 0;
const Moment_1 = __importDefault(require("../Forces/Moment"));
var supportType;
(function (supportType) {
    supportType[supportType["PINNED"] = 0] = "PINNED";
    supportType[supportType["ROLLER"] = 1] = "ROLLER";
    supportType[supportType["FIXED"] = 2] = "FIXED";
    supportType[supportType["SIMPLE"] = 3] = "SIMPLE";
})(supportType || (exports.supportType = supportType = {}));
class BaseSupport {
    constructor(location, supportType, moment) {
        this._loc = location;
        this._supportType = supportType;
        this._moment = moment !== null && moment !== void 0 ? moment : new Moment_1.default(0, "cw", location, 0);
    }
    get SupportType() {
        return this._supportType;
    }
    get Location() {
        return this._loc;
    }
    set Location(loc) {
        this._loc = loc;
    }
    get Moment() {
        return this._moment;
    }
    set Moment(moment) {
        this._moment = moment;
    }
}
exports.BaseSupport = BaseSupport;
