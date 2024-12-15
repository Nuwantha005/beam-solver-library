export declare enum CrossSectionType {
    Rectangle = 0,
    Cicular = 1,
    IBeam = 2,
    Square = 3
}
export declare class CrossSections {
    type: CrossSectionType;
    constructor(type: CrossSectionType);
    set crossSection(type: CrossSectionType);
    get crossSection(): CrossSectionType;
}
