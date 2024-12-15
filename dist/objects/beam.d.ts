export declare class Beam {
    length: number;
    forces: {
        position: number;
        magnitude: number;
    }[];
    constructor(length: number);
    addForce(position: number, magnitude: number): void;
    calculateBendingMoment(): number[];
}
