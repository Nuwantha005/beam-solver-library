import { CrossSections } from "./CrossSection";
export declare class ISection extends CrossSections {
    width: number;
    height: number;
    flangeThickness: number;
    webThickness: number;
    constructor(width: number, height: number, flangeThickness: number, webThickness: number);
    getArea(): number;
    getInertia(): number;
    getPerimeter(): number;
}
