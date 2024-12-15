"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossSections = exports.CrossSectionType = void 0;
var CrossSectionType;
(function (CrossSectionType) {
    CrossSectionType[CrossSectionType["Rectangle"] = 0] = "Rectangle";
    CrossSectionType[CrossSectionType["Cicular"] = 1] = "Cicular";
    CrossSectionType[CrossSectionType["IBeam"] = 2] = "IBeam";
    CrossSectionType[CrossSectionType["Square"] = 3] = "Square";
    // ...add other types as needed...
})(CrossSectionType || (exports.CrossSectionType = CrossSectionType = {}));
class CrossSections {
    constructor(type) {
        this.type = type;
    }
    set crossSection(type) {
        this.type = type;
    }
    get crossSection() {
        return this.type;
    }
}
exports.CrossSections = CrossSections;
