"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moment_1 = __importDefault(require("../../../src/objects/Forces/Moment"));
describe("BaseMoment", () => {
    it("should create an instance with given parameters", () => {
        const moment = new Moment_1.default(10, "cw", 5);
        expect(moment.magnitude).toBe(10);
        expect(moment.direction).toBe("cw");
        expect(moment.location).toBe(5);
    });
    it("should set and get magnitude correctly", () => {
        const moment = new Moment_1.default(10, "cw", 5);
        moment.magnitude = 20;
        expect(moment.magnitude).toBe(20);
    });
    it("should set and get direction correctly", () => {
        const moment = new Moment_1.default(10, "cw", 5);
        moment.direction = "ccw";
        expect(moment.direction).toBe("ccw");
    });
    it("should set and get location correctly", () => {
        const moment = new Moment_1.default(10, "cw", 5);
        moment.location = 15;
        expect(moment.location).toBe(15);
    });
});
