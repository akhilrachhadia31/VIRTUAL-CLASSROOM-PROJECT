// Unit tests for: insertMaterial

import { Class } from "../../models/class.model.js";
import { Material } from "../../models/material.model.js";
import { insertMaterial } from "../material.controller";

jest.mock("../../models/class.model.js");
jest.mock("../../models/material.model.js");

describe("insertMaterial() insertMaterial method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        subject: "Math",
        title: "Algebra Basics",
        description: "Introduction to Algebra",
        file: "algebra.pdf",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy paths", () => {
    it("should insert a new material successfully", async () => {
      // Arrange
      const mockClass = { _id: "classId", materials: [], save: jest.fn() };
      const mockMaterial = {
        _id: "materialId",
        save: jest.fn().mockResolvedValue({ _id: "materialId" }),
      };

      Class.findOne.mockResolvedValue(mockClass);
      Material.mockImplementation(() => mockMaterial);

      // Act
      await insertMaterial(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(Material).toHaveBeenCalledWith({
        title: "Algebra Basics",
        description: "Introduction to Algebra",
        class: "classId",
        file: "algebra.pdf",
      });
      expect(mockMaterial.save).toHaveBeenCalled();
      expect(mockClass.materials).toContain("materialId");
      expect(mockClass.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: "materialId" });
    });
  });

  describe("Edge cases", () => {
    it("should return 400 if class is not found", async () => {
      // Arrange
      Class.findOne.mockResolvedValue(null);

      // Act
      await insertMaterial(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
    });

    it("should handle errors during material saving", async () => {
      // Arrange
      const mockClass = { _id: "classId", materials: [], save: jest.fn() };
      const mockMaterial = {
        save: jest.fn().mockRejectedValue(new Error("Save failed")),
      };

      Class.findOne.mockResolvedValue(mockClass);
      Material.mockImplementation(() => mockMaterial);

      // Act
      await insertMaterial(req, res);

      // Assert
      expect(mockMaterial.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Save failed",
      });
    });

    it("should handle errors during class saving", async () => {
      // Arrange
      const mockClass = {
        _id: "classId",
        materials: [],
        save: jest.fn().mockRejectedValue(new Error("Class save failed")),
      };
      const mockMaterial = {
        _id: "materialId",
        save: jest.fn().mockResolvedValue({ _id: "materialId" }),
      };

      Class.findOne.mockResolvedValue(mockClass);
      Material.mockImplementation(() => mockMaterial);

      // Act
      await insertMaterial(req, res);

      // Assert
      expect(mockClass.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Class save failed",
      });
    });
  });
});

// End of unit tests for: insertMaterial
