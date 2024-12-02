import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import { login } from "../auth.controller";

// Mocking dependencies
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
jest.mock("../../models/user.model.js", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe("login() login method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "Password1!",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("Happy Path", () => {
    it("should login successfully with valid credentials", async () => {
      // Arrange: Mock user data
      const mockUser = {
        _id: "userId123",
        email: "test@example.com",
        password: "hashedPassword",
        isVerified: true,
        username: "testuser",
        save: jest.fn(),
      };

      // Mock User.findOne to return the mock user
      User.findOne.mockResolvedValue(mockUser);

      // Mock bcryptjs.compare to return true (password matches)
      bcryptjs.compare.mockResolvedValue(true);

      // Mock jwt.sign to return a fake JWT token
      jwt.sign.mockReturnValue("jwtToken");

      // Act: Call the login function
      await login(req, res);

      // Assert: Check the function behavior
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcryptjs.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser._id, username: mockUser.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      expect(mockUser.save).toHaveBeenCalled(); // Ensure the save was called after login
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: { ...mockUser, password: undefined }, // Remove password from the response
        token: "jwtToken",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return error if user does not exist", async () => {
      // Arrange: Mock User.findOne to return null (user not found)
      User.findOne.mockResolvedValue(null);

      // Act: Call the login function
      await login(req, res);

      // Assert: Check for error response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });

    it("should return error if user email is not verified", async () => {
      // Arrange: Mock a user with isVerified set to false
      const mockUser = {
        _id: "userId123",
        email: "test@example.com",
        password: "hashedPassword",
        isVerified: false, // User not verified
        username: "testuser",
      };
      User.findOne.mockResolvedValue(mockUser);

      // Act: Call the login function
      await login(req, res);

      // Assert: Check for email verification error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Please verify your email",
      });
    });

    it("should return error if password is incorrect", async () => {
      // Arrange: Mock user data and bcrypt comparison to return false (password doesn't match)
      const mockUser = {
        _id: "userId123",
        email: "test@example.com",
        password: "hashedPassword",
        isVerified: true,
        username: "testuser",
      };
      User.findOne.mockResolvedValue(mockUser);
      bcryptjs.compare.mockResolvedValue(false); // Password doesn't match

      // Act: Call the login function
      await login(req, res);

      // Assert: Check for invalid credentials error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });

    it("should handle server error gracefully", async () => {
      // Arrange: Simulate a server error in User.findOne
      User.findOne.mockRejectedValue(new Error("Database error"));

      // Act: Call the login function
      await login(req, res);

      // Assert: Check for server error response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });
});
