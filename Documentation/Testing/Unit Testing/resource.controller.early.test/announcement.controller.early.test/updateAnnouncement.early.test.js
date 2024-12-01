// Unit tests for: updateAnnouncement

import { Announcement } from "../../models/announcement.model.js";
import { updateAnnouncement } from "../announcement.controller";

jest.mock("../../models/announcement.model.js");

describe("updateAnnouncement() updateAnnouncement method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "announcementId" },
      body: { content: "New reply content", user: "userId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should update the announcement with a new reply and return the updated announcement", async () => {
      // Arrange
      const updatedAnnouncement = {
        _id: "announcementId",
        replies: [{ user: "userId", content: "New reply content" }],
      };
      Announcement.findByIdAndUpdate.mockResolvedValue(updatedAnnouncement);

      // Act
      await updateAnnouncement(req, res);

      // Assert
      expect(Announcement.findByIdAndUpdate).toHaveBeenCalledWith(
        "announcementId",
        {
          $push: {
            replies: {
              user: "userId",
              content: "New reply content",
            },
          },
        },
        { new: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedAnnouncement);
    });
  });

  describe("Edge Cases", () => {
    it("should return 404 if the announcement is not found", async () => {
      // Arrange
      Announcement.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateAnnouncement(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Announcement not found",
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      // Arrange
      Announcement.findByIdAndUpdate.mockRejectedValue(
        new Error("Database error"),
      );

      // Act
      await updateAnnouncement(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    it("should handle missing content in the request body gracefully", async () => {
      // Arrange
      req.body.content = undefined;
      const updatedAnnouncement = {
        _id: "announcementId",
        replies: [{ user: "userId", content: undefined }],
      };
      Announcement.findByIdAndUpdate.mockResolvedValue(updatedAnnouncement);

      // Act
      await updateAnnouncement(req, res);

      // Assert
      expect(Announcement.findByIdAndUpdate).toHaveBeenCalledWith(
        "announcementId",
        {
          $push: {
            replies: {
              user: "userId",
              content: undefined,
            },
          },
        },
        { new: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedAnnouncement);
    });

    it("should handle missing user in the request body gracefully", async () => {
      // Arrange
      req.body.user = undefined;
      const updatedAnnouncement = {
        _id: "announcementId",
        replies: [{ user: undefined, content: "New reply content" }],
      };
      Announcement.findByIdAndUpdate.mockResolvedValue(updatedAnnouncement);

      // Act
      await updateAnnouncement(req, res);

      // Assert
      expect(Announcement.findByIdAndUpdate).toHaveBeenCalledWith(
        "announcementId",
        {
          $push: {
            replies: {
              user: undefined,
              content: "New reply content",
            },
          },
        },
        { new: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedAnnouncement);
    });
  });
});

// End of unit tests for: updateAnnouncement
