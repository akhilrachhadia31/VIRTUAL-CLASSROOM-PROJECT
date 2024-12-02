// Unit tests for: submitAssignment

import { Assignment } from "../../models/assignment.model.js";
import { submitAssignment } from "../assignment.controller";

jest.mock("../../models/assignment.model.js");

describe("submitAssignment() submitAssignment method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        assignmentId: "assignment123",
        user: { _id: "user123" },
        file: "fileContent",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should successfully submit an assignment", async () => {
      // Arrange
      const mockAssignment = {
        _id: "assignment123",
        submission: [],
      };
      Assignment.findByIdAndUpdate.mockResolvedValue(mockAssignment);

      // Act
      await submitAssignment(req, res);

      // Assert
      expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
        "assignment123",
        {
          $push: {
            submission: {
              $each: [
                {
                  student: "user123",
                  work: "fileContent",
                },
              ],
              $setOnInsert: { submission: [] },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockAssignment,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return 404 if assignment is not found", async () => {
      // Arrange
      Assignment.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await submitAssignment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Assignment not found",
      });
    });

    it("should handle duplicate submission error", async () => {
      // Arrange
      const error = new Error("Duplicate submission");
      error.code = 11000;
      Assignment.findByIdAndUpdate.mockRejectedValue(error);

      // Act
      await submitAssignment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "You have already submitted this assignment",
      });
    });

    it("should handle general errors", async () => {
      // Arrange
      const error = new Error("Some error");
      Assignment.findByIdAndUpdate.mockRejectedValue(error);

      // Act
      await submitAssignment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Some error",
      });
    });
  });
});

// End of unit tests for: submitAssignment
