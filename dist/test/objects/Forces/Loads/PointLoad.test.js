"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PointLoad_1 = __importDefault(require("../../../../src/objects/Forces/Loads/PointLoad"));
describe("PointLoad", () => {
    it("should create a PointLoad instance with correct properties", () => {
        const pointLoad = new PointLoad_1.default(100, 5);
        expect(pointLoad.getMagnitude()).toBe(100);
        expect(pointLoad.getDirection()).toBe(-90);
        expect(pointLoad.getX()).toBe(5);
        expect(pointLoad.getY()).toBe(0);
    });
    it("should throw an error when trying to set y value", () => {
        const pointLoad = new PointLoad_1.default(100, 5);
        expect(() => pointLoad.setY(10)).toThrow("Modification of y is not allowed.");
    });
    it("should return correct moment around a point", () => {
        const pointLoad = new PointLoad_1.default(100, 5);
        const moment = pointLoad.getMomentAround(10, 0);
        expect(moment.magnitude).toBe(-500);
        expect(moment.direction).toBe("cw");
    });
    it("should return correct x and y components", () => {
        const pointLoad = new PointLoad_1.default(100, 5);
        expect(pointLoad.getXComponent()).toBe(0);
        expect(pointLoad.getYComponent()).toBe(100);
    });
    it("should update magnitude and direction correctly", () => {
        const pointLoad = new PointLoad_1.default(100, 5);
        pointLoad.setMagnitude(-200);
        expect(pointLoad.getMagnitude()).toBe(200);
        expect(pointLoad.getDirection()).toBe(90);
    });
    it("should return correct moment around a point when only x is provided", () => {
        const pointLoad = new PointLoad_1.default(100, 5);
        const moment = pointLoad.getMomentAround(10);
        expect(moment).toBe(-500);
    });
});
