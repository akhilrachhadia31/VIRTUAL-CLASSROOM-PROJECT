// Unit tests for: getUser

import { User } from "../../models/user.model.js";
import { getUser } from "../user.controller";

jest.mock("../../models/user.model.js");

describe("getUser() getUser method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "12345",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should return user data when a valid user ID is provided", async () => {
      // Arrange
      const mockUser = {
        _id: "12345",
        username: "testuser",
        email: "test@example.com",
      };
      User.findById.mockResolvedValue(mockUser);

      // Act
      await getUser(req, res);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("12345");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("Edge Cases", () => {
    it("should return a 400 error if the user ID is not found", async () => {
      // Arrange
      User.findById.mockResolvedValue(null);

      // Act
      await getUser(req, res);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("12345");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
    });

    it("should return a 400 error if there is a database error", async () => {
      // Arrange
      const errorMessage = "Database error";
      User.findById.mockRejectedValue(new Error(errorMessage));

      // Act
      await getUser(req, res);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("12345");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});

// End of unit tests for: getUser
