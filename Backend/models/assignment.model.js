import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    class: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Class'
    },
    files: [{
        type: String,
    }],
    submission: [
        {
            student: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                unique: true,
                required: true,
            },
            work: {
                type: String,
                required: true,
            },
            submitdate: {
                type: Date,
                default: Date.now,                
            }
        }
    ],
})

export const Assignment = mongoose.model('Assignment', assignmentSchema);