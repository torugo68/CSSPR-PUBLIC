import { Request, Response } from "express";
import { ZodError } from "zod";
import prisma from "../config/db";
import { permissionSchema } from "../middleware/validator";
//
export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = permissionSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const permission = await prisma.permission.create({
            data: {
                userId:  validatedData.data.userId,
                systemId:  validatedData.data.systemId,
            }
        });
        res.status(200).json(permission);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({message: "Error on creating a new permission."});
        }
    }
}//

export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.permission.deleteMany({
            where: { userId: Number(req.params.userId) },
        });
    } catch (e) {
        res.status(500).json({ message: "Error on delete permission." });
    }
}

export const findAll = async (req: Request, res: Response) => {
    try {
        const permissions = await prisma.permission.findMany();
        res.status(200).json(permissions);
    } catch (e) {
        res.status(500).json({ message: "Error on find permissions." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const permissions = await prisma.permission.findMany({
            where: { 
                userId: Number(req.params.id),
             }
        });
        res.status(200).json(permissions);
    } catch (e) {
        res.status(500).json({ message: "Error on find user permissions." });
    }
};