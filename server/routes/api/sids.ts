import { Router } from 'express';
import { create, remove, findOne } from "../../controllers/sids";

const router = Router();

router.post('/', create);
router.delete('/:id', remove);
router.get('/:id', findOne);

export default router;