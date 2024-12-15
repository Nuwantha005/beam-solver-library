import { BaseSection } from "./CrossSection";
export declare class CustomSection extends BaseSection {
    private _area;
    private _perimeter;
    private _inertia;
    constructor(area?: number, perimeter?: number, inertia?: number);
    getArea(): number;
    getInertia(): number;
    getPerimeter(): number;
    get area(): number;
    set area(value: number);
    get perimeter(): number;
    set perimeter(value: number);
    get inertia(): number;
    set inertia(value: number);
}
export default CustomSection;
