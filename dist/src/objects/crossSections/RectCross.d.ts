import { CrossSections } from "./CrossSection";
export declare class RectangleCrossSection extends CrossSections {
    width: number;
    height: number;
    constructor(width: number, height: number);
    getArea(): number;
    getInertia(): number;
    getPerimeter(): number;
}
