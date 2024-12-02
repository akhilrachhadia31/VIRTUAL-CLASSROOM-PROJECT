// Unit tests for: deleteMaterial

import { Material } from "../../models/material.model.js";
import { deleteMaterial } from "../material.controller";

jest.mock("../../models/material.model.js");

describe("deleteMaterial() deleteMaterial method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "materialId123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should delete the material and return the deleted material object", async () => {
      // Arrange
      const mockDeletedMaterial = {
        _id: "materialId123",
        title: "Sample Material",
      };
      Material.findByIdAndDelete.mockResolvedValue(mockDeletedMaterial);

      // Act
      await deleteMaterial(req, res);

      // Assert
      expect(Material.findByIdAndDelete).toHaveBeenCalledWith("materialId123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedMaterial);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return 400 if an error occurs during deletion", async () => {
      // Arrange
      const mockError = new Error("Deletion error");
      Material.findByIdAndDelete.mockRejectedValue(mockError);

      // Act
      await deleteMaterial(req, res);

      // Assert
      expect(Material.findByIdAndDelete).toHaveBeenCalledWith("materialId123");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: mockError.message,
      });
    });

    it("should return 200 with null if the material does not exist", async () => {
      // Arrange
      Material.findByIdAndDelete.mockResolvedValue(null);

      // Act
      await deleteMaterial(req, res);

      // Assert
      expect(Material.findByIdAndDelete).toHaveBeenCalledWith("materialId123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(null);
    });
  });
});

// End of unit tests for: deleteMaterial
