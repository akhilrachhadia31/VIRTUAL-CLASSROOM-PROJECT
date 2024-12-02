import { Class } from "../models/class.model.js"
import { Lesson } from "../models/lesson.model.js"

const getLessons = async (req, res) => {
    try {
        const subject = req.body.subject;
        // console.log(subject);
        const classes = await Class.find({ subject: subject });

        if (classes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No classes found for this subject"
            });
        }

        const lessonIds = classes.flatMap(classDoc => classDoc.lessons);

        const lectures = await Promise.all(lessonIds.map(async (id) => {
            const lecture = await Lesson.findById(id);
            if (!lecture) {
                throw new Error(`Lesson with id ${id} not found`);
            }
            return lecture;
        }));

        res.status(200).json(lectures);
    } catch (error) {
        console.error("Error fetching lectures:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching lectures"
        });
    }
};

const insertLesson = async (req, res) => {
    try {
        const classname = req.body.subject;
        const classDoc = await Class.findOne({ subject: classname });

        if (!classDoc) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const lesson = new Lesson({
            class: classDoc._id,  
            title: req.body.title,
            reference: [],
        });

        await lesson.save();  

        classDoc.lessons.push(lesson._id);
        await classDoc.save();  

        res.status(201).json(lesson);
    } catch (error) {
        console.error('Error inserting lesson:', error);  
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateLesson = async (req, res) => {
    try {
        const newLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json(newLesson)
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

const deleteLesson = async (req, res) => {
    try {
        const deletedLesson = await Lesson.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedLesson)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export { getLessons, insertLesson, updateLesson, deleteLesson };