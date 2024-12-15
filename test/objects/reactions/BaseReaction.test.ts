import BaseReaction from "../../../src/objects/Forces/reactions/BaseReaction";
import Moment from "../../../src/objects/Forces/Moment";

describe("BaseReaction", () => {
  it("should create an instance of BaseReaction", () => {
    const moment = new Moment(10, "ccw", 5, 5);
    const baseReaction = new BaseReaction(100, 45, 10, 10, moment);

    expect(baseReaction).toBeInstanceOf(BaseReaction);
    expect(baseReaction.getMoment()).toBe(moment);
  });

  it("should set and get moment correctly", () => {
    const moment1 = new Moment(10, "ccw", 5, 5);
    const moment2 = new Moment(20, "cw", 15, 15);
    const baseReaction = new BaseReaction(100, 45, 10, 10, moment1);

    baseReaction.setMoment(moment2);

    expect(baseReaction.getMoment()).toBe(moment2);
  });

  it("should create an instance of BaseReaction with default moment", () => {
    const baseReaction = new BaseReaction(100, 45, 10, 10);

    expect(baseReaction).toBeInstanceOf(BaseReaction);
    expect(baseReaction.getMoment()).toBeInstanceOf(Moment);
    expect(baseReaction.getMoment().magnitude).toBe(0);
    expect(baseReaction.getMoment().direction).toBe("ccw");
  });
});
