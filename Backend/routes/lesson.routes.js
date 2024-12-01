import { Router } from "express";
import { deleteLesson, getLessons, insertLesson, updateLesson } from "../controller/lesson.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticateToken)
router.route("/").post(getLessons)
router.route("/upload").post(insertLesson)
router.route("/update/:id").put(updateLesson);
router.route("/delete/:id").delete(deleteLesson);

export default router;