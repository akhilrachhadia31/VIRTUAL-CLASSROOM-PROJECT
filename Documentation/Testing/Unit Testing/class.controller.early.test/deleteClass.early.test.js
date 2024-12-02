import mongoose from "mongoose";
import { Announcement } from "../../models/announcement.model.js";
import { Class } from "../../models/class.model.js";
import { Lesson } from "../../models/lesson.model.js";
import { Material } from "../../models/material.model.js";
import { Resource } from "../../models/resource.model.js";
import { User } from "../../models/user.model.js";
import { deleteClass } from "../class.controller";

jest.mock("mongoose", () => ({
  startSession: jest.fn().mockResolvedValue({
    startTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    endSession: jest.fn(),
  }),
}));

jest.mock("../../models/class.model.js");
jest.mock("../../models/user.model.js");
jest.mock("../../models/lesson.model.js");
jest.mock("../../models/material.model.js");
jest.mock("../../models/resource.model.js");
jest.mock("../../models/announcement.model.js");

describe("deleteClass() method", () => {
  let req, res, session;

  beforeEach(() => {
    req = {
      params: { id: "classId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    session = mongoose.startSession();
  });

  describe("Happy Path", () => {
    it("should delete the class and all related data successfully", async () => {
      // Arrange
      const mockClass = {
        _id: "classId",
        code: "CLASSCODE",
        students: ["studentId1", "studentId2"],
        teacher: "teacherId",
        announcements: ["announcementId1", "announcementId2"],
      };
      const mockLessons = [{ _id: "lessonId1" }, { _id: "lessonId2" }];
      const mockAnnouncements = [
        { _id: "announcementId1" },
        { _id: "announcementId2" },
      ];

      Class.findById.mockResolvedValue(mockClass);
      User.updateMany.mockResolvedValue({});
      Lesson.find.mockResolvedValue(mockLessons);
      Resource.deleteMany.mockResolvedValue({});
      Lesson.deleteMany.mockResolvedValue({});
      Material.deleteMany.mockResolvedValue({});
      Announcement.find.mockResolvedValue(mockAnnouncements);
      Announcement.findByIdAndDelete.mockResolvedValue({});
      Class.findByIdAndDelete.mockResolvedValue({});

      // Act
      await deleteClass(req, res);

      // Assert
      expect(Class.findById).toHaveBeenCalledWith("classId", { session });
      expect(User.updateMany).toHaveBeenCalledWith(
        { _id: { $in: ["studentId1", "studentId2", "teacherId"] } },
        { $pull: { classCodes: "CLASSCODE" } },
        { session },
      );
      expect(Resource.deleteMany).toHaveBeenCalledWith(
        { lesson: { $in: ["lessonId1", "lessonId2"] } },
        { session },
      );
      expect(Lesson.deleteMany).toHaveBeenCalledWith(
        { class: "classId" },
        { session },
      );
      expect(Material.deleteMany).toHaveBeenCalledWith(
        { class: "classId" },
        { session },
      );
      expect(Announcement.findByIdAndDelete).toHaveBeenCalledTimes(2);
      expect(Class.findByIdAndDelete).toHaveBeenCalledWith("classId", {
        session,
      });
      expect(session.commitTransaction).toHaveBeenCalled();
      expect(session.endSession).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Class and all related data deleted successfully",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return 404 if class is not found", async () => {
      // Arrange
      Class.findById.mockResolvedValue(null);

      // Act
      await deleteClass(req, res);

      // Assert
      expect(Class.findById).toHaveBeenCalledWith("classId", { session });
      expect(session.abortTransaction).toHaveBeenCalled();
      expect(session.endSession).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Class not found",
      });
    });

    it("should return 500 if there is an error during deletion", async () => {
      // Arrange
      Class.findById.mockRejectedValue(new Error("Database error"));

      // Act
      await deleteClass(req, res);

      // Assert
      expect(session.abortTransaction).toHaveBeenCalled();
      expect(session.endSession).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred while deleting the class and related data",
      });
    });

    it("should handle error in User.updateMany gracefully", async () => {
      // Arrange
      const mockClass = {
        _id: "classId",
        code: "CLASSCODE",
        students: ["studentId1", "studentId2"],
        teacher: "teacherId",
        announcements: ["announcementId1", "announcementId2"],
      };

      Class.findById.mockResolvedValue(mockClass);
      User.updateMany.mockRejectedValue(new Error("Error updating users"));

      // Act
      await deleteClass(req, res);

      // Assert
      expect(session.abortTransaction).toHaveBeenCalled();
      expect(session.endSession).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred while deleting the class and related data",
      });
    });

    it("should handle error in deleting related data", async () => {
      // Arrange
      const mockClass = {
        _id: "classId",
        code: "CLASSCODE",
        students: ["studentId1", "studentId2"],
        teacher: "teacherId",
        announcements: ["announcementId1", "announcementId2"],
      };

      Class.findById.mockResolvedValue(mockClass);
      Lesson.find.mockResolvedValue([{ _id: "lessonId1" }]);
      Resource.deleteMany.mockRejectedValue(new Error("Error deleting resources"));

      // Act
      await deleteClass(req, res);

      // Assert
      expect(session.abortTransaction).toHaveBeenCalled();
      expect(session.endSession).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred while deleting the class and related data",
      });
    });
  });
});
