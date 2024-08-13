import { Router } from 'express';
import { isAuthenticated } from "../../middleware/passport";

import auth from './auth';
import user from './user';
import sid from "./sid";
import sids from "./user-sids";
import role from './role';
import department from "./department";
import system from "./system";
import permission from './permission';

const router = Router();

router.use('/user', isAuthenticated, user);
router.use('/role', isAuthenticated, role);
router.use('/department', isAuthenticated, department);
router.use('/sid', isAuthenticated, sid);
router.use('/user-sids', isAuthenticated, sids);
router.use('/system', isAuthenticated, system);
router.use('/permission', isAuthenticated, permission);


router.use('/auth', auth);

export default router;