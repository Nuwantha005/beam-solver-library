import PinnedSupport from "../../../src/objects/supports/PinnedSupport";
import { supportType } from "../../../src";
import Force2D from "../../../src/objects/Forces/Force2D";

describe("PinnedSupport", () => {
  it("should create a PinnedSupport with the correct location and reaction", () => {
    const location = 10;
    const pinnedSupport = new PinnedSupport(location);

    expect(pinnedSupport.Location).toBe(location);
    expect(pinnedSupport.Reaction).toBeInstanceOf(Force2D);
  });

  it("should set and get the reaction correctly", () => {
    const location = 10;
    const pinnedSupport = new PinnedSupport(location);
    const newReaction = new Force2D(1, 2, 3);

    pinnedSupport.Reaction = newReaction;

    expect(pinnedSupport.Reaction).toBe(newReaction);
  });

  it("should have the correct support type", () => {
    const location = 10;
    const pinnedSupport = new PinnedSupport(location);

    expect(pinnedSupport.SupportType).toBe(supportType.PINNED);
  });
});
