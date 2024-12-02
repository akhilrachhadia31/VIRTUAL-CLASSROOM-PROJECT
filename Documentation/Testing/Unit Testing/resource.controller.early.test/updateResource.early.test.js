// Unit tests for: updateResource

import { Resource } from "../../models/resource.model.js";
import { updateResource } from "../resource.controller";

jest.mock("../../models/resource.model.js");

describe("updateResource() updateResource method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "resourceId" },
      body: { title: "Updated Title", description: "Updated Description" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should update a resource successfully and return the updated resource", async () => {
      // Arrange
      const updatedResource = {
        _id: "resourceId",
        title: "Updated Title",
        description: "Updated Description",
      };
      Resource.findByIdAndUpdate.mockResolvedValue(updatedResource);

      // Act
      await updateResource(req, res);

      // Assert
      expect(Resource.findByIdAndUpdate).toHaveBeenCalledWith(
        "resourceId",
        req.body,
        { new: true, runValidators: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedResource);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return a 400 error if the resource ID is invalid", async () => {
      // Arrange
      const error = new Error("Invalid resource ID");
      Resource.findByIdAndUpdate.mockRejectedValue(error);

      // Act
      await updateResource(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: error.message,
      });
    });

    it("should return a 400 error if validation fails", async () => {
      // Arrange
      const validationError = new Error("Validation failed");
      Resource.findByIdAndUpdate.mockRejectedValue(validationError);

      // Act
      await updateResource(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: validationError.message,
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange
      const unexpectedError = new Error("Unexpected error");
      Resource.findByIdAndUpdate.mockRejectedValue(unexpectedError);

      // Act
      await updateResource(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: unexpectedError.message,
      });
    });
  });
});

// End of unit tests for: updateResource
