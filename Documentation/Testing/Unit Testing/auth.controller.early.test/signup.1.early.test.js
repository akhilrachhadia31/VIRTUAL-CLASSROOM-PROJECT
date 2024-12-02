// Unit tests for: signup

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { otp_user } from "../../models/otp-checker.js";
import { User } from "../../models/user.model.js";
import { signup } from "../auth.controller";

// Mocking the mailer functions
jest.mock("../../mailtrap/mailer.js", () => {
  const originalModule = jest.requireActual("../../mailtrap/mailer.js");
  return {
    __esModule: true,
    ...originalModule,
    sendEmail: jest.fn(),
    sendWelcomeEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    sendResetSuccessEmail: jest.fn(),
  };
});

// Mocking the User and otp_user models
jest.mock("../../models/user.model.js", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../../models/otp-checker.js", () => ({
  otp_user: {
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn(),
  },
}));

// Mocking bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

// Mocking jwt
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("signup() signup method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "Password1!",
        username: "testuser",
        type: "user",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should successfully sign up a new user", async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);
      otp_user.findOne.mockResolvedValue(null);
      bcryptjs.hash.mockResolvedValue("hashedPassword");
      jwt.sign.mockReturnValue("token");

      // Act
      await signup(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: req.body.email }, { username: req.body.username }],
      });
      expect(otp_user.findOne).toHaveBeenCalledWith({
        $or: [{ email: req.body.email }, { username: req.body.username }],
      });
      expect(bcryptjs.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(sendEmail).toHaveBeenCalledWith(
        req.body.email,
        expect.any(String),
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: expect.anything(), username: req.body.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User signed up successfully. Please verify your email.",
        user: { email: req.body.email, username: req.body.username },
        token: "token",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return an error if required fields are missing", async () => {
      // Arrange
      req.body.email = "";

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "All fields are required",
      });
    });

    it("should return an error if the password does not meet criteria", async () => {
      // Arrange
      req.body.password = "weakpass";

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be 8-12 characters long.",
      });
    });

    it("should return an error if the user already exists", async () => {
      // Arrange
      User.findOne.mockResolvedValue({});

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User already exists with this email or username",
      });
    });

    it("should handle server errors gracefully", async () => {
      // Arrange
      User.findOne.mockRejectedValue(new Error("Database error"));

      // Act
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });
});

// End of unit tests for: signup
