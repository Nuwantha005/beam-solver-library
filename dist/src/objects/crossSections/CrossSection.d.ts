export declare enum CrossSectionType {
    Rectangle = 0,
    Circular = 1,
    ISection = 2,
    Custom = 3
}
export declare abstract class BaseSection {
    type: CrossSectionType;
    constructor(type: CrossSectionType);
    get sectionType(): CrossSectionType;
    abstract getArea(): number;
    abstract getInertia(): number;
    abstract getPerimeter(): number;
}
