import { CrossSections } from "./CrossSection";
export declare class CircularCrossSection extends CrossSections {
    radius: number;
    constructor(radius: number);
    getArea(): number;
    getInertia(): number;
    getPerimeter(): number;
}
