// Unit tests for: createAnnouncement

import { Announcement } from "../../models/announcement.model.js";
import { Class } from "../../models/class.model.js";
import { createAnnouncement } from "../announcement.controller";

jest.mock("../../models/announcement.model.js");
jest.mock("../../models/class.model.js");

describe("createAnnouncement() createAnnouncement method", () => {
  let req, res, mockClass, mockAnnouncement;

  beforeEach(() => {
    req = {
      body: {
        title: "Test Announcement",
        content: "This is a test announcement.",
        subject: "Math",
        user: { _id: "teacherId" },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockClass = {
      teacher: { equals: jest.fn().mockReturnValue(true) },
      announcements: [],
      save: jest.fn(),
    };

    mockAnnouncement = {
      save: jest.fn(),
    };

    Class.findOne.mockResolvedValue(mockClass);
    Announcement.mockImplementation(() => mockAnnouncement);
  });

  describe("Happy Paths", () => {
    it("should create an announcement successfully when all conditions are met", async () => {
      // Test that the function creates an announcement successfully
      await createAnnouncement(req, res);

      expect(Class.findOne).toHaveBeenCalledWith({ subject: "Math" });
      expect(mockClass.teacher.equals).toHaveBeenCalledWith("teacherId");
      expect(Announcement).toHaveBeenCalledWith({
        title: "Test Announcement",
        content: "This is a test announcement.",
        createdBy: "teacherId",
      });
      expect(mockAnnouncement.save).toHaveBeenCalled();
      expect(mockClass.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe("Edge Cases", () => {
    it("should return 400 if the class is not found", async () => {
      // Test that the function returns an error if the class is not found
      Class.findOne.mockResolvedValue(null);

      await createAnnouncement(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Class not found" });
    });

    it("should return 400 if the user is not the class teacher", async () => {
      // Test that the function returns an error if the user is not the class teacher
      mockClass.teacher.equals.mockReturnValue(false);

      await createAnnouncement(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Only the class teacher can create announcements",
      });
    });

    it("should handle errors during announcement creation", async () => {
      // Test that the function handles errors during announcement creation
      mockAnnouncement.save.mockRejectedValue(new Error("Database error"));

      await createAnnouncement(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});

// End of unit tests for: createAnnouncement
