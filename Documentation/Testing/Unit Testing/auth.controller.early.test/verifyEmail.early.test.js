// Unit tests for: verifyEmail

import { verifyEmail } from "../../controller/auth.controller.js";
import { sendWelcomeEmail } from "../../mailtrap/mailer.js";
import { otp_user } from "../../models/otp-checker.js";
import { User } from "../../models/user.model.js";

jest.mock("../../models/user.model.js");
jest.mock("../../models/otp-checker.js");
jest.mock("../../mailtrap/mailer.js");

describe("verifyEmail() verifyEmail method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        verificationToken: "123456",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should verify the email and create a new user when the verification token is valid", async () => {
      // Arrange
      const mockUser = {
        email: "test@example.com",
        password: "hashedpassword",
        type: "user",
        username: "testuser",
        classCodes: [],
        isVerified: false,
        verificationToken: "123456",
        verificationTokenExpiresAt: Date.now() + 10000,
        _doc: {
          email: "test@example.com",
          username: "testuser",
        },
      };

      otp_user.findOne.mockResolvedValue(mockUser);
      User.prototype.save = jest.fn().mockResolvedValue({});
      otp_user.deleteOne.mockResolvedValue({});
      sendWelcomeEmail.mockResolvedValue({});

      // Act
      await verifyEmail(req, res);

      // Assert
      expect(otp_user.findOne).toHaveBeenCalledWith({
        verificationToken: "123456",
        verificationTokenExpiresAt: expect.any(Object),
      });
      expect(User.prototype.save).toHaveBeenCalled();
      expect(otp_user.deleteOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(sendWelcomeEmail).toHaveBeenCalledWith("test@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Email verified successfully",
        user: {
          email: "test@example.com",
          username: "testuser",
          password: undefined,
        },
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return an error if the verification token is invalid or expired", async () => {
      // Arrange
      otp_user.findOne.mockResolvedValue(null);

      // Act
      await verifyEmail(req, res);

      // Assert
      expect(otp_user.findOne).toHaveBeenCalledWith({
        verificationToken: "123456",
        verificationTokenExpiresAt: expect.any(Object),
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid or expired verification code",
      });
    });

    it("should handle server errors gracefully", async () => {
      // Arrange
      otp_user.findOne.mockRejectedValue(new Error("Database error"));

      // Act
      await verifyEmail(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });
});

// End of unit tests for: verifyEmail
