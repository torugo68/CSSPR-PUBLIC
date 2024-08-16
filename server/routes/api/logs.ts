import { Router } from 'express';
import { findAll, findOne } from "../../controllers/logs";

const router = Router();

router.get('/', findAll);
router.get('/:id', findOne);

export default router;