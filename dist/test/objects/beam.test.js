"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beam_1 = require("../../src/objects/beam");
test("addForce should add a force correctly", () => {
    const beam = new beam_1.Beam(10);
    beam.addForce(5, 100);
    expect(beam.forces).toEqual([{ position: 5, magnitude: 100 }]);
});
test("calculateBendingMoment should calculate correctly", () => {
    const beam = new beam_1.Beam(10);
    beam.addForce(5, 100);
    expect(beam.calculateBendingMoment()).toEqual([500]);
});
