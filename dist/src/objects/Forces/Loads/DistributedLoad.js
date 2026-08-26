"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributedLoad = void 0;
const ILoad_1 = require("./ILoad");
class DistributedLoad {
    constructor(startLocation, endLocation) {
        this.startLocation = startLocation;
        this.endLocation = endLocation;
    }
    get loadType() {
        return ILoad_1.LoadType.DISTRIBUTED;
    }
    get start() {
        return this.startLocation;
    }
    set start(value) {
        this.startLocation = value;
    }
    get end() {
        return this.endLocation;
    }
    set end(value) {
        this.endLocation = value;
    }
    getTotalHorizontalForce() {
        return 0;
    }
    getTotalVerticalForce() {
        return this.getEquivalentPointLoad().getTotalVerticalForce();
    }
}
exports.DistributedLoad = DistributedLoad;
exports.default = DistributedLoad;
