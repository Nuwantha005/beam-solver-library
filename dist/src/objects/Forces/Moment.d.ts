declare class Moment {
    private _magnitude;
    private _direction;
    private _location;
    constructor(magnitude: number, direction: "cw" | "ccw", location: number);
    get magnitude(): number;
    set magnitude(value: number);
    get direction(): "cw" | "ccw";
    set direction(value: "cw" | "ccw");
    get location(): number;
    set location(value: number);
}
export default Moment;
