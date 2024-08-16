import { Request, Response } from "express";
import { ZodError } from "zod";

import { userSchema, userUpdateSchema, optionalSidSchema } from "../middleware/validator";
import prisma from "../config/db";

export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = userSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const user = await prisma.user.create({
            data: {
                name: validatedData.data.name,
                email: validatedData.data.email,
                roleId: validatedData.data.roleId,
                departmentId: validatedData.data.departmentId,
            }
        });

        if (req.body.permissions) {
            await prisma.permission.createMany({
                data: req.body.permissions.map((permission: any) => {
                    return { systemId: permission.systemId, userId: user.id }
                })
            });
        }

        if (req.body.userSids) {
            await prisma.userSids.createMany({
                data: req.body.userSids.map((sid: any) => {
                    const validatedData = optionalSidSchema.safeParse(sid);
                    if (validatedData.success) {
                        return { userId: user.id, sidId: sid.sidId, value: sid.value }
                    }
                })
            });
        }
          
        res.status(200).json(user);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({ message: "Error on creating a new user.", error: e });
        }
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const validatedData = userUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data", errors: validatedData.error.format() });
            return;
        }

        const userData = {
            ...(validatedData.data.name ? { name: validatedData.data.name } : {}),
            ...(validatedData.data.email ? { email: validatedData.data.email } : {}),
            ...(validatedData.data.roleId ? { roleId: validatedData.data.roleId } : {}),
            ...(validatedData.data.departmentId ? { departmentId: validatedData.data.departmentId } : {}),
        };

        let user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: userData
        });

        let actions = {}
        
        if (validatedData.data.name) {
            actions = {
                ...actions,
                nameEdited: true
            }
        }

        if (validatedData.data.email) {
            actions = {
                ...actions,
                emailEdited: true
            }
        }

        if (validatedData.data.roleId) {
            actions = {
                ...actions,
                roleIdEdited: true
            }
        }

        if (validatedData.data.departmentId) {
            actions = {
                ...actions,
                departmentIdEdited: true
            }
        }

        res.status(200).json({user, actions});
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({message: "Invalid data" });
        }
        else {
            res.status(500).json({ message: "Error on update user." });
        }
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: { deletedAt: new Date() }
        });
        res.status(200).json({ message: "User removed successfully." }); 
    } catch (e) {
        res.status(500).json({ message: "Error on removing user." });
    }
};

export const restore = async (req: Request, res: Response) => {
    try {
        await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: { deletedAt: null }
        });
        res.status(200).json({ message: "User restored successfully." });
    } catch (e) {
        res.status(500).json({ message: "Error on restoring user. Check if another account is already registered." });
    }

}

export const findOne = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { 
                id: Number(req.params.id),
                deletedAt: null
             },
             include: {
                permissions: true,
                role: {
                    select: {
                        name: true,
                    },
                },
                department: {
                    select: {
                        name: true,
                    },
                },
                sids: {
                    select: {
                        id: true,
                        sidId: true,
                        value: true,
                        sid: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
            }
        });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: "Error on find user." });
    }
}

interface UserQuery {
    name?: { contains: string };
    email?: { contains: string };
}

export const findAll = async (req: Request, res: Response) => {
    try {
        let { name, email, count } = req.query;

        let query: UserQuery = {};
        if (name) {
            query['name'] = { contains: name as string };
        }
        if (email) {
            query['email'] = { contains: email as string };
        }
        
        let parsedCount = 25;

        if (count) {
            try {
                parsedCount = parseInt(count as string);
            } catch (e) {
                parsedCount = 25;    
            }
        } 

        const users = await prisma.user.findMany({
            where: {
                ...query,
                deletedAt: null
            },
            take: parsedCount,
            include: {
                permissions: true,
                role: {
                    select: {
                        name: true,
                    },
                },
                department: {
                    select: {
                        name: true,
                    },
                },
                sids: {
                    select: {
                        sidId: true,
                        value: true,
                        sid: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
            }
        });

        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: "Error on find users." });
    }
};