import BaseReaction from "../../../src/objects/Forces/reactions/BaseReaction";
import {
  BaseSupport,
  supportType,
} from "../../../src/objects/supports/BaseSupport";

class TestReaction extends BaseReaction {
  // Implement necessary methods and properties for TestReaction
}

class TestSupport extends BaseSupport {
  private reaction: BaseReaction;

  get Reaction(): BaseReaction {
    return this.reaction;
  }

  set Reaction(reaction: BaseReaction) {
    this.reaction = reaction;
  }

  constructor(location: number, supportType: supportType) {
    super(location, supportType);
    this.reaction = new TestReaction(0, 0, 0, 0); // Initialize with a default TestReaction
  }
}

describe("BaseSupport", () => {
  it("should create an instance of BaseSupport", () => {
    const support = new TestSupport(10, supportType.pinnedSupport);
    expect(support).toBeInstanceOf(BaseSupport);
  });

  it("should get the correct location", () => {
    const support = new TestSupport(10, supportType.rollerSupport);
    expect(support.Location).toBe(10);
  });

  it("should set the correct location", () => {
    const support = new TestSupport(10, supportType.fixedSupport);
    support.Location = 20;
    expect(support.Location).toBe(20);
  });

  it("should get the correct support type", () => {
    const support = new TestSupport(10, supportType.simpleSupport);
    expect(support.SupportType).toBe(supportType.simpleSupport);
  });
});
