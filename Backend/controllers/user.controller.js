import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Class } from "../models/class.model.js";
import sendEmail from "../utils/emailService.js";

const insertUser = async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 8)
        .then(function (hash) {
            return hash;
        });
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword.toString(),
        gender: req.body.gender,
        type: req.body.type,
        classCodes: [],
    })
    try {
        const newUser = await user.save();
        const classes = await Class.find({}, 'code subject');

        let classDetails = "<h2>Available Classes</h2><ul>";
        classes.forEach(cls => {
            classDetails += `<li>Code: <strong>${cls.code}</strong> - Subject:<strong> ${cls.subject}</strong></li>`;
        });
        classDetails += "</ul>";

        await sendEmail(newUser.email, "Information Regarding Joining the Classes", "Please find the details of the available classes below.", classDetails);

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error)
        res.status(400).json({
            success: false,
            message: error
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedUser)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // console.log(user)
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const validateUser = async (req, res) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET_KEY;
        const { username, password } = req.body;
        const users = await User.find();
        const user = users.find(u => u.username === username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

const joinClass = async (req, res) => {
    const { userId, classCode } = req.body;

    if (!userId || !classCode) {
        return res.status(400).json({ message: 'Missing userId or classCode', success: false });
    }

    try {
        const classDocument = await Class.findOne({ code: classCode });
        if (!classDocument) {
            return res.status(404).json({ message: 'Class not found', success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        if (user.classCodes.includes(classCode)) {
            return res.status(400).json({ message: 'User already in this class', success: false });
        }
        console.log("before join")

        user.classCodes.push(classCode);
        await user.save();
        console.log("after join")

        classDocument.students.push(user._id);
        await classDocument.save();
        console.log("after class")


        res.status(200).json({ message: 'Class joined successfully', success: true,code: classCode });
    } catch (error) {
        console.error('Error in joinClass:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await User.find({ type: 'student' });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Error fetching data' });
    }
};

export {
    insertUser,
    deleteUser,
    updateUser,
    getUser,
    validateUser,
    joinClass,
    getStudents,
}