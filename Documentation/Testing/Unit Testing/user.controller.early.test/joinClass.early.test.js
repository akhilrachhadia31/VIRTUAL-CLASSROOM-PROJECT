// Unit tests for: joinClass

import { Class } from "../../models/class.model.js";
import { User } from "../../models/user.model.js";
import { joinClass } from "../user.controller";

jest.mock("../../models/user.model.js");
jest.mock("../../models/class.model.js");

describe("joinClass() joinClass method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Paths", () => {
    it("should successfully join a class when userId and classCode are valid", async () => {
      req.body = { userId: "validUserId", classCode: "validClassCode" };

      const mockUser = {
        _id: "validUserId",
        classCodes: [],
        save: jest.fn().mockResolvedValue(true),
      };

      const mockClass = {
        code: "validClassCode",
        students: [],
        save: jest.fn().mockResolvedValue(true),
      };

      User.findById.mockResolvedValue(mockUser);
      Class.findOne.mockResolvedValue(mockClass);

      await joinClass(req, res);

      expect(User.findById).toHaveBeenCalledWith("validUserId");
      expect(Class.findOne).toHaveBeenCalledWith({ code: "validClassCode" });
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockClass.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class joined successfully",
        success: true,
        code: "validClassCode",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return 400 if userId or classCode is missing", async () => {
      req.body = { userId: "", classCode: "" };

      await joinClass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing userId or classCode",
        success: false,
      });
    });

    it("should return 404 if class is not found", async () => {
      req.body = { userId: "validUserId", classCode: "invalidClassCode" };

      Class.findOne.mockResolvedValue(null);

      await joinClass(req, res);

      expect(Class.findOne).toHaveBeenCalledWith({ code: "invalidClassCode" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Class not found",
        success: false,
      });
    });

    it("should return 404 if user is not found", async () => {
      req.body = { userId: "invalidUserId", classCode: "validClassCode" };

      const mockClass = {
        code: "validClassCode",
        students: [],
      };

      Class.findOne.mockResolvedValue(mockClass);
      User.findById.mockResolvedValue(null);

      await joinClass(req, res);

      expect(User.findById).toHaveBeenCalledWith("invalidUserId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
        success: false,
      });
    });

    it("should return 400 if user is already in the class", async () => {
      req.body = { userId: "validUserId", classCode: "validClassCode" };

      const mockUser = {
        _id: "validUserId",
        classCodes: ["validClassCode"],
      };

      const mockClass = {
        code: "validClassCode",
        students: [],
      };

      User.findById.mockResolvedValue(mockUser);
      Class.findOne.mockResolvedValue(mockClass);

      await joinClass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already in this class",
        success: false,
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      req.body = { userId: "validUserId", classCode: "validClassCode" };

      User.findById.mockRejectedValue(new Error("Internal server error"));

      await joinClass(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Internal server error" }),
      );
    });
  });
});

// End of unit tests for: joinClass
