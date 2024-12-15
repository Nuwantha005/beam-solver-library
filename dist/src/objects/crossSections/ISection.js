"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISection = void 0;
const CrossSection_1 = require("./CrossSection");
class ISection extends CrossSection_1.BaseSection {
    constructor(width, height, flangeThickness, webThickness) {
        super(CrossSection_1.CrossSectionType.ISection);
        if (width <= 0 ||
            height <= 0 ||
            flangeThickness <= 0 ||
            webThickness <= 0) {
            throw new Error("Dimensions must be positive numbers.");
        }
        this.width = width;
        this.height = height;
        this.flangeThickness = flangeThickness;
        this.webThickness = webThickness;
    }
    getArea() {
        return (2 * this.flangeThickness * this.width +
            (this.height - 2 * this.flangeThickness) * this.webThickness);
    }
    getInertia() {
        const flangeInertia = (this.width * Math.pow(this.flangeThickness, 3)) / 12;
        const webInertia = (this.webThickness *
            Math.pow(this.height - 2 * this.flangeThickness, 3)) /
            12;
        return 2 * flangeInertia + webInertia;
    }
    getPerimeter() {
        return (2 * (this.width + this.height) + 2 * (this.width - this.webThickness));
    }
}
exports.ISection = ISection;
exports.default = ISection;
