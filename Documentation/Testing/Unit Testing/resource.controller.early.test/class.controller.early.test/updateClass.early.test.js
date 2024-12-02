import { Class } from "../../models/class.model.js";
import { updateClass } from "../class.controller";

jest.mock("../../models/class.model.js");

describe("updateClass() updateClass method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "classId123" },
      body: { subject: "Math", code: "NEWCODE123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should update the class successfully and return the updated class", async () => {
      // Arrange
      const updatedClass = {
        _id: "classId123",
        subject: "Math",
        code: "NEWCODE123",
      };
      Class.findByIdAndUpdate.mockResolvedValue(updatedClass);

      // Act
      await updateClass(req, res);

      // Assert
      expect(Class.findByIdAndUpdate).toHaveBeenCalledWith(
        "classId123",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedClass);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return 400 if the class ID is invalid", async () => {
      // Arrange
      req.params.id = "invalidId";
      Class.findByIdAndUpdate.mockRejectedValue(new Error("Invalid ID"));

      // Act
      await updateClass(req, res);

      // Assert
      expect(Class.findByIdAndUpdate).toHaveBeenCalledWith(
        "invalidId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid ID",
      });
    });

    it("should return 400 if the update data is invalid", async () => {
      // Arrange
      req.body = { subject: "" }; // Invalid data
      Class.findByIdAndUpdate.mockRejectedValue(new Error("Validation failed"));

      // Act
      await updateClass(req, res);

      // Assert
      expect(Class.findByIdAndUpdate).toHaveBeenCalledWith(
        "classId123",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
      });
    });

    it("should return 400 if the class does not exist", async () => {
      // Arrange: Mock the case when no class is found
      Class.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateClass(req, res);

      // Assert
      expect(Class.findByIdAndUpdate).toHaveBeenCalledWith(
        "classId123",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Class not found",
      });
    });
  });
});

