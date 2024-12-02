// Unit tests for: updateMaterial

import { Material } from "../../models/material.model.js";
import { updateMaterial } from "../material.controller";

jest.mock("../../models/material.model.js");

describe("updateMaterial() updateMaterial method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "materialId" },
      body: { title: "Updated Title", description: "Updated Description" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should update a material successfully and return the updated material", async () => {
      // Arrange
      const updatedMaterial = { _id: "materialId", ...req.body };
      Material.findByIdAndUpdate.mockResolvedValue(updatedMaterial);

      // Act
      await updateMaterial(req, res);

      // Assert
      expect(Material.findByIdAndUpdate).toHaveBeenCalledWith(
        "materialId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedMaterial);
    });
  });

  describe("Edge Cases", () => {
    it("should return a 401 error if the material is not found", async () => {
      // Arrange
      Material.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateMaterial(req, res);

      // Assert
      expect(Material.findByIdAndUpdate).toHaveBeenCalledWith(
        "materialId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
    });

    it("should return a 401 error if an error occurs during the update", async () => {
      // Arrange
      const errorMessage = "Database error";
      Material.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      // Act
      await updateMaterial(req, res);

      // Assert
      expect(Material.findByIdAndUpdate).toHaveBeenCalledWith(
        "materialId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it("should handle invalid input gracefully", async () => {
      // Arrange
      req.body = {}; // Empty body to simulate invalid input
      Material.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateMaterial(req, res);

      // Assert
      expect(Material.findByIdAndUpdate).toHaveBeenCalledWith(
        "materialId",
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
    });
  });
});

// End of unit tests for: updateMaterial
