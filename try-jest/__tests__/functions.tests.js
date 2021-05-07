const { factorial } = require("../src/functions");

describe("Functions", () => {
  describe("Factorial", () => {
    it("should be 1", () => {
      expect(factorial(0)).toBe(1);
    });

    it("should be 1", () => {
      expect(factorial(-5)).toBe(1);
    });

    it("should be 720", () => {
      expect(factorial(6)).toBe(720);
    });
  });
});
