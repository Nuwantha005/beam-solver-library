import { Beam } from "../../src/objects/beam";

test("Length getter should return the correct value", () => {
  const beam = new Beam(10);
  expect(beam.Length).toBe(10);
});

test("Length setter should update the length", () => {
  const beam = new Beam(10);
  beam.Length = 15;
  expect(beam.Length).toBe(15);
});

test("Setting negative length should throw an error", () => {
  const beam = new Beam(10);
  expect(() => {
    beam.Length = -5;
  }).toThrow("Length must be positive.");
});
