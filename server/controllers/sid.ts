import { Request, Response } from "express";
import { ZodError } from "zod";
import prisma from "../config/db";
import { RoleOrDepartmentOrSystemSchema, RoleOrDepartmentUpdateSchema } from "../middleware/validator";

export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = RoleOrDepartmentOrSystemSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const sid = await prisma.sid.create({
            data: {
                name: validatedData.data.name,
            }
        });
        res.status(200).json(sid);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({message: "Error on creating a new sid."});
        }
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const validatedData = RoleOrDepartmentUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const sid = await prisma.sid.update({
            where: { id: Number(req.params.id) },
            data: {
                ...(validatedData.data.name ? { name: validatedData.data.name } : {}),
            }
        });
        res.status(200).json(sid);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({ message: "Error on update sid." });
        }
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.sid.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(200).json({ message: "sid removed successfully." });
    } catch (e) {
        res.status(500).json({ message: "Error on removing sid." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const sid = await prisma.sid.findUnique({
            where: { id: Number(req.params.id) }
        });
        res.status(200).json(sid);
    } catch (e) {
        res.status(500).json({ message: "Error on find sid." });
    }
}

interface sidQuery {
    name?: { contains: string };
    email?: { contains: string };
}

export const findAll = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.query;
        let query: sidQuery = {};

        if (name) {
            query['name'] = { contains: name as string };
        }

        const sids = await prisma.sid.findMany({
            where: query
        });

        res.status(200).json(sids);
    } catch (e) {
        res.status(500).json({ message: "Error on find sids." });
    }
};