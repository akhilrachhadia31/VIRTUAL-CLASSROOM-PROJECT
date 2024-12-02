// Unit tests for: getMaterial

import { Class } from "../../models/class.model.js";
import { Material } from "../../models/material.model.js";
import { getMaterial } from "../material.controller";

jest.mock("../../models/class.model.js");
jest.mock("../../models/material.model.js");

describe("getMaterial() getMaterial method", () => {
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

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return materials for a valid class", async () => {
      // Arrange
      const mockClass = { _id: "classId" };
      const mockMaterials = [{ title: "Material 1" }, { title: "Material 2" }];
      Class.findOne.mockResolvedValue(mockClass);
      Material.find.mockResolvedValue(mockMaterials);

      // Act
      await getMaterial(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(Material.find).toHaveBeenCalledWith({ class: "classId" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMaterials,
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return 404 if class is not found", async () => {
      // Arrange
      Class.findOne.mockResolvedValue(null);

      // Act
      await getMaterial(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Class not found",
      });
    });

    it("should handle errors and return 500 status", async () => {
      // Arrange
      const error = new Error("Database error");
      Class.findOne.mockRejectedValue(error);

      // Act
      await getMaterial(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred while fetching materials",
      });
    });
  });
});

// End of unit tests for: getMaterial
