import { Assignment } from "../models/assignment.model.js";
import { Class } from "../models/class.model.js";

const insertAssignment = async (req, res) => {
    try {
        const assignment_class = await Class.findOne({ subject: req.body.subject });
        if (!assignment_class) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        console.log(req.body)
        const assignment = new Assignment({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            class: assignment_class._id,
            files: req.body.files,
        });

        const newAssignment = await assignment.save();
        res.status(201).json({ success: true, assignment: newAssignment });
    } catch (error) {
        console.error("Error in insertAssignment:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAssignments = async (req, res) => {
    try {
        const subject = await Class.findOne({ subject: req.params.subject });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Class not found for the given subject"
            });
        }
        const assignments = await Assignment.find({ class: subject._id })
            .populate('class', 'subject')
            .sort({ dueDate: 1 });
        console.log(`Found ${assignments.length} assignments for subject: ${subject.subject}`);

        res.status(200).json({
            success: true,
            data: assignments
        });
    } catch (error) {
        console.error("Error in getAssignments:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching assignments",
            error: error.message
        });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedAssignment)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const updateAssignment = async (req, res) => {
    try {
        const updatedAssignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updatedAssignment)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, user, file } = req.body;
        const userId = user._id;
        const work = file;
        console.log(assignmentId, userId,work);

        const submittedAssignment = await Assignment.findByIdAndUpdate(
            assignmentId,
            {
                $push: {
                    "submission": {
                        $each: [{
                            student: userId,
                            work: work
                        }],
                        $setOnInsert: { submission: [] }
                    }
                }
            },
            { 
                new: true, 
                runValidators: true, 
                upsert: true, 
                setDefaultsOnInsert: true 
            }
        );

        if (!submittedAssignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
        }

        res.status(200).json({
            success: true,
            data: submittedAssignment
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted this assignment"
            });
        }
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const submitWorkDetails = async (req, res) => {
    try {
        const { subject } = req.params;

        const cls = await Class.findOne({ subject }).exec();
        if (!cls) {
            return res.status(404).json({
                success: false,
                message: "Class not found for the given subject"
            });
        }

        const [assignments, populatedClass] = await Promise.all([
            Assignment.find({ class: cls._id }).exec(),
            Class.findById(cls._id).populate('students').exec()
        ]);

        res.status(200).json({
            success: true,
            assignments,
            students: populatedClass.students
        });
    } catch (error) {
        console.error("Error in submitWorkDetails:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching assignments and students",
            error: error.message
        });
    }
};

export { insertAssignment,submitWorkDetails, getAssignments,submitAssignment, deleteAssignment, updateAssignment }