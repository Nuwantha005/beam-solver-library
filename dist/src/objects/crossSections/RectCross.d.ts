import { BaseSection } from "./CrossSection";
export declare class RectangleCrossSection extends BaseSection {
    width: number;
    height: number;
    constructor(width: number, height: number);
    getArea(): number;
    getInertia(): number;
    getPerimeter(): number;
}
export default RectangleCrossSection;
