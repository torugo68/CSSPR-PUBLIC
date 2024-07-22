import { Router } from 'express';
import { isAuthenticated } from "../../middleware/passport";

import auth from './auth';
import user from './user';
import role from './role';
import department from "./department";

const router = Router();

router.use('/user', isAuthenticated, user);
router.use('/role', isAuthenticated, role);
router.use('/department', isAuthenticated, department);
router.use('/auth', auth);

export default router;