"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const beam_1 = require("../../src/objects/beam");
const PinnedSupport_1 = require("../../src/objects/supports/PinnedSupport");
const RollerSupport_1 = require("../../src/objects/supports/RollerSupport");
const FixedSupport_1 = require("../../src/objects/supports/FixedSupport");
const PointLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/PointLoad"));
const Force2D_1 = __importDefault(require("../../src/objects/Forces/Force2D"));
const UniformlyDistributedLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/UniformlyDistributedLoad"));
const TaperzoidLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/TaperzoidLoad"));
const MomentLoad_1 = __importDefault(require("../../src/objects/Forces/Loads/MomentLoad"));
const ReactionSolver_1 = __importDefault(require("../../src/solvers/ReactionSolver"));
const BeamErrors_1 = require("../../src/errors/BeamErrors");
describe("ReactionSolver — Simply Supported Beams", () => {
    it("should solve symmetric midspan point load (L=10, P=20 at x=5)", () => {
        const beam = new beam_1.Beam(10);
        const pin = new PinnedSupport_1.PinnedSupport(0);
        const roller = new RollerSupport_1.RollerSupport(10);
        beam.setSupports([pin, roller]);
        beam.addLoad(new PointLoad_1.default(20, 5));
        ReactionSolver_1.default.solve(beam);
        expect(pin.Reaction.getMagnitude()).toBeCloseTo(10);
        expect(roller.Reaction.getMagnitude()).toBeCloseTo(10);
        expect(roller.Reaction.getDirection()).toBe(90);
    });
    it("should solve asymmetric point load (L=10, P=30 at x=2)", () => {
        const beam = new beam_1.Beam(10);
        const pin = new PinnedSupport_1.PinnedSupport(0);
        const roller = new RollerSupport_1.RollerSupport(10);
        beam.setSupports([pin, roller]);
        beam.addLoad(new PointLoad_1.default(30, 2));
        ReactionSolver_1.default.solve(beam);
        // R_roller = 30 * 2 / 10 = 6 kN
        // R_pin = 30 - 6 = 24 kN
        expect(pin.Reaction.getMagnitude()).toBeCloseTo(24);
        expect(roller.Reaction.getMagnitude()).toBeCloseTo(6);
    });
    it("should solve full UDL (L=8, w=4 kN/m)", () => {
        const beam = new beam_1.Beam(8);
        const pin = new PinnedSupport_1.PinnedSupport(0);
        const roller = new RollerSupport_1.RollerSupport(8);
        beam.setSupports([pin, roller]);
        beam.addLoad(new UniformlyDistributedLoad_1.default(0, 8, 4));
        ReactionSolver_1.default.solve(beam);
        // Total load = 32 kN => R1 = R2 = 16 kN
        expect(pin.Reaction.getMagnitude()).toBeCloseTo(16);
        expect(roller.Reaction.getMagnitude()).toBeCloseTo(16);
    });
    it("should solve triangular/trapezoidal load (L=6, w=0 to 6 kN/m)", () => {
        const beam = new beam_1.Beam(6);
        const pin = new PinnedSupport_1.PinnedSupport(0);
        const roller = new RollerSupport_1.RollerSupport(6);
        beam.setSupports([pin, roller]);
        beam.addLoad(new TaperzoidLoad_1.default(0, 6, 0, 6));
        ReactionSolver_1.default.solve(beam);
        // Total load = 18 kN at centroid x = 4 m
        // R_roller = 18 * 4 / 6 = 12 kN
        // R_pin = 18 - 12 = 6 kN
        expect(pin.Reaction.getMagnitude()).toBeCloseTo(6);
        expect(roller.Reaction.getMagnitude()).toBeCloseTo(12);
    });
    it("should solve angled 2D point load with horizontal reaction", () => {
        const beam = new beam_1.Beam(10);
        const pin = new PinnedSupport_1.PinnedSupport(0);
        const roller = new RollerSupport_1.RollerSupport(10);
        beam.setSupports([pin, roller]);
        // Force with Fx = 10 kN (pointing right), Fy = -20 kN (pointing down)
        // Angle in radians: atan2(-20, 10)
        const angle = Math.atan2(-20, 10);
        const mag = Math.sqrt(10 * 10 + 20 * 20);
        beam.addLoad(new Force2D_1.default(mag, angle, 5));
        ReactionSolver_1.default.solve(beam);
        // Horizontal equilibrium: Rx_pin = -10 kN
        // Vertical equilibrium: Ry_pin = 10 kN, Ry_roller = 10 kN
        expect(pin.Reaction.getXComponent()).toBeCloseTo(-10);
        expect(pin.Reaction.getYComponent()).toBeCloseTo(10);
        expect(roller.Reaction.getMagnitude()).toBeCloseTo(10);
    });
});
describe("ReactionSolver — Cantilever Beams", () => {
    it("should solve cantilever fixed at x=0 with tip point load (L=5, P=12 at x=5)", () => {
        const beam = new beam_1.Beam(5);
        const fixed = new FixedSupport_1.FixedSupport(0);
        beam.setSupports([fixed]);
        beam.addLoad(new PointLoad_1.default(12, 5));
        ReactionSolver_1.default.solve(beam);
        // Reaction force = 12 kN upward
        expect(fixed.Reaction.getYComponent()).toBeCloseTo(12);
        expect(fixed.Reaction.getXComponent()).toBeCloseTo(0);
        // Reaction moment = 12 * 5 = 60 kNm (ccw)
        expect(fixed.Moment.magnitude).toBeCloseTo(60);
        expect(fixed.Moment.direction).toBe("ccw");
    });
    it("should solve cantilever fixed at x=0 with full UDL (L=4, w=3 kN/m)", () => {
        const beam = new beam_1.Beam(4);
        const fixed = new FixedSupport_1.FixedSupport(0);
        beam.setSupports([fixed]);
        beam.addLoad(new UniformlyDistributedLoad_1.default(0, 4, 3));
        ReactionSolver_1.default.solve(beam);
        // Total load = 12 kN at x = 2
        // Reaction force = 12 kN upward
        expect(fixed.Reaction.getYComponent()).toBeCloseTo(12);
        // Reaction moment = 12 * 2 = 24 kNm (ccw)
        expect(fixed.Moment.magnitude).toBeCloseTo(24);
        expect(fixed.Moment.direction).toBe("ccw");
    });
    it("should solve cantilever fixed at right end x=L (L=6, P=10 at x=0)", () => {
        const beam = new beam_1.Beam(6);
        const fixed = new FixedSupport_1.FixedSupport(6);
        beam.setSupports([fixed]);
        beam.addLoad(new PointLoad_1.default(10, 0));
        ReactionSolver_1.default.solve(beam);
        // Reaction force = 10 kN upward
        expect(fixed.Reaction.getYComponent()).toBeCloseTo(10);
        // Reaction moment about wall at x=6: downward force at x=0 produces CCW moment about x=6,
        // so wall reaction must be clockwise: 10 * 6 = 60 kNm (cw)
        expect(fixed.Moment.magnitude).toBeCloseTo(60);
        expect(fixed.Moment.direction).toBe("cw");
    });
});
describe("ReactionSolver — Overhanging Beams & Applied Moments", () => {
    it("should solve overhanging beam with symmetric overhangs", () => {
        const beam = new beam_1.Beam(10);
        const pin = new PinnedSupport_1.PinnedSupport(2);
        const roller = new RollerSupport_1.RollerSupport(8);
        beam.setSupports([pin, roller]);
        // Point load at left overhang tip x=0, and right overhang tip x=10
        beam.addLoad(new PointLoad_1.default(10, 0));
        beam.addLoad(new PointLoad_1.default(10, 10));
        ReactionSolver_1.default.solve(beam);
        // Symmetric loading: R1 = R2 = 10 kN
        expect(pin.Reaction.getMagnitude()).toBeCloseTo(10);
        expect(roller.Reaction.getMagnitude()).toBeCloseTo(10);
    });
    it("should solve simply supported beam with concentrated couple/moment", () => {
        const beam = new beam_1.Beam(10);
        const pin = new PinnedSupport_1.PinnedSupport(0);
        const roller = new RollerSupport_1.RollerSupport(10);
        beam.setSupports([pin, roller]);
        // Applied CCW moment of 50 kNm at x=5
        beam.addLoad(new MomentLoad_1.default(50, "ccw", 5));
        ReactionSolver_1.default.solve(beam);
        // ΣMo = 0 => 50 + 10 * Ry_roller = 0 => Ry_roller = -5 kN (downward)
        // ΣFy = 0 => Ry_pin = +5 kN (upward)
        expect(pin.Reaction.getYComponent()).toBeCloseTo(5);
        expect(roller.Reaction.getMagnitude()).toBeCloseTo(5);
        expect(roller.Reaction.getDirection()).toBe(-90);
    });
});
describe("ReactionSolver — Stability & Determinacy Validation", () => {
    it("should throw UnstableBeamError when fewer than 3 DOFs provided", () => {
        const beam = new beam_1.Beam(10);
        beam.setSupports([new RollerSupport_1.RollerSupport(0)]); // Only 1 DOF
        beam.addLoad(new PointLoad_1.default(10, 5));
        expect(() => ReactionSolver_1.default.solve(beam)).toThrow(BeamErrors_1.UnstableBeamError);
    });
    it("should throw UnstableBeamError when parallel rollers are provided (singular matrix)", () => {
        const beam = new beam_1.Beam(10);
        // 3 rollers have 3 vertical DOFs but 0 horizontal restraint => singular equilibrium
        beam.setSupports([
            new RollerSupport_1.RollerSupport(0),
            new RollerSupport_1.RollerSupport(5),
            new RollerSupport_1.RollerSupport(10),
        ]);
        beam.addLoad(new PointLoad_1.default(10, 5));
        expect(() => ReactionSolver_1.default.solve(beam)).toThrow(BeamErrors_1.UnstableBeamError);
    });
    it("should throw IndeterminateBeamError when more than 3 DOFs provided", () => {
        const beam = new beam_1.Beam(10);
        beam.setSupports([
            new PinnedSupport_1.PinnedSupport(0), // 2 DOFs
            new PinnedSupport_1.PinnedSupport(10), // 2 DOFs => Total 4 DOFs
        ]);
        beam.addLoad(new PointLoad_1.default(10, 5));
        expect(() => ReactionSolver_1.default.solve(beam)).toThrow(BeamErrors_1.IndeterminateBeamError);
    });
});
