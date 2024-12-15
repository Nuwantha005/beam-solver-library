declare class Moment {
    private _magnitude;
    private _direction;
    private _x;
    private _y;
    constructor(magnitude?: number, direction?: "cw" | "ccw", x?: number, y?: number);
    get magnitude(): number;
    set magnitude(value: number);
    get direction(): "cw" | "ccw";
    set direction(value: "cw" | "ccw");
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
}
export default Moment;
