// Unit tests for: deleteAnnouncement

import mongoose from "mongoose";
import { Class } from "../../models/class.model.js";
import { deleteAnnouncement } from "../announcement.controller";

jest.mock("../../models/class.model.js");

describe("deleteAnnouncement() deleteAnnouncement method", () => {
  let mockClass;
  let mockAnnouncement;
  let mockUser;

  beforeEach(() => {
    // Setup mock data
    mockAnnouncement = {
      _id: new mongoose.Types.ObjectId(),
    };

    mockUser = {
      _id: new mongoose.Types.ObjectId(),
    };

    mockClass = {
      subject: "Math",
      teacher: mockUser._id,
      announcements: {
        id: jest.fn().mockReturnValue(mockAnnouncement),
        pull: jest.fn(),
      },
      save: jest.fn(),
    };

    Class.findOne = jest.fn();
  });

  
  describe("Edge cases", () => {
    it("should throw an error if the class is not found", async () => {
      // Arrange
      Class.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        deleteAnnouncement("Math", mockAnnouncement._id, mockUser),
      ).rejects.toThrow("Class not found");
    });

    it("should throw an error if the announcement is not found", async () => {
      // Arrange
      mockClass.announcements.id.mockReturnValue(null);
      Class.findOne.mockResolvedValue(mockClass);

      // Act & Assert
      await expect(
        deleteAnnouncement("Math", mockAnnouncement._id, mockUser),
      ).rejects.toThrow("Announcement not found");
    });

    it("should throw an error if the user is not the class teacher", async () => {
      // Arrange
      const anotherUser = { _id: new mongoose.Types.ObjectId() };
      Class.findOne.mockResolvedValue(mockClass);

      // Act & Assert
      await expect(
        deleteAnnouncement("Math", mockAnnouncement._id, anotherUser),
      ).rejects.toThrow("Only the class teacher can delete announcements");
    });
  });
});

// End of unit tests for: deleteAnnouncement
