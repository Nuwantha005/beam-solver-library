import Moment from "../../../src/objects/Forces/Moment";

describe("BaseMoment", () => {
  it("should create an instance with given parameters", () => {
    const moment = new Moment(10, "cw", 5);
    expect(moment.magnitude).toBe(10);
    expect(moment.direction).toBe("cw");
    expect(moment.location).toBe(5);
  });

  it("should set and get magnitude correctly", () => {
    const moment = new Moment(10, "cw", 5);
    moment.magnitude = 20;
    expect(moment.magnitude).toBe(20);
  });

  it("should set and get direction correctly", () => {
    const moment = new Moment(10, "cw", 5);
    moment.direction = "ccw";
    expect(moment.direction).toBe("ccw");
  });

  it("should set and get location correctly", () => {
    const moment = new Moment(10, "cw", 5);
    moment.location = 15;
    expect(moment.location).toBe(15);
  });
});
