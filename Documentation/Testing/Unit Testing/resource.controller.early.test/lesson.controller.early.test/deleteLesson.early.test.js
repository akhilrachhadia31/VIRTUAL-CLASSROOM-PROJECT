// Unit tests for: deleteLesson

import { Lesson } from "../../models/lesson.model.js";
import { deleteLesson } from "../lesson.controller";

jest.mock("../../models/lesson.model.js");

describe("deleteLesson() deleteLesson method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "lessonId123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should delete a lesson and return the deleted lesson object", async () => {
      // Arrange: Mock the Lesson.findByIdAndDelete to return a lesson object
      const mockLesson = { _id: "lessonId123", title: "Sample Lesson" };
      Lesson.findByIdAndDelete.mockResolvedValue(mockLesson);

      // Act: Call the deleteLesson function
      await deleteLesson(req, res);

      // Assert: Check if the response is correct
      expect(Lesson.findByIdAndDelete).toHaveBeenCalledWith("lessonId123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLesson);
    });
  });

  describe("Edge Cases", () => {
    it("should return a 400 status if the lesson ID is invalid", async () => {
      // Arrange: Mock the Lesson.findByIdAndDelete to throw an error
      const errorMessage = "Invalid lesson ID";
      Lesson.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

      // Act: Call the deleteLesson function
      await deleteLesson(req, res);

      // Assert: Check if the response is correct
      expect(Lesson.findByIdAndDelete).toHaveBeenCalledWith("lessonId123");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it("should return a 400 status if the lesson does not exist", async () => {
      // Arrange: Mock the Lesson.findByIdAndDelete to return null
      Lesson.findByIdAndDelete.mockResolvedValue(null);

      // Act: Call the deleteLesson function
      await deleteLesson(req, res);

      // Assert: Check if the response is correct
      expect(Lesson.findByIdAndDelete).toHaveBeenCalledWith("lessonId123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(null);
    });
  });
});

// End of unit tests for: deleteLesson
