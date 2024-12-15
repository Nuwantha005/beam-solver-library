"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinnedSupport = void 0;
const BaseSupport_1 = require("./BaseSupport");
class PinnedSupport extends BaseSupport_1.BaseSupport {
    constructor(location) {
        super(location, BaseSupport_1.supportType.pinnedSupport);
    }
}
exports.PinnedSupport = PinnedSupport;
exports.default = PinnedSupport;
