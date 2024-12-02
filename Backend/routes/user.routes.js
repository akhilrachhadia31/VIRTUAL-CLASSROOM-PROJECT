import { Router } from "express";
import { deleteUser, getUser, insertUser, joinClass, validateUser,getStudents } from "../controller/user.controller.js";

const router = Router();

router.route("/:id").get(getUser);
router.route("/").get(getStudents);
router.route("/").post(insertUser);
router.route("/joinclass").post(joinClass);
router.route("/:id").delete(deleteUser);
router.route("/validate").post(validateUser);

export default router;