import { Router } from 'express';
import { create, remove, update, findOne } from "../../controllers/user-sids";

const router = Router();

router.post('/', create);
router.delete('/:id', remove);
router.put('/:id', update);
router.get('/:id', findOne);

export default router;