"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moment_1 = __importDefault(require("../Moment"));
const DistributedLoad_1 = __importDefault(require("./DistributedLoad"));
const PointLoad_1 = __importDefault(require("./PointLoad"));
class TaperzoidLoad extends DistributedLoad_1.default {
    constructor(startLocation, endLocation, startLoad, endLoad) {
        super(startLocation, endLocation);
        this.startLoad = startLoad;
        this.endLoad = endLoad;
    }
    getEquivalentPointLoad() {
        const length = this.endLocation - this.startLocation;
        const loadPoint = this.getCentroidLoc(this.startLocation, this.endLocation, this.startLoad, this.endLoad);
        const totalLoad = 0.5 * (this.startLoad + this.endLoad) * length;
        if (totalLoad > 0) {
            return new PointLoad_1.default(totalLoad, loadPoint);
        }
        else {
            return new PointLoad_1.default(totalLoad, loadPoint);
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
            const loadAtX = this.startLoad +
                (x - this.startLocation) *
                    ((this.endLoad - this.startLoad) /
                        (this.endLocation - this.startLocation));
            const backLoadVal = 0.5 * (this.startLoad + loadAtX) * backLenth;
            const backLoadLoc = this.getCentroidLoc(this.startLocation, x, this.startLoad, loadAtX);
            const eqLoad = new PointLoad_1.default(backLoadVal, backLoadLoc);
            return eqLoad.getMomentAround(x, 0);
        }
    }
    getCentroidLoc(a, b, w1, w2) {
        const l = b - a;
        const btmMag = l * w1;
        const topMag = 0.5 * (w2 - w1) * l;
        const totMag = btmMag + topMag;
        const btmLoc = a + l / 2;
        const topLoc = a + (l * 2) / 3;
        const loc = (topMag * topLoc + btmMag * btmLoc) / totMag;
        return loc;
    }
}
exports.default = TaperzoidLoad;
