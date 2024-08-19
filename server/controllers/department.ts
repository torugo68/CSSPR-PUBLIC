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

        const department = await prisma.department.create({
            data: {
                name: validatedData.data.name,
            }
        });
        res.status(200).json(department);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({message: "Error on creating a new department."});
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

        const department = await prisma.department.update({
            where: { id: Number(req.params.id) },
            data: {
                ...(validatedData.data.name ? { name: validatedData.data.name } : {}),
            }
        });
        res.status(200).json(department);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({message: "Invalid data" });
        }
        else {
            res.status(500).json({ message: "Error on update department." });
        }
    }
}

// carefully implement the remove function
export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.department.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(200).json({ message: "department removed successfully." }); // Corrected the unclosed string literal
    } catch (e) {
        res.status(500).json({ message: "Error on removing department." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const department = await prisma.department.findUnique({
            where: { id: Number(req.params.id) }
        });
        res.status(200).json(department);
    } catch (e) {
        res.status(500).json({ message: "Error on find department." });
    }
}

interface departmentQuery {
    name?: { contains: string };
    email?: { contains: string };
}

export const findAll = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.query;

        // Initialize the query object with the specific type
        let query: departmentQuery = {};
        if (name) {
            query['name'] = { contains: name as string };
        }

        const departments = await prisma.department.findMany({
            where: query
        });

        res.status(200).json(departments);
    } catch (e) {
        res.status(500).json({ message: "Error on find departments." });
    }
};

export const check = async (req: Request, res: Response) => {
    try {
        const departmentId = parseInt(req.params.id, 10);

        if (isNaN(departmentId)) {
            res.status(400).send('Invalid role ID');
            return;
        }

        const check = await prisma.user.findFirst({
            where: {
                departmentId: departmentId
            }
        });

        if (check) {
            res.status(501).json({ message: "Cannot delete department." });
        } else {
            res.status(200).json({ message: "Department can be deleted." });
        }
    } catch (e) {
        res.status(500).json({ message: "Error on check." });
    }
};