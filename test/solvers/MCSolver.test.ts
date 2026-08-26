import { Beam } from "../../src/objects/beam";
import { PinnedSupport } from "../../src/objects/supports/PinnedSupport";
import { RollerSupport } from "../../src/objects/supports/RollerSupport";
import { MCSolver } from "../../src/solvers/MCSolver";
import { SimpleForce } from "../../src";

describe("simple beam with pinned and roller supports -> middle load", () => {
  let beam: Beam;
  beforeAll(() => {
    beam = new Beam(10); // Create a beam of length 10
    const startSupport = new PinnedSupport(0); // Add a pinned support at position 0
    const endSupport = new RollerSupport(beam.Length); // Add a roller support at the end of the beam

    beam.setSupports([startSupport, endSupport]);
    beam.addForce(new SimpleForce(5, "down", 5)); // Add a point load of 5 units at the center of the beam
    const solver = new MCSolver(beam);
    solver.solveReactions();
  });
  it("Start Reaction", () => {
    const startReaction = beam.getSupports()[0].Reaction; // Get the reaction at the start of the beam
    expect(startReaction.getMagnitude()).toBeCloseTo(2.5, 0.01); // Check the reaction magnitude
  });
  it("End Reaction", () => {
    const endReaction = beam.getSupports()[1].Reaction; // Get the reaction at the end of the beam
    expect(endReaction.getMagnitude()).toBeCloseTo(2.5, 0.01); // Check the reaction magnitude
  });
});

describe("simple beam with pinned and roller supports -> deviated load", () => {
  let beam: Beam;
  beforeAll(() => {
    beam = new Beam(17.5); // Create a beam of length 17.5
    const startSupport = new PinnedSupport(0); // Add a pinned support at position 0
    const endSupport = new RollerSupport(beam.Length);

    beam.setSupports([startSupport, endSupport]);
    beam.addForce(new SimpleForce(6.5, "down", 9.9));
    const solver = new MCSolver(beam);
    solver.solveReactions();
  });
  it("Start Reaction", () => {
    const startReaction = beam.getSupports()[0].Reaction; // Get the reaction at the start of the beam
    // R_end = 6.5 * 9.9 / 17.5 = 3.67714
    // R_start = 6.5 - 3.67714 = 2.82286
    expect(startReaction.getMagnitude()).toBeCloseTo(2.8229, 0.0001);
  });
  it("End Reaction", () => {
    const endReaction = beam.getSupports()[1].Reaction; // Get the reaction at the end of the beam
    expect(endReaction.getMagnitude()).toBeCloseTo(3.6771, 0.0001);
  });
});

// describe("simple beam with three pinned supports -> deviated load", () => {
//   let beam: Beam;
//   beforeAll(() => {
//     beam = new Beam(17.8); // Create a beam of length 10
//     const startSupport = new PinnedSupport(0); // Add a pinned support at position 0
//     const middleSupport = new PinnedSupport(8); // Add a pinned support at position 0
//     const endSupport = new PinnedSupport(beam.Length);

//     beam.setSupports([startSupport, middleSupport, endSupport]);
//     beam.addForce(new SimpleForce(6.5, "down", 5)); // Add a point load of 5 units at the center of the beam
//     const solver = new MCSolver(beam);
//     solver.solveReactions();
//   });
//   it("Start Reaction", () => {
//     const startReaction = beam.getSupports()[0].Reaction as DoubleReaction; // Get the reaction at the start of the beam
//     expect(startReaction.getMagnitude()).toBeCloseTo(1.0347, 0.0001); // Check the reaction magnitude
//   });
//   it("Middle Reaction", () => {
//     const middleReaction = beam.getSupports()[1].Reaction as DoubleReaction; // Get the reaction at the end of the beam
//     expect(middleReaction.getMagnitude()).toBeCloseTo(6.4599, 0.0001); // Check the reaction magnitude
//   });
//   it("End Reaction", () => {
//     const endReaction = beam.getSupports()[2].Reaction as DoubleReaction; // Get the reaction at the end of the beam
//     expect(endReaction.getMagnitude()).toBeCloseTo(1.0747, 0.0001); // Check the reaction magnitude
//   });
// });
