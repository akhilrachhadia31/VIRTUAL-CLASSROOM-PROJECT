// Unit tests for: getAssignments

import { Assignment } from "../../models/assignment.model.js";
import { Class } from "../../models/class.model.js";
import { getAssignments } from "../assignment.controller";

jest.mock("../../models/assignment.model.js");
jest.mock("../../models/class.model.js");

describe("getAssignments() getAssignments method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        subject: "Math",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy paths", () => {
    it("should return assignments for a valid subject", async () => {
      // Arrange
      const mockClass = { _id: "classId", subject: "Math" };
      const mockAssignments = [
        { title: "Assignment 1", dueDate: "2023-10-10" },
        { title: "Assignment 2", dueDate: "2023-10-15" },
      ];

      Class.findOne.mockResolvedValue(mockClass);
      Assignment.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockAssignments),
      });

      // Act
      await getAssignments(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(Assignment.find).toHaveBeenCalledWith({ class: "classId" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockAssignments,
      });
    });
  });

  describe("Edge cases", () => {
    it("should return 404 if the class is not found", async () => {
      // Arrange
      Class.findOne.mockResolvedValue(null);

      // Act
      await getAssignments(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Class not found for the given subject",
      });
    });

    it("should handle errors during database operations", async () => {
      // Arrange
      const errorMessage = "Database error";
      Class.findOne.mockRejectedValue(new Error(errorMessage));

      // Act
      await getAssignments(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred while fetching assignments",
        error: errorMessage,
      });
    });
  });
});

// End of unit tests for: getAssignments
