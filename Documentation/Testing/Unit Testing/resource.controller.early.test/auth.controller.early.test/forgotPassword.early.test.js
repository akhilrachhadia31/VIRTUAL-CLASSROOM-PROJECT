// Unit tests for: forgotPassword

import { forgotPassword } from "../../controller/auth.controller.js";
import { sendPasswordResetEmail } from "../../mailtrap/mailer.js";
import { User } from "../../models/user.model.js";

jest.mock("../../models/user.model.js");
jest.mock("../../mailtrap/mailer.js");

describe("forgotPassword() forgotPassword method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockClear();
    sendPasswordResetEmail.mockClear();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should send a password reset email if the user is found", async () => {
      // Arrange: Mock User.findOne to return a user
      User.findOne.mockResolvedValue({
        email: "test@example.com",
        save: jest.fn(),
      });

      // Act: Call the forgotPassword function
      await forgotPassword(req, res);

      // Assert: Check if the email was sent and response was correct
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        "test@example.com",
        "http://localhost/3000/reset-password",
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Password reset link sent to your email",
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return an error if the user is not found", async () => {
      // Arrange: Mock User.findOne to return null
      User.findOne.mockResolvedValue(null);

      // Act: Call the forgotPassword function
      await forgotPassword(req, res);

      // Assert: Check if the correct error response was returned
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should handle errors thrown during execution", async () => {
      // Arrange: Mock User.findOne to throw an error
      User.findOne.mockRejectedValue(new Error("Database error"));

      // Act: Call the forgotPassword function
      await forgotPassword(req, res);

      // Assert: Check if the correct error response was returned
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });
});

// End of unit tests for: forgotPassword
