import { Request, Response } from "express";
import prisma from "../config/db";

export const create = async (req: Request, res: Response) => {
    try {
        const newLog = await prisma.logs.create({
            data: {
                userId: Number(req.body.userId),
                adminId: Number(req.body.systemId),
                operationId: Number(req.body.operationId),
            }
        });
        res.status(200).json(newLog);
    } catch (e) {
        res.status(500).json({ message: "Error on creating a new log." });
    }
};

export const findAll = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.logs.findMany(
            {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    admin: {
                        select: {
                            id: true,
                            username: true,
                        }
                    },
                }
            }
        );
        res.status(200).json(logs);
    } catch (e) {
        res.status(500).json({ message: "Error on find logs." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.logs.findMany({
            where: { 
                adminId: Number(req.params.id),
             }
        });
        res.status(200).json(logs);
    } catch (e) {
        res.status(500).json({ message: "Error on find admin logs." });
    }
};