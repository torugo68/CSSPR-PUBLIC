import { Request, Response } from "express";
import prisma from "../config/db";

export const findAll = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.logs.findMany({
            orderBy: {
                createdAt: 'desc',
                },
        });
        res.status(200).json(logs);
    } catch (e) {
        res.status(500).json({ message: "Error on find logs." });
    }
};