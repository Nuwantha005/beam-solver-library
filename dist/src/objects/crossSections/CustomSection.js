"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSection = void 0;
const CrossSection_1 = require("./CrossSection");
const CrossSection_2 = require("./CrossSection");
class CustomSection extends CrossSection_1.BaseSection {
    constructor(area = 0, perimeter = 0, inertia = 0) {
        super(CrossSection_2.CrossSectionType.Custom);
        this._area = area;
        this._perimeter = perimeter;
        this._inertia = inertia;
    }
    getArea() {
        return this._area;
    }
    getInertia() {
        return this._inertia;
    }
    getPerimeter() {
        return this._perimeter;
    }
    get area() {
        return this._area;
    }
    set area(value) {
        this._area = value;
    }
    get perimeter() {
        return this._perimeter;
    }
    set perimeter(value) {
        this._perimeter = value;
    }
    get inertia() {
        return this._inertia;
    }
    set inertia(value) {
        this._inertia = value;
    }
}
exports.CustomSection = CustomSection;
exports.default = CustomSection;
