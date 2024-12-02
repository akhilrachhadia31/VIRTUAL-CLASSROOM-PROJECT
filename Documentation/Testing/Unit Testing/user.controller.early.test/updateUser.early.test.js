// Unit tests for: updateUser

import { User } from "../../models/user.model.js";
import { updateUser } from "../user.controller";

jest.mock("../../models/user.model.js");

describe("updateUser() updateUser method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "123" },
      body: { username: "newUsername", email: "newEmail@example.com" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should update a user successfully and return the updated user", async () => {
      // Arrange
      const updatedUser = {
        _id: "123",
        username: "newUsername",
        email: "newEmail@example.com",
      };
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Act
      await updateUser(req, res);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, {
        new: true,
        runValidators: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe("Edge Cases", () => {
    it("should return a 400 error if the user ID is invalid", async () => {
      // Arrange
      User.findByIdAndUpdate.mockRejectedValue(new Error("Invalid user ID"));

      // Act
      await updateUser(req, res);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, {
        new: true,
        runValidators: true,
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid user ID",
      });
    });

    it("should return a 400 error if the update data is invalid", async () => {
      // Arrange
      req.body = { email: "invalidEmail" }; // Assuming email validation fails
      User.findByIdAndUpdate.mockRejectedValue(new Error("Validation failed"));

      // Act
      await updateUser(req, res);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, {
        new: true,
        runValidators: true,
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
      });
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange
      User.findByIdAndUpdate.mockRejectedValue(new Error("Unexpected error"));

      // Act
      await updateUser(req, res);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, {
        new: true,
        runValidators: true,
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unexpected error",
      });
    });
  });
});

// End of unit tests for: updateUser
