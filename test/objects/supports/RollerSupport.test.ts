import { SimpleForce } from "../../../src";
import RollerSupport from "../../../src/objects/supports/RollerSupport";

describe("RollerSupport", () => {
  it("should create a RollerSupport instance with correct location and reaction", () => {
    const location = 10;
    const rollerSupport = new RollerSupport(location);

    expect(rollerSupport.Location).toBe(location);
    expect(rollerSupport.Reaction).toBeInstanceOf(SimpleForce);
    expect(rollerSupport.Reaction.getDirection()).toBe(90);
    expect(rollerSupport.Reaction.getMagnitude()).toBe(0);
  });

  it("should allow setting a new reaction", () => {
    const location = 10;
    const rollerSupport = new RollerSupport(location);
    const newReaction = new SimpleForce(5, "down", 10);

    rollerSupport.Reaction = newReaction;

    expect(rollerSupport.Reaction).toBe(newReaction);
    expect(rollerSupport.Reaction.getDirection()).toBe(-90);
    expect(rollerSupport.Reaction.getMagnitude()).toBe(5);
  });
});
