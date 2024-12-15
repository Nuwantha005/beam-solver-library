"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSection = void 0;
class CustomSection {
    constructor(area, perimeter, inertia) {
        this._area = area;
        this._perimeter = perimeter;
        this._inertia = inertia;
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
