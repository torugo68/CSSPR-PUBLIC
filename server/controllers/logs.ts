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
                            name: true,
                            email: true,
                            role: {
                                select: {
                                    name: true,
                                }
                            },
                            department: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    },
                    admin: {
                        select: {
                            username: true,
                        }
                    },
                    operation: {
                        select: {
                          name: true,
                        }
                      }
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
        const { adminId, userId, operationId } = req.params;

        const condition = operationId ? { operationId: Number(operationId) } : {};

        const logs = await prisma.logs.findMany({
            where: { 
                OR: [
                    { adminId: Number(adminId) },
                    { userId: Number(userId) }
                ],
                AND: [
                    condition
                ]
             }
        });
        res.status(200).json(logs);
    } catch (e) {
        res.status(500).json({ message: "Error on find admin logs." });
    }
};