// Unit tests for: deleteAssignment

import { Assignment } from "../../models/assignment.model.js";
import { deleteAssignment } from "../assignment.controller";

jest.mock("../../models/assignment.model.js");

describe("deleteAssignment() deleteAssignment method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "some-assignment-id",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy paths", () => {
    it("should delete an assignment and return it with status 200", async () => {
      // Arrange
      const mockDeletedAssignment = {
        _id: "some-assignment-id",
        title: "Test Assignment",
      };
      Assignment.findByIdAndDelete.mockResolvedValue(mockDeletedAssignment);

      // Act
      await deleteAssignment(req, res);

      // Assert
      expect(Assignment.findByIdAndDelete).toHaveBeenCalledWith(
        "some-assignment-id",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedAssignment);
    });
  });

  describe("Edge cases", () => {
    it("should return 400 if an error occurs during deletion", async () => {
      // Arrange
      const mockError = new Error("Deletion error");
      Assignment.findByIdAndDelete.mockRejectedValue(mockError);

      // Act
      await deleteAssignment(req, res);

      // Assert
      expect(Assignment.findByIdAndDelete).toHaveBeenCalledWith(
        "some-assignment-id",
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Deletion error",
      });
    });

    it("should return 200 with null if the assignment does not exist", async () => {
      // Arrange
      Assignment.findByIdAndDelete.mockResolvedValue(null);

      // Act
      await deleteAssignment(req, res);

      // Assert
      expect(Assignment.findByIdAndDelete).toHaveBeenCalledWith(
        "some-assignment-id",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(null);
    });
  });
});

// End of unit tests for: deleteAssignment
