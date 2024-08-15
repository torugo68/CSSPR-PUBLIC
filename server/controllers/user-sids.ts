import { Request, Response } from "express";
import { ZodError } from "zod";
import prisma from "../config/db";
import { sidSchema } from "../middleware/validator";

export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = sidSchema.safeParse(req.body);

        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const newSid = {
            sidId: validatedData.data.sidId,
            userId: validatedData.data.userId,
            value: validatedData.data.value
        };
        
        const sids = await prisma.userSids.create({
            data: newSid
        });
        res.status(200).json(sids);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({message: "Error on assign new sid to user."});
        }
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const validatedData = sidSchema.safeParse(req.body);

        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const newSid = {
            sidId: validatedData.data.sidId,
            userId: validatedData.data.userId,
            value: validatedData.data.value
        };

        const sids = await prisma.userSids.update({
            where: { id: Number(req.params.id) },
            data: newSid
        });
        res.status(200).json(sids);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({ message: "Error on update sids." });
        }
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.userSids.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(200).json({ message: "sids removed successfully." }); 
    } catch (e) {
        res.status(500).json({ message: "Error on removing sids." });
    }
};

export const findOne = async (req: Request, res: Response) => {
    try {
        const sids = await prisma.userSids.findMany({
            where: { userId: Number(req.params.userId) }
        });
        res.status(200).json(sids);
    } catch (e) {
        res.status(500).json({ message: "Error on find sids." });
    }
}