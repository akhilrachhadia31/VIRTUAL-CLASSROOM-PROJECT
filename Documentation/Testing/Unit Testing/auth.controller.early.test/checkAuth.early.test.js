// Unit tests for: checkAuth

import { checkAuth } from "../../controller/auth.controller.js";
import { User } from "../../models/user.model.js";

jest.mock("../../models/user.model.js");

describe("checkAuth() checkAuth method", () => {
  let req, res;

  beforeEach(() => {
    req = { userId: "validUserId" };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should return user details when a valid userId is provided", async () => {
      // Arrange: Mock the User.findById method to return a valid user object
      const mockUser = {
        _id: "validUserId",
        username: "testUser",
        email: "test@example.com",
      };
      User.findById.mockResolvedValue(mockUser);

      // Act: Call the checkAuth function
      await checkAuth(req, res);

      // Assert: Verify that the response is successful and contains the user data
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockUser },
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return an error when userId is not found", async () => {
      // Arrange: Mock the User.findById method to return null
      User.findById.mockResolvedValue(null);

      // Act: Call the checkAuth function
      await checkAuth(req, res);

      // Assert: Verify that the response indicates the user was not found
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should handle errors thrown during user lookup", async () => {
      // Arrange: Mock the User.findById method to throw an error
      const errorMessage = "Database error";
      User.findById.mockRejectedValue(new Error(errorMessage));

      // Act: Call the checkAuth function
      await checkAuth(req, res);

      // Assert: Verify that the response indicates an error occurred
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});

// End of unit tests for: checkAuth
