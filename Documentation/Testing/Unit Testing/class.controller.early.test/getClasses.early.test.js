import { Class } from "../../models/class.model.js";
import { getClasses } from "../class.controller";

jest.mock("../../models/class.model.js");

describe("getClasses() getClasses method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        codes: [],  // Default empty codes array
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return an empty array when no class codes are provided", async () => {
      // Arrange
      req.body.codes = [];  // Empty codes array

      // Act
      await getClasses(req, res);

      // Assert
      expect(Class.findOne).not.toHaveBeenCalled();  // No DB calls
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);  // Empty array response
    });

    it("should return classes for valid class codes", async () => {
      // Arrange
      const mockClasses = [
        { code: "CLASS1", name: "Math" },
        { code: "CLASS2", name: "Science" },
      ];
      req.body.codes = ["CLASS1", "CLASS2"];

      // Mock the behavior of findOne for each class code
      Class.findOne.mockImplementation((query) => {
        return Promise.resolve(
          mockClasses.find((cls) => cls.code === query.code) || null
        );
      });

      // Act
      await getClasses(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClasses);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle non-existent class codes gracefully", async () => {
      // Arrange
      req.body.codes = ["NONEXISTENT"];
      Class.findOne.mockResolvedValue(null);

      // Act
      await getClasses(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ code: "NONEXISTENT" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([null]);
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      req.body.codes = ["ERROR"];
      const errorMessage = "Database error";
      Class.findOne.mockRejectedValue(new Error(errorMessage));

      // Act
      await getClasses(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ code: "ERROR" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it("should handle an empty request body gracefully", async () => {
      // Arrange
      req.body = {};  // Empty request body

      // Act
      await getClasses(req, res);

      // Assert
      expect(Class.findOne).not.toHaveBeenCalled();  // No DB calls
      expect(res.status).toHaveBeenCalledWith(200);   // Return status 200
      expect(res.json).toHaveBeenCalledWith([]);     // Return empty array
    });
  });
});
