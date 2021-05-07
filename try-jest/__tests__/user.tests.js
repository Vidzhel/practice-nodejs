const { Mongoose } = require("mongoose");
const db = require("../src/db");

describe("Validation`", () => {
  beforeAll(() => {
    return db.configureDb();
  });
  afterAll(() => {
    return db.connection.disconnect();
  });

  beforeEach(() => {
    return db.User.deleteMany({});
  });

  it("should fail name required", () => {
    const user = new db.User({
      email: "some@mail.com",
      age: 22,
    });

    return expect(user.save).toThrow();
  });
  it("should fail email required", () => {
    const user = new db.User({
      name: "John",
      age: 22,
    });

    return expect(user.save).toThrow();
  });
  it("should fail age required", () => {
    const user = new db.User({
      name: "John",
      email: "some@mail.com",
    });

    // return expect(user.save).toThrow(/`email` is required/);
  });
  it("should fail name minimum length", () => {
    const user = new db.User({
      name: "J",
      email: "some@mail.com",
      age: 22,
    });

    return expect(user.save).toThrow();
  });
  it("should fail name is string", () => {
    const user = new db.User({
      name: 10,
      email: "some@mail.com",
      age: 22,
    });

    return expect(user.save).toThrow();
  });
  it("should fail email format", () => {
    const user = new db.User({
      name: "John",
      email: "sommail.com",
      age: 22,
    });

    return expect(user.save).toThrow();
  });
  it("should fail email unique", () => {
    const user = new db.User({
      name: "John",
      email: "some@mail.com",
      age: 22,
    });

    const user2 = new db.User({
      name: "Josh",
      email: "some@mail.com",
      age: 23,
    });

    user.save();
    return expect(user2.validate).toThrow();
  });
  it("should fail age minimal value", () => {
    const user = new db.User({
      name: "John",
      email: "some@mail.com",
      age: 0,
    });

    return expect(user.save).toThrow();
  });
  it("should pass", () => {
    const user = new db.User();
    user.name = "John";
    user.email = "some@mail.com";
    user.age = 25;

    return user.save();
  });
});
