import { Request, Response } from "express";
import { ZodError } from "zod";

import prisma from "../config/db";
import { RoleOrDepartmentOrSystemSchema } from "../middleware/validator";

export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = RoleOrDepartmentOrSystemSchema.safeParse(req.body);
        
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const system = await prisma.system.create({
            data: {
                name: validatedData.data.name,
            }
        });
        res.status(200).json(system);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({ message: "Error on creating a new system." });
        }
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const validatedData = RoleOrDepartmentOrSystemSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const system = await prisma.system.update({
            where: { id: Number(req.params.id) },
            data: {
                name: validatedData.data.name,
            }
        });
        res.status(200).json(system);
    } catch (e) {
        res.status(500).json({ message: "Error on update system." });
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.system.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(200).json({ message: "system removed successfully." }); 
    } catch (e) {
        res.status(500).json({ message: "Error on removing system." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const system = await prisma.system.findUnique({
            where: { id: Number(req.params.id) }
        });
        res.status(200).json(system);
    } catch (e) {
        res.status(500).json({ message: "Error on find system." });
    }
}

export const findAll = async (req: Request, res: Response) => {
    try {
        const systems = await prisma.system.findMany({
            where: {}
        });

        res.status(200).json(systems);
    } catch (e) {
        res.status(500).json({ message: "Error on find systems." });
    }
};