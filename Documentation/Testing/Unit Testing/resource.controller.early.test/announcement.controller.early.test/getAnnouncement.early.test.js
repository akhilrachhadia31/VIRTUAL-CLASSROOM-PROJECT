// Unit tests for: getAnnouncement

import { Announcement } from "../../models/announcement.model.js";
import { Class } from "../../models/class.model.js";
import { getAnnouncement } from "../announcement.controller";

jest.mock("../../models/announcement.model.js");
jest.mock("../../models/class.model.js");

describe("getAnnouncement() getAnnouncement method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        subject: "Math",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return announcements for a valid class", async () => {
      // Arrange
      const mockClass = {
        announcements: ["announcement1", "announcement2"],
      };
      const mockAnnouncements = [
        { _id: "announcement1", createdBy: "user1", replies: [] },
        { _id: "announcement2", createdBy: "user2", replies: [] },
      ];

      Class.findOne.mockResolvedValue(mockClass);
      Announcement.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockAnnouncements),
      });

      // Act
      await getAnnouncement(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(Announcement.find).toHaveBeenCalledWith({
        _id: { $in: mockClass.announcements },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        announcements: mockAnnouncements,
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return 404 if class is not found", async () => {
      // Arrange
      Class.findOne.mockResolvedValue(null);

      // Act
      await getAnnouncement(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Class not found" });
    });

    it("should handle errors and return 500 status", async () => {
      // Arrange
      const errorMessage = "Database error";
      Class.findOne.mockRejectedValue(new Error(errorMessage));

      // Act
      await getAnnouncement(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});

// End of unit tests for: getAnnouncement
