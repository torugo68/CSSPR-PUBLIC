import { Request, Response } from "express";
import prisma from "../config/db";

export const findAll = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.logs.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                admin: {
                    select: {
                        username: true,
                    },
                },
                operationType: {
                    select: {
                        name: true,
                    },
                }
            },
        });
        res.status(200).json(logs);
    } catch (e) {
        res.status(500).json({ message: "Error on find logs." });
    }
};

export const advancedFindAll = async (req: Request, res: Response) => {
    try {
        const advancedlogs = await prisma.advancedLogs.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json(advancedlogs);
    } catch (e) {
        res.status(500).json({ message: "Error on find logs." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const log = await prisma.logs.findFirst({
            where: {
                id: Number(id),
                operation: "Excluido",
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json(log);
    } catch (e) {
        res.status(500).json({ message: "Error on find log." });
    }
}