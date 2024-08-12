import { Request, Response } from "express";
import { ZodError } from "zod";
import prisma from "../config/db";

export const create = async (req: Request, res: Response) => {
    try {
        const sids = await prisma.sids.create({
            data: {
                sidId: req.body.sidId,
                userId: req.body.userId,
            }
        });
        res.status(200).json(sids);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({message: "Error on creating a new sids."});
        }
    }
}


export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.sids.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(200).json({ message: "sids removed successfully." }); // Corrected the unclosed string literal
    } catch (e) {
        res.status(500).json({ message: "Error on removing sids." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const sids = await prisma.sids.findMany({
            where: { userId: Number(req.params.userId) }
        });
        res.status(200).json(sids);
    } catch (e) {
        res.status(500).json({ message: "Error on find sids." });
    }
}