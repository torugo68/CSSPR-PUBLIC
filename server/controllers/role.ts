import { Request, Response } from "express";
import { ZodError } from "zod";
import prisma from "../config/db.config";
import { RoleOrDepartmentSchema } from "../middleware/validator";

export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = RoleOrDepartmentSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const role = await prisma.role.create({
            data: {
                name: validatedData.data.name,
            }
        });
        res.status(200).json(role);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({message: "Error on creating a new role."});
        }
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const validatedData = RoleOrDepartmentSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const role = await prisma.role.update({
            where: { id: Number(req.params.id) },
            data: {
                name: validatedData.data.name,
            }
        });
        res.status(200).json(role);
    } catch (e) {
        res.status(500).json({ message: "Error on update role." });
    }
}

// carefully implement the remove function
export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.role.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(200).json({ message: "role removed successfully." }); 
    } catch (e) {
        res.status(500).json({ message: "Error on removing role." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const role = await prisma.role.findUnique({
            where: { id: Number(req.params.id) }
        });
        res.status(200).json(role);
    } catch (e) {
        res.status(500).json({ message: "Error on find role." });
    }
}

interface roleQuery {
    name?: { contains: string };
    email?: { contains: string };
}

export const findAll = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.query;

        let query: roleQuery = {};
        if (name) {
            query['name'] = { contains: name as string };
        }

        const roles = await prisma.role.findMany({
            where: query
        });

        res.status(200).json(roles);
    } catch (e) {
        res.status(500).json({ message: "Error on find roles." });
    }
};