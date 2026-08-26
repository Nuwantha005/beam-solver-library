"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DistributedLoad_1 = __importDefault(require("./DistributedLoad"));
const PointLoad_1 = __importDefault(require("./PointLoad"));
const Moment_1 = __importDefault(require("../Moment"));
class UniformlyDistributedLoad extends DistributedLoad_1.default {
    constructor(startLocation, endLocation, loadVal) {
        super(startLocation, endLocation);
        this.loadVal = loadVal;
        this._loadVal = loadVal;
    }
    getEquivalentPointLoad() {
        const length = this.endLocation - this.startLocation;
        const middlePoint = this.startLocation + length / 2;
        const totalLoad = this._loadVal * length;
        if (totalLoad > 0) {
            return new PointLoad_1.default(totalLoad, middlePoint);
        }
        else {
            return new PointLoad_1.default(totalLoad, middlePoint);
        }
    }
    getMomentAround(x) {
        if (x < this.startLocation) {
            return new Moment_1.default();
        }
        else if (this.endLocation < x) {
            return this.getEquivalentPointLoad().getMomentAround(x, 0);
        }
        else {
            const backLenth = x - this.startLocation;
            const backLoadVal = backLenth * this.loadVal;
            const backLoadLoc = this.startLocation + backLenth / 2;
            const backLoad = new PointLoad_1.default(backLoadVal, backLoadLoc);
            return backLoad.getMomentAround(x, 0);
        }
    }
}
exports.default = UniformlyDistributedLoad;
