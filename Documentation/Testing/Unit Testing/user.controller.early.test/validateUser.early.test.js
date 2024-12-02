// Unit tests for: validateUser

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import { validateUser } from "../user.controller";

jest.mock("../../models/user.model.js");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("validateUser() validateUser method", () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        password: "testpassword",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUser = {
      _id: "userId123",
      username: "testuser",
      password: "hashedpassword",
    };

    process.env.JWT_SECRET_KEY = "testsecret";
  });

  describe("Happy paths", () => {
    it("should return a token and user data when credentials are valid", async () => {
      // Arrange
      User.find.mockResolvedValue([mockUser]);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("validtoken");

      // Act
      await validateUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: mockUser,
        token: "validtoken",
      });
    });
  });

  describe("Edge cases", () => {
    it("should return 401 when user is not found", async () => {
      // Arrange
      User.find.mockResolvedValue([]);

      // Act
      await validateUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return 401 when password is incorrect", async () => {
      // Arrange
      User.find.mockResolvedValue([mockUser]);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await validateUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return 400 when an error occurs", async () => {
      // Arrange
      User.find.mockRejectedValue(new Error("Database error"));

      // Act
      await validateUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });
});

// End of unit tests for: validateUser
