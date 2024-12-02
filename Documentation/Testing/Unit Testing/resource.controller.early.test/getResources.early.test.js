// Unit tests for: getResources

import { Lesson } from "../../models/lesson.model.js";
import { Resource } from "../../models/resource.model.js";
import { getResources } from "../resource.controller";

jest.mock("../../models/lesson.model.js");
jest.mock("../../models/resource.model.js");

describe("getResources() getResources method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "validLessonId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path: Successfully retrieves resources for a valid lesson
  it("should return resources for a valid lesson", async () => {
    const mockLesson = {
      reference: ["resourceId1", "resourceId2"],
    };
    const mockResources = [
      { _id: "resourceId1", title: "Resource 1" },
      { _id: "resourceId2", title: "Resource 2" },
    ];

    Lesson.findById.mockResolvedValue(mockLesson);
    Resource.findById
      .mockResolvedValueOnce(mockResources[0])
      .mockResolvedValueOnce(mockResources[1]);

    await getResources(req, res);

    expect(Lesson.findById).toHaveBeenCalledWith("validLessonId");
    expect(Resource.findById).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResources);
  });

  // Edge Case: Lesson not found
  it("should return 404 if lesson is not found", async () => {
    Lesson.findById.mockResolvedValue(null);

    await getResources(req, res);

    expect(Lesson.findById).toHaveBeenCalledWith("validLessonId");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Lesson not found",
    });
  });

  // Edge Case: Invalid lesson ID format
  it("should return 400 for invalid lesson ID format", async () => {
    const error = new Error("Invalid ID");
    error.name = "CastError";
    error.kind = "ObjectId";

    Lesson.findById.mockRejectedValue(error);

    await getResources(req, res);

    expect(Lesson.findById).toHaveBeenCalledWith("validLessonId");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid lesson ID format",
    });
  });

  // Edge Case: General error handling
  it("should return 500 for general errors", async () => {
    const error = new Error("Some error");
    Lesson.findById.mockRejectedValue(error);

    await getResources(req, res);

    expect(Lesson.findById).toHaveBeenCalledWith("validLessonId");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred while fetching resources",
      error: error.message,
    });
  });
});

// End of unit tests for: getResources
