import { BaseSection } from "./CrossSection";
export declare class CircularCrossSection extends BaseSection {
    radius: number;
    constructor(radius: number);
    getArea(): number;
    getInertia(): number;
    getPerimeter(): number;
}
export default CircularCrossSection;
