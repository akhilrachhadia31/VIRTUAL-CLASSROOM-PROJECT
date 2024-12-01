// Unit tests for: insertAssignment

import { Assignment } from "../../models/assignment.model.js";
import { Class } from "../../models/class.model.js";
import { insertAssignment } from "../assignment.controller";

jest.mock("../../models/assignment.model.js");
jest.mock("../../models/class.model.js");

describe("insertAssignment() insertAssignment method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: "Test Assignment",
        description: "This is a test assignment",
        dueDate: "2023-12-31",
        subject: "Math",
        files: ["file1.pdf", "file2.pdf"],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should successfully insert an assignment when class is found", async () => {
      // Arrange
      const mockClass = { _id: "classId123" };
      Class.findOne.mockResolvedValue(mockClass);

      const mockAssignment = {
        save: jest.fn().mockResolvedValue({
          _id: "assignmentId123",
          ...req.body,
          class: mockClass._id,
        }),
      };
      Assignment.mockImplementation(() => mockAssignment);

      // Act
      await insertAssignment(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: req.body.subject });
      expect(Assignment).toHaveBeenCalledWith({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        class: mockClass._id,
        files: req.body.files,
      });
      expect(mockAssignment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        assignment: expect.objectContaining({
          _id: "assignmentId123",
          title: req.body.title,
          description: req.body.description,
          dueDate: req.body.dueDate,
          class: mockClass._id,
          files: req.body.files,
        }),
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return 404 if class is not found", async () => {
      // Arrange
      Class.findOne.mockResolvedValue(null);

      // Act
      await insertAssignment(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: req.body.subject });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Class not found",
      });
    });

    it("should handle errors during assignment insertion", async () => {
      // Arrange
      const mockClass = { _id: "classId123" };
      Class.findOne.mockResolvedValue(mockClass);

      const mockError = new Error("Database error");
      const mockAssignment = {
        save: jest.fn().mockRejectedValue(mockError),
      };
      Assignment.mockImplementation(() => mockAssignment);

      // Act
      await insertAssignment(req, res);

      // Assert
      expect(Class.findOne).toHaveBeenCalledWith({ subject: req.body.subject });
      expect(mockAssignment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: mockError.message,
      });
    });
  });
});

// End of unit tests for: insertAssignment
