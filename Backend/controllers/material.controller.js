import { Class } from "../models/class.model.js"
import { Material } from "../models/material.model.js"

const getMaterial = async (req, res) => {
    try {
        const rclass = await Class.findOne({ subject: req.params.subject });

        if (!rclass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const materials = await Material.find({ class: rclass._id });

        res.status(200).json({
            success: true,
            data: materials
        });
    } catch (error) {
        console.error("Error fetching materials:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching materials"
        });
    }
};

const insertMaterial = async (req, res) => {
    try {
        const updateClass = await Class.findOne({ subject: req.body.subject });
        const material = new Material({
            title: req.body.title,
            description: req.body.description,
            class: updateClass._id,
            file: req.body.file,
        })

        const newMaterial = await material.save()
        updateClass.materials.push(newMaterial._id)
        await updateClass.save()
        res.status(201).json(newMaterial)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const updateMaterial = async (req, res) => {
    try {
        const newMaterial = await Material.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json(newMaterial)
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

const deleteMaterial = async (req, res) => {
    try {
        const deletedMaterial = await Material.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedMaterial)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export { getMaterial, insertMaterial, updateMaterial, deleteMaterial };