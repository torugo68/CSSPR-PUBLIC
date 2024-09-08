import { Request, Response, NextFunction, Router } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logout successful" });
    });
});

export default router;