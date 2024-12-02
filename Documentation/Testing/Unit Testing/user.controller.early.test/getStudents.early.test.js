// Unit tests for: getStudents

import { User } from "../../models/user.model.js";
import { getStudents } from "../user.controller";

jest.mock("../../../src/models/user.model.js");

describe("getStudents() getStudents method", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should return a list of students when students are present in the database", async () => {
      // Arrange: Mock the User.find method to return a list of students
      const mockStudents = [
        { _id: "1", username: "student1", type: "student" },
        { _id: "2", username: "student2", type: "student" },
      ];
      User.find.mockResolvedValue(mockStudents);

      // Act: Call the getStudents function
      await getStudents(req, res);

      // Assert: Check if the response status is 200 and the correct data is returned
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStudents);
    });

    it("should return an empty array when no students are found", async () => {
      // Arrange: Mock the User.find method to return an empty array
      User.find.mockResolvedValue([]);

      // Act: Call the getStudents function
      await getStudents(req, res);

      // Assert: Check if the response status is 200 and an empty array is returned
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle database errors gracefully", async () => {
      // Arrange: Mock the User.find method to throw an error
      const errorMessage = "Database error";
      User.find.mockRejectedValue(new Error(errorMessage));

      // Act: Call the getStudents function
      await getStudents(req, res);

      // Assert: Check if the response status is 500 and the correct error message is returned
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error fetching data",
      });
    });
  });
});

// End of unit tests for: getStudents
