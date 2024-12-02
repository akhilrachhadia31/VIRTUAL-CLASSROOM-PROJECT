// Unit tests for: insertUser

import bcrypt from "bcryptjs";
import { Class } from "../../models/class.model.js";
import { User } from "../../models/user.model.js";
import sendEmail from "../../utils/emailService.js";
import { insertUser } from "../user.controller";

jest.mock("../../models/user.model.js");
jest.mock("../../models/class.model.js");
jest.mock("../../utils/emailService.js");
jest.mock("bcryptjs");

describe("insertUser() insertUser method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        gender: "male",
        type: "student",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    bcrypt.hash.mockResolvedValue("hashedPassword");
    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: "userId",
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
        gender: "male",
        type: "student",
        classCodes: [],
      }),
    }));
    Class.find.mockResolvedValue([
      { code: "C101", subject: "Math" },
      { code: "C102", subject: "Science" },
    ]);
    sendEmail.mockResolvedValue(true);
  });

  describe("Happy Paths", () => {
    it("should create a new user and send an email with class details", async () => {
      // Test that a user is created and an email is sent
      await insertUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 8);
      expect(User).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
        gender: "male",
        type: "student",
        classCodes: [],
      });
      expect(sendEmail).toHaveBeenCalledWith(
        "test@example.com",
        "Information Regarding Joining the Classes",
        "Please find the details of the available classes below.",
        expect.stringContaining("<h2>Available Classes</h2><ul>"),
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          email: "test@example.com",
        }),
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle errors when saving a user fails", async () => {
      // Test error handling when user saving fails
      User.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error("Database error")),
      }));

      await insertUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(Error),
      });
    });

    it("should handle errors when fetching classes fails", async () => {
      // Test error handling when fetching classes fails
      Class.find.mockRejectedValue(new Error("Class fetch error"));

      await insertUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(Error),
      });
    });

    it("should handle errors when sending email fails", async () => {
      // Test error handling when sending email fails
      sendEmail.mockRejectedValue(new Error("Email service error"));

      await insertUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(Error),
      });
    });
  });
});

// End of unit tests for: insertUser
