import { FixedSupport } from "../../../src/objects/supports/FixedSupport";
import { supportType } from "../../../src/objects/supports/BaseSupport";
import Force2D from "../../../src/objects/Forces/Force2D";
import Moment from "../../../src/objects/Forces/Moment";

describe("FixedSupport", () => {
  let fixedSupport: FixedSupport;

  beforeEach(() => {
    fixedSupport = new FixedSupport(0);
  });

  it("should have correct supportType", () => {
    expect(fixedSupport.SupportType).toBe(supportType.FIXED);
  });

  it("should initialize with default reaction at location", () => {
    expect(fixedSupport.Location).toBe(0);
    expect(fixedSupport.Reaction.getMagnitude()).toBe(0);
    expect(fixedSupport.Reaction.getX()).toBe(0);
    expect(fixedSupport.Moment.magnitude).toBe(0);
  });

  it("should allow setting location", () => {
    fixedSupport.Location = 5;
    expect(fixedSupport.Location).toBe(5);
  });

  it("should allow setting and getting reaction force", () => {
    const newReaction = new Force2D(50, 90, 0);
    fixedSupport.Reaction = newReaction;
    expect(fixedSupport.Reaction).toBe(newReaction);
    expect(fixedSupport.Reaction.getMagnitude()).toBe(50);
  });

  it("should allow setting and getting reaction moment", () => {
    const newMoment = new Moment(120, "ccw", 0, 0);
    fixedSupport.Moment = newMoment;
    expect(fixedSupport.Moment).toBe(newMoment);
    expect(fixedSupport.Moment.magnitude).toBe(120);
    expect(fixedSupport.Moment.direction).toBe("ccw");
  });
});
