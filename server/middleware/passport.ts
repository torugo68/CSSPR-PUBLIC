import { Express, Request, Response, NextFunction } from "express";
import * as passportStrategy from "passport-local";
import prisma from "../config/db";
import passport, {use} from "passport";
import bcrypt from "bcrypt";

export function initPassport(app: Express) {
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));

    passport.use(new passportStrategy.Strategy(
        { usernameField: "username"}, async (username, password, done) => {
            try {
                if (!username) { done(null, false) }

                const user = await prisma.admin.findUnique({
                    where: { username: username }
                });

                if (!user) {
                    done(null, false, { message: "User or password incorrect" });
                    return;
                }

                if (user.username == username && await bcrypt.compare(password, (user.password).toString())) {
                    done(null, user);
                } else {
                    done(null, false, { message: "User or password incorrect"});
                }
            } catch (e) {
                done(e);
            }
        }));

    passport.serializeUser(async (req: Request, user: any, done: any) => {
        try {
            done(null, user.id);
        } catch (error) {
            done(error);
        }
    });


    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await prisma.admin.findUnique({
                where: { id: id }
            });
            done(null, user?.id);
        } catch (error) {
            done(error);
        }
    });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction): Response | void {
    if (req.user) {
        return next();
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
  }
