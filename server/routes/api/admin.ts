import { Router } from 'express';
import { update, remove, findOne, findAll, check } from "../../controllers/admin";

const router = Router();

router.put('/:id', update);
router.delete('/:id', remove);
router.get('/:id', findOne);
router.get('/', findAll);
router.get('/check/:id', check);

export default router;