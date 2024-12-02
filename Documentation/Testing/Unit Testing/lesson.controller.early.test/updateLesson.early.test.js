// Unit tests for: updateLesson

import { Lesson } from "../../models/lesson.model.js";
import { updateLesson } from "../lesson.controller";

jest.mock("../../models/lesson.model.js");

describe("updateLesson() updateLesson method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "lessonId" },
      body: { title: "Updated Lesson Title" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should update a lesson successfully and return the updated lesson", async () => {
      // Arrange
      const updatedLesson = { _id: "lessonId", title: "Updated Lesson Title" };
      Lesson.findByIdAndUpdate.mockResolvedValue(updatedLesson);

      // Act
      await updateLesson(req, res);

      // Assert
      expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith(
        "lessonId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedLesson);
    });
  });

  describe("Edge Cases", () => {
    it("should return a 401 error if the lesson is not found", async () => {
      // Arrange
      Lesson.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateLesson(req, res);

      // Assert
      expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith(
        "lessonId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
    });

    it("should return a 401 error if there is a validation error", async () => {
      // Arrange
      const error = new Error("Validation error");
      Lesson.findByIdAndUpdate.mockRejectedValue(error);

      // Act
      await updateLesson(req, res);

      // Assert
      expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith(
        "lessonId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation error",
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange
      const error = new Error("Unexpected error");
      Lesson.findByIdAndUpdate.mockRejectedValue(error);

      // Act
      await updateLesson(req, res);

      // Assert
      expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith(
        "lessonId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unexpected error",
      });
    });
  });
});

// End of unit tests for: updateLesson
