import { Router } from 'express';
import { create, update, remove, findOne, findAll, check } from "../../controllers/system";

const router = Router();

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/:id', findOne);
router.get('/', findAll);
router.get('/check/:id', check);

export default router;