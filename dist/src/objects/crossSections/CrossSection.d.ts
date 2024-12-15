export declare enum CrossSectionType {
    Rectangle = 0,
    Circular = 1,
    ISection = 2,
    Square = 3
}
export declare abstract class CrossSections {
    type: CrossSectionType;
    constructor(type: CrossSectionType);
    abstract getArea(): number;
    abstract getInertia(): number;
    abstract getPerimeter(): number;
}
