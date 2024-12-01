// Unit tests for: insertClass

import { Class } from "../../models/class.model.js";
import { User } from "../../models/user.model.js";
import { insertClass } from "../class.controller";

jest.mock("../../models/class.model.js");
jest.mock("../../models/user.model.js");

describe("insertClass() insertClass method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        user: { _id: "userId123" },
        subject: "Mathematics",
        code: "CLASS123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should successfully insert a class and update the user", async () => {
      // Arrange
      const mockClass = {
        save: jest.fn().mockResolvedValue({
          _id: "classId123",
          teacher: "userId123",
          subject: "Mathematics",
          code: "CLASS123",
          students: ["userId123"],
        }),
      };
      Class.mockImplementation(() => mockClass);
      User.findByIdAndUpdate.mockResolvedValue({});

      // Act
      await insertClass(req, res);

      // Assert
      expect(Class).toHaveBeenCalledWith({
        teacher: "userId123",
        subject: "Mathematics",
        code: "CLASS123",
        students: ["userId123"],
      });
      expect(mockClass.save).toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("userId123", {
        $push: { classCodes: "CLASS123" },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: "classId123",
          teacher: "userId123",
          subject: "Mathematics",
          code: "CLASS123",
          students: ["userId123"],
        }),
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return 400 if user data is missing", async () => {
      // Arrange
      req.body.user = null;

      // Act
      await insertClass(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid user or subject data",
      });
    });

    it("should return 400 if subject is missing", async () => {
      // Arrange
      req.body.subject = null;

      // Act
      await insertClass(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid user or subject data",
      });
    });

    it("should handle errors during class saving", async () => {
      // Arrange
      const mockClass = {
        save: jest.fn().mockRejectedValue(new Error("Database error")),
      };
      Class.mockImplementation(() => mockClass);

      // Act
      await insertClass(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });

    it("should handle errors during user update", async () => {
      // Arrange
      const mockClass = {
        save: jest.fn().mockResolvedValue({
          _id: "classId123",
          teacher: "userId123",
          subject: "Mathematics",
          code: "CLASS123",
          students: ["userId123"],
        }),
      };
      Class.mockImplementation(() => mockClass);
      User.findByIdAndUpdate.mockRejectedValue(new Error("User update error"));

      // Act
      await insertClass(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User update error",
      });
    });
  });
});

// End of unit tests for: insertClass
