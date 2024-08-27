import { Router } from 'express';
import { findAll } from "../../controllers/logs";

const router = Router();

router.get('/', findAll);

export default router;