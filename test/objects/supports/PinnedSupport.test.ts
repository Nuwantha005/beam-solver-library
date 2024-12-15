import PinnedSupport from "../../../src/objects/supports/PinnedSupport";
import DoubleReaction from "../../../src/objects/Forces/reactions/DoubleReaction";
import { supportType } from "../../../src";

describe("PinnedSupport", () => {
  it("should create a PinnedSupport with the correct location and reaction", () => {
    const location = 10;
    const pinnedSupport = new PinnedSupport(location);

    expect(pinnedSupport.Location).toBe(location);
    expect(pinnedSupport.Reaction).toBeInstanceOf(DoubleReaction);
  });

  it("should set and get the reaction correctly", () => {
    const location = 10;
    const pinnedSupport = new PinnedSupport(location);
    const newReaction = new DoubleReaction(1, 2, 3, 4);

    pinnedSupport.Reaction = newReaction;

    expect(pinnedSupport.Reaction).toBe(newReaction);
  });

  it("should have the correct support type", () => {
    const location = 10;
    const pinnedSupport = new PinnedSupport(location);

    expect(pinnedSupport.SupportType).toBe(supportType.pinnedSupport);
  });
});
