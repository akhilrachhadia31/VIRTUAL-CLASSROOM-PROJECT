import { Lesson } from "../models/lesson.model.js";
import { Resource } from "../models/resource.model.js"

const getResources = async (req, res) => {
    try {
        const lesson_id = req.params.id;
        const lesson = await Lesson.findById(lesson_id);
        console.log(lesson)
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }
        const resources = await Promise.all(
            lesson.reference.map(async (resource) => {
                const res = await Resource.findById(resource);
                return res;
            })
        );

        res.status(200).json(resources);

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: "Invalid lesson ID format"
            });
        }
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching resources",
            error: error.message
        });
    }
};

const insertResource = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.body.lessonId);
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }
        const resource = new Resource({
            lesson: req.body.lessonId,
            title: req.body.title,
            description: req.body.description,
            videolink: req.body.videolink,
        });

        const savedResource = await resource.save();
        lesson.reference.push(savedResource._id);
        await lesson.save();
        
        res.status(201).json(savedResource);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateResource = async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json(updatedResource)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const deleteResource = async (req, res) => {

    try {
        const lesson = await Lesson.findById(req.body.lessonId);
        lesson.reference = lesson.reference.filter(resource => resource.toString() !== req.params.id);
        await lesson.save();
        const deletedResource = await Resource.findByIdAndDelete(req.params.id)
        console.log("in delete", req.params.id,req.body.lessonId);
        res.status(200).json(deletedResource)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export { getResources, insertResource, deleteResource, updateResource };