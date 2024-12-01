// Unit tests for: submitWorkDetails

import { Assignment } from "../../models/assignment.model.js";
import { Class } from "../../models/class.model.js";
import { submitWorkDetails } from "../assignment.controller";

jest.mock("../../models/class.model.js");
jest.mock("../../models/assignment.model.js");

describe("submitWorkDetails() submitWorkDetails method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        subject: "Mathematics",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });


  describe("Edge Cases", () => {
    it("should return 400 if subject is missing", async () => {
      // Arrange
      req.params.subject = undefined;

      // Act
      await submitWorkDetails(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Subject is required and must be a string",
      });
    });

    it("should return 404 if class is not found", async () => {
      // Arrange
      Class.findOne.mockResolvedValue(null);

      // Act
      await submitWorkDetails(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Mathematics" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Class not found for the given subject",
      });
    });

    it("should handle errors gracefully and return 500", async () => {
      // Arrange
      const errorMessage = "Database error";
      Class.findOne.mockRejectedValue(new Error(errorMessage));

      // Act
      await submitWorkDetails(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred while fetching assignments and students",
        error: errorMessage,
      });
    });
  });
});

// End of unit tests for: submitWorkDetails
