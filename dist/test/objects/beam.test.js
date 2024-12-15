"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beam_1 = require("../../src/objects/beam");
test("Length getter should return the correct value", () => {
    const beam = new beam_1.Beam(10);
    expect(beam.Length).toBe(10);
});
test("Length setter should update the length", () => {
    const beam = new beam_1.Beam(10);
    beam.Length = 15;
    expect(beam.Length).toBe(15);
});
test("Setting negative length should throw an error", () => {
    const beam = new beam_1.Beam(10);
    expect(() => {
        beam.Length = -5;
    }).toThrow("Length must be positive.");
});
