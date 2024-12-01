import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subject: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    materials: [
      {
        type: Schema.Types.ObjectId,
        ref: "Material",
      },
    ],
    announcements: [{
        type: Schema.Types.ObjectId,
        ref: "Announcement",
    }],
  },
  { timestamps: true }
);

export const Class = mongoose.model("Class", classSchema);