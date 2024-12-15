"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beam_1 = require("../../src/objects/beam");
const PinnedSupport_1 = require("../../src/objects/supports/PinnedSupport");
const MCSolver_1 = require("../../src/solvers/MCSolver");
const src_1 = require("../../src");
describe("simple beam with two pinned supports -> middle load", () => {
    let beam;
    beforeAll(() => {
        beam = new beam_1.Beam(10); // Create a beam of length 10
        const startSupport = new PinnedSupport_1.PinnedSupport(0); // Add a pinned support at position 0
        const endSupport = new PinnedSupport_1.PinnedSupport(beam.Length); // Add a pinned support at the end of the beam
        beam.setSupports([startSupport, endSupport]);
        beam.addForce(new src_1.SimpleForce(5, "down", 5)); // Add a point load of 5 units at the center of the beam
        const solver = new MCSolver_1.MCSolver(beam);
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
describe("simple beam with two pinned supports -> deviated load", () => {
    let beam;
    beforeAll(() => {
        beam = new beam_1.Beam(17.5); // Create a beam of length 10
        const startSupport = new PinnedSupport_1.PinnedSupport(0); // Add a pinned support at position 0
        const endSupport = new PinnedSupport_1.PinnedSupport(beam.Length);
        beam.setSupports([startSupport, endSupport]);
        beam.addForce(new src_1.SimpleForce(6.5, "down", 9.9)); // Add a point load of 5 units at the center of the beam
        const solver = new MCSolver_1.MCSolver(beam);
        solver.solveReactions();
    });
    it("Start Reaction", () => {
        const startReaction = beam.getSupports()[0].Reaction; // Get the reaction at the start of the beam
        expect(startReaction.getMagnitude()).toBeCloseTo(2.8848, 0.0001); // Check the reaction magnitude
    });
    it("End Reaction", () => {
        const endReaction = beam.getSupports()[1].Reaction; // Get the reaction at the end of the beam
        expect(endReaction.getMagnitude()).toBeCloseTo(3.6152, 0.0001); // Check the reaction magnitude
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
