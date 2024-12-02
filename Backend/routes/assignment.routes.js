import {Router} from 'express';
import { deleteAssignment, getAssignments, insertAssignment,submitAssignment, submitWorkDetails, updateAssignment } from '../controller/assignment.controller.js';
import authenticateToken from '../middlewares/auth.middleware.js';

const router = Router();
// router.use(authenticateToken)

router.route('/:subject').get(getAssignments);
router.route('/insert').post(insertAssignment);
router.route('/:subject/update').put(updateAssignment);
router.route('/:subject/delete').delete(deleteAssignment);
router.route('/:id/submit').post(submitAssignment);
router.route('/details/:subject').get(submitWorkDetails);

export default router;