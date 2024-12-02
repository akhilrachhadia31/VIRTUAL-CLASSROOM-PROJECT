// Unit tests for: insertLesson

import { Class } from "../../models/class.model.js";
import { Lesson } from "../../models/lesson.model.js";
import { insertLesson } from "../lesson.controller";

jest.mock("../../models/class.model.js");
jest.mock("../../models/lesson.model.js");

describe("insertLesson() insertLesson method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        subject: "Mathematics",
        title: "Algebra Basics",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should insert a lesson successfully when class is found", async () => {
      // Arrange
      const mockClass = { _id: "classId", lessons: [], save: jest.fn() };
      Class.findOne.mockResolvedValue(mockClass);
      Lesson.prototype.save = jest
        .fn()
        .mockResolvedValue({ _id: "lessonId", title: "Algebra Basics" });

      // Act
      await insertLesson(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Mathematics" });
      expect(Lesson.prototype.save).toHaveBeenCalled();
      expect(mockClass.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Algebra Basics" }),
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return 404 if class is not found", async () => {
      // Arrange
      Class.findOne.mockResolvedValue(null);

      // Act
      await insertLesson(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Mathematics" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Class not found",
      });
    });

    it("should handle errors during lesson insertion", async () => {
      // Arrange
      const mockClass = { _id: "classId", lessons: [], save: jest.fn() };
      Class.findOne.mockResolvedValue(mockClass);
      Lesson.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act
      await insertLesson(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Mathematics" });
      expect(Lesson.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });

    it("should handle errors during class update", async () => {
      // Arrange
      const mockClass = {
        _id: "classId",
        lessons: [],
        save: jest.fn().mockRejectedValue(new Error("Update error")),
      };
      Class.findOne.mockResolvedValue(mockClass);
      Lesson.prototype.save = jest
        .fn()
        .mockResolvedValue({ _id: "lessonId", title: "Algebra Basics" });

      // Act
      await insertLesson(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Mathematics" });
      expect(Lesson.prototype.save).toHaveBeenCalled();
      expect(mockClass.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Update error",
      });
    });
  });
});

// End of unit tests for: insertLesson
