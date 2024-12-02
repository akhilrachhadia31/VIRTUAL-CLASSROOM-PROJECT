// Unit tests for: resetPassword

import bcryptjs from "bcryptjs";
import { resetPassword } from "../../controller/auth.controller.js";
import { sendResetSuccessEmail } from "../../mailtrap/mailer.js";
import { User } from "../../models/user.model.js";

jest.mock("../../models/user.model.js");
jest.mock("../../mailtrap/mailer.js");
jest.mock("bcryptjs");

describe("resetPassword() resetPassword method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "NewPassword123!",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockClear();
    bcryptjs.hash.mockClear();
    sendResetSuccessEmail.mockClear();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should reset the password successfully when valid email and password are provided", async () => {
      // Mocking User.findOne to return a user object
      const mockUser = { 
        email: "test@example.com", 
        save: jest.fn() 
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mocking bcryptjs.hash to return a hashed password
      bcryptjs.hash.mockResolvedValue("hashedPassword");

      await resetPassword(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcryptjs.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(mockUser.password).toBe("hashedPassword");
      expect(mockUser.save).toHaveBeenCalled();
      expect(sendResetSuccessEmail).toHaveBeenCalledWith(mockUser.email);  // Correctly passing email
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Password reset successful",
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return an error if the user is not found", async () => {
      // Mocking User.findOne to return null
      User.findOne.mockResolvedValue(null);

      await resetPassword(req, res);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid or expired reset token",
      });
    });

    it("should handle errors during password hashing", async () => {
      // Mocking User.findOne to return a user object
      const mockUser = { save: jest.fn() };
      User.findOne.mockResolvedValue(mockUser);

      // Mocking bcryptjs.hash to throw an error
      bcryptjs.hash.mockRejectedValue(new Error("Hashing error"));

      await resetPassword(req, res);

      // Assertions
      expect(bcryptjs.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Hashing error",
      });
    });

    it("should handle errors during user save", async () => {
      // Mocking User.findOne to return a user object
      const mockUser = {
        save: jest.fn().mockRejectedValue(new Error("Save error")),
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mocking bcryptjs.hash to return a hashed password
      bcryptjs.hash.mockResolvedValue("hashedPassword");

      await resetPassword(req, res);

      // Assertions
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Save error",
      });
    });
  });
});

