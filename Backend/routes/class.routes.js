import { Router } from "express";
import { deleteClass, getClasses, insertClass, updateClass } from "../controller/class.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticateToken)
router.route('/')
    .post(insertClass)

router.route('/student').post(getClasses)

router.route('/update/:id')
    .put(updateClass)

router.route('/delete/:id')
    .delete(deleteClass);

export default router;
