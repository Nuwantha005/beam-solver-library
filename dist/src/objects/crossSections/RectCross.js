"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectangleCrossSection = void 0;
const CrossSection_1 = require("./CrossSection");
class RectangleCrossSection extends CrossSection_1.BaseSection {
    constructor(width, height) {
        super(CrossSection_1.CrossSectionType.Rectangle);
        if (width <= 0 || height <= 0) {
            throw new Error("Width and height must be positive numbers.");
        }
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
    getInertia() {
        return (this.width * Math.pow(this.height, 3)) / 12;
    }
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
}
exports.RectangleCrossSection = RectangleCrossSection;
exports.default = RectangleCrossSection;
