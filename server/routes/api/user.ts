import { Router } from 'express';
import { create, update, remove, restore, findOne, findAll } from "../../controllers/user";

const router = Router();

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.patch('/', restore);
router.get('/:id', findOne);
router.get('/', findAll);

export default router;