// Unit tests for: deleteResource

import { Lesson } from "../../models/lesson.model.js";
import { Resource } from "../../models/resource.model.js";
import { deleteResource } from "../resource.controller";

jest.mock("../../models/lesson.model.js");
jest.mock("../../models/resource.model.js");

describe("deleteResource() deleteResource method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "resourceId" },
      body: { lessonId: "lessonId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should delete a resource and update the lesson references", async () => {
      // Mocking the Lesson and Resource models
      const lesson = {
        reference: ["resourceId", "anotherResourceId"],
        save: jest.fn(),
      };
      Lesson.findById.mockResolvedValue(lesson);
      Resource.findByIdAndDelete.mockResolvedValue({ _id: "resourceId" });

      await deleteResource(req, res);

      // Check if the resource was removed from the lesson's reference
      expect(lesson.reference).toEqual(["anotherResourceId"]);
      expect(lesson.save).toHaveBeenCalled();

      // Check if the resource was deleted
      expect(Resource.findByIdAndDelete).toHaveBeenCalledWith("resourceId");

      // Check if the response was successful
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: "resourceId" });
    });
  });

  describe("Edge Cases", () => {
    it("should return 404 if the lesson is not found", async () => {
      // Mocking the Lesson model to return null
      Lesson.findById.mockResolvedValue(null);

      await deleteResource(req, res);

      // Check if the response indicates the lesson was not found
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Lesson not found",
      });
    });

    it("should handle errors during deletion gracefully", async () => {
      // Mocking the Lesson model to throw an error
      Lesson.findById.mockRejectedValue(new Error("Database error"));

      await deleteResource(req, res);

      // Check if the response indicates an error occurred
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });

    it("should handle invalid resource ID format", async () => {
      // Mocking the Resource model to throw a CastError
      const error = new Error("CastError");
      error.name = "CastError";
      error.kind = "ObjectId";
      Resource.findByIdAndDelete.mockRejectedValue(error);

      await deleteResource(req, res);

      // Check if the response indicates an invalid ID format
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid resource ID format",
      });
    });
  });
});

// End of unit tests for: deleteResource
