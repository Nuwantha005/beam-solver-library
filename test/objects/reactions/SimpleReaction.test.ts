import SimpleReaction from "../../../src/objects/Forces/reactions/SimpleReaction";

describe("SimpleReaction", () => {
  it("should create a SimpleReaction with upward direction", () => {
    const reaction = new SimpleReaction(10, "up", 5);
    expect(reaction.getMagnitude()).toBe(10);
    expect(reaction.getDirection()).toBe(90);
    expect(reaction.getX()).toBe(5);
  });

  it("should create a SimpleReaction with downward direction", () => {
    const reaction = new SimpleReaction(15, "down", 10);
    expect(reaction.getMagnitude()).toBe(15);
    expect(reaction.getDirection()).toBe(-90);
    expect(reaction.getX()).toBe(10);
  });

  it("should throw an error when setMoment is called", () => {
    const reaction = new SimpleReaction(10, "up", 5);
    expect(() => reaction.setMoment()).toThrow(
      "SimpleReaction does not support moments."
    );
  });

  it("should throw an error when getMoment is called", () => {
    const reaction = new SimpleReaction(10, "up", 5);
    expect(() => reaction.getMoment()).toThrow(
      "SimpleReaction does not support moments."
    );
  });
});
