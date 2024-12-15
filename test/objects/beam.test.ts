import { Beam } from "../../src/objects/beam";

test("addForce should add a force correctly", () => {
  const beam = new Beam(10);
  beam.addForce(5, 100);
  expect(beam.forces).toEqual([{ position: 5, magnitude: 100 }]);
});

test("calculateBendingMoment should calculate correctly", () => {
  const beam = new Beam(10);
  beam.addForce(5, 100);
  expect(beam.calculateBendingMoment()).toEqual([500]);
});
