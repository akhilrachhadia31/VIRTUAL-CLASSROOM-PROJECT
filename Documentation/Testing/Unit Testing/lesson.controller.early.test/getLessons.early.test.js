// Unit tests for: getLessons

import { Class } from "../../models/class.model.js";
import { Lesson } from "../../models/lesson.model.js";
import { getLessons } from "../lesson.controller";

jest.mock("../../models/class.model.js");
jest.mock("../../models/lesson.model.js");

describe("getLessons() getLessons method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
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
    it("should return lessons for a valid subject", async () => {
      // Arrange
      const mockClasses = [{ lessons: ["lesson1", "lesson2"] }];
      const mockLessons = [
        { _id: "lesson1", title: "Lesson 1" },
        { _id: "lesson2", title: "Lesson 2" },
      ];

      Class.find.mockResolvedValue(mockClasses);
      Lesson.findById.mockImplementation((id) => {
        return Promise.resolve(mockLessons.find((lesson) => lesson._id === id));
      });

      // Act
      await getLessons(req, res);

      // Assert
      expect(Class.find).toHaveBeenCalledWith({ subject: "Math" });
      expect(Lesson.findById).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLessons);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return 404 if no classes are found for the subject", async () => {
      // Arrange
      Class.find.mockResolvedValue([]);

      // Act
      await getLessons(req, res);

      // Assert
      expect(Class.find).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "No classes found for this subject",
      });
    });

    it("should return 500 if a lesson is not found", async () => {
      // Arrange
      const mockClasses = [{ lessons: ["lesson1"] }];
      Class.find.mockResolvedValue(mockClasses);
      Lesson.findById.mockResolvedValue(null);

      // Act
      await getLessons(req, res);

      // Assert
      expect(Class.find).toHaveBeenCalledWith({ subject: "Math" });
      expect(Lesson.findById).toHaveBeenCalledWith("lesson1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred while fetching lectures",
      });
    });

    it("should handle errors thrown during database operations", async () => {
      // Arrange
      Class.find.mockRejectedValue(new Error("Database error"));

      // Act
      await getLessons(req, res);

      // Assert
      expect(Class.find).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred while fetching lectures",
      });
    });
  });
});

// End of unit tests for: getLessons
