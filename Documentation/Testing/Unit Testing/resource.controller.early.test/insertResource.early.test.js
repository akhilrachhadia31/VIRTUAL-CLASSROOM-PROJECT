// Unit tests for: insertResource

import { Lesson } from "../../models/lesson.model.js";
import { Resource } from "../../models/resource.model.js";
import { insertResource } from "../resource.controller";

jest.mock("../../models/lesson.model.js");
jest.mock("../../models/resource.model.js");

describe("insertResource() insertResource method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        lessonId: "lesson123",
        title: "Resource Title",
        description: "Resource Description",
        videolink: "http://example.com/video",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should insert a resource successfully when lesson exists", async () => {
      // Arrange
      const lessonMock = {
        reference: [],
        save: jest.fn(),
      };
      const savedResourceMock = {
        _id: "resource123",
        lesson: req.body.lessonId,
        title: req.body.title,
        description: req.body.description,
        videolink: req.body.videolink,
      };

      Lesson.findById.mockResolvedValue(lessonMock);
      Resource.prototype.save.mockResolvedValue(savedResourceMock);

      // Act
      await insertResource(req, res);

      // Assert
      expect(Lesson.findById).toHaveBeenCalledWith(req.body.lessonId);
      expect(Resource.prototype.save).toHaveBeenCalled();
      expect(lessonMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedResourceMock);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return 404 if lesson is not found", async () => {
      // Arrange
      Lesson.findById.mockResolvedValue(null);

      // Act
      await insertResource(req, res);

      // Assert
      expect(Lesson.findById).toHaveBeenCalledWith(req.body.lessonId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Lesson not found",
      });
    });

    it("should return 400 if resource saving fails", async () => {
      // Arrange
      const lessonMock = {
        reference: [],
        save: jest.fn(),
      };
      Lesson.findById.mockResolvedValue(lessonMock);
      Resource.prototype.save.mockRejectedValue(
        new Error("Resource save error"),
      );

      // Act
      await insertResource(req, res);

      // Assert
      expect(Lesson.findById).toHaveBeenCalledWith(req.body.lessonId);
      expect(Resource.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Resource save error",
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange
      Lesson.findById.mockRejectedValue(new Error("Unexpected error"));

      // Act
      await insertResource(req, res);

      // Assert
      expect(Lesson.findById).toHaveBeenCalledWith(req.body.lessonId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unexpected error",
      });
    });
  });
});

// End of unit tests for: insertResource
