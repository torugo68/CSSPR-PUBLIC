import { Router } from 'express';
import { findAll, advancedFindAll } from "../../controllers/logs";

const router = Router();

router.get('/', findAll);

router.get('/advanced/', advancedFindAll);

export default router;