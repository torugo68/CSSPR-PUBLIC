import { Router } from 'express';
import { create, update, remove, findOne, findAll } from "../../controllers/sid";

const router = Router();

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/:id', findOne);
router.get('/', findAll);

export default router;