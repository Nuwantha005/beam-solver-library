"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSection = exports.CrossSectionType = void 0;
var CrossSectionType;
(function (CrossSectionType) {
    CrossSectionType[CrossSectionType["Rectangle"] = 0] = "Rectangle";
    CrossSectionType[CrossSectionType["Circular"] = 1] = "Circular";
    CrossSectionType[CrossSectionType["ISection"] = 2] = "ISection";
    CrossSectionType[CrossSectionType["Custom"] = 3] = "Custom";
    // ...add other types as needed...
})(CrossSectionType || (exports.CrossSectionType = CrossSectionType = {}));
class BaseSection {
    constructor(type) {
        this.type = type;
    }
    get sectionType() {
        return this.type;
    }
}
exports.BaseSection = BaseSection;
