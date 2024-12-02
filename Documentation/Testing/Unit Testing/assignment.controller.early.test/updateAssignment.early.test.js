// Unit tests for: updateAssignment

import { Assignment } from "../../models/assignment.model.js";
import { updateAssignment } from "../assignment.controller";

jest.mock("../../models/assignment.model.js");

describe("updateAssignment() updateAssignment method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "assignmentId" },
      body: { title: "Updated Title", description: "Updated Description" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should update an assignment successfully and return the updated assignment", async () => {
      // Arrange: Mock the Assignment.findByIdAndUpdate to return a successful update
      const updatedAssignment = { _id: "assignmentId", ...req.body };
      Assignment.findByIdAndUpdate.mockResolvedValue(updatedAssignment);

      // Act: Call the updateAssignment function
      await updateAssignment(req, res);

      // Assert: Check if the response is as expected
      expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        req.body,
        { new: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedAssignment);
    });
  });

  describe("Edge Cases", () => {
    it("should return a 400 error if the update operation fails", async () => {
      // Arrange: Mock the Assignment.findByIdAndUpdate to throw an error
      const errorMessage = "Update failed";
      Assignment.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      // Act: Call the updateAssignment function
      await updateAssignment(req, res);

      // Assert: Check if the response is as expected
      expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        req.body,
        { new: true },
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it("should handle the case where the assignment ID does not exist", async () => {
      // Arrange: Mock the Assignment.findByIdAndUpdate to return null
      Assignment.findByIdAndUpdate.mockResolvedValue(null);

      // Act: Call the updateAssignment function
      await updateAssignment(req, res);

      // Assert: Check if the response is as expected
      expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        req.body,
        { new: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(null);
    });
  });
});

// End of unit tests for: updateAssignment
