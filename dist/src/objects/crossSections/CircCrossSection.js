"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularCrossSection = void 0;
const CrossSection_1 = require("./CrossSection");
class CircularCrossSection extends CrossSection_1.BaseSection {
    constructor(radius) {
        super(CrossSection_1.CrossSectionType.Circular);
        if (radius <= 0) {
            throw new Error("Radius must be a positive number.");
        }
        this.radius = radius;
    }
    getArea() {
        return Math.PI * this.radius * this.radius;
    }
    getInertia() {
        return (Math.PI * Math.pow(this.radius, 4)) / 4;
    }
    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
}
exports.CircularCrossSection = CircularCrossSection;
