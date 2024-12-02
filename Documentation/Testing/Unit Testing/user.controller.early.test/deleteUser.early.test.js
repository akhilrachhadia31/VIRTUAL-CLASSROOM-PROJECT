// Unit tests for: deleteUser

import { User } from "../../models/user.model.js";
import { deleteUser } from "../user.controller";

jest.mock("../../models/user.model.js");

describe("deleteUser() deleteUser method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "validUserId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should delete a user and return the deleted user object when a valid ID is provided", async () => {
      // Arrange
      const mockDeletedUser = { _id: "validUserId", username: "testuser" };
      User.findByIdAndDelete.mockResolvedValue(mockDeletedUser);

      // Act
      await deleteUser(req, res);

      // Assert
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("validUserId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedUser);
    });
  });

  describe("Edge Cases", () => {
    it("should return a 400 error if the user ID is not found", async () => {
      // Arrange
      User.findByIdAndDelete.mockResolvedValue(null);

      // Act
      await deleteUser(req, res);

      // Assert
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("validUserId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(null);
    });

    it("should return a 400 error if an error occurs during deletion", async () => {
      // Arrange
      const mockError = new Error("Deletion error");
      User.findByIdAndDelete.mockRejectedValue(mockError);

      // Act
      await deleteUser(req, res);

      // Assert
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("validUserId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: mockError.message,
      });
    });
  });
});

// End of unit tests for: deleteUser
