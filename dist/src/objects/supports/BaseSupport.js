"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSupport = exports.supportType = void 0;
var supportType;
(function (supportType) {
    supportType[supportType["pinnedSupport"] = 0] = "pinnedSupport";
    supportType[supportType["rollerSupport"] = 1] = "rollerSupport";
    supportType[supportType["fixedSupport"] = 2] = "fixedSupport";
    supportType[supportType["simpleSupport"] = 3] = "simpleSupport";
})(supportType || (exports.supportType = supportType = {}));
class BaseSupport {
    constructor(location, supportType) {
        this._loc = location;
        this._supportType = supportType;
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
}
exports.BaseSupport = BaseSupport;
