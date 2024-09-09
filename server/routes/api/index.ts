import { Router } from 'express';
import { isAuthenticated } from "../../middleware/passport";

import sid from "./sid";
import auth from './auth';
import user from './user';
import admin from './admin';
import logs from './logs';
import role from './role';
import system from "./system";
import sids from "./user-sids";
import department from "./department";
import permission from './permission';

const router = Router();

router.use('/sid', isAuthenticated, sid);
router.use('/user', isAuthenticated, user);
router.use('/role', isAuthenticated, role);
router.use('/admin', isAuthenticated, admin);
router.use('/logs', isAuthenticated, logs);
router.use('/system', isAuthenticated, system);
router.use('/user-sids', isAuthenticated, sids);
router.use('/permission', isAuthenticated, permission);
router.use('/department', isAuthenticated, department);


router.use('/auth', auth);

export default router;