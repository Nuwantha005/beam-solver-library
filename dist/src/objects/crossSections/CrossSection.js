"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossSections = exports.CrossSectionType = void 0;
var CrossSectionType;
(function (CrossSectionType) {
    CrossSectionType[CrossSectionType["Rectangle"] = 0] = "Rectangle";
    CrossSectionType[CrossSectionType["Circular"] = 1] = "Circular";
    CrossSectionType[CrossSectionType["ISection"] = 2] = "ISection";
    CrossSectionType[CrossSectionType["Square"] = 3] = "Square";
    // ...add other types as needed...
})(CrossSectionType || (exports.CrossSectionType = CrossSectionType = {}));
class CrossSections {
    constructor(type) {
        this.type = type;
    }
}
exports.CrossSections = CrossSections;
