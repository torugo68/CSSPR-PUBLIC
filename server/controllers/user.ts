import {Request, Response} from "express";
import {ZodError} from "zod";

import {userSchema, userUpdateSchema, optionalSidSchema} from "../middleware/validator";
import prisma from "../config/db";

export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = userSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({message: "Invalid data"});
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
                    return {systemId: permission.systemId, userId: user.id}
                })
            });
        }

        if (req.body.userSids) {
            await prisma.userSids.createMany({
                data: req.body.userSids.map((sid: any) => {
                    const validatedData = optionalSidSchema.safeParse(sid);
                    if (validatedData.success) {
                        return {userId: user.id, sidId: sid.sidId, value: sid.value}
                    }
                })
            });
        }

        res.status(200).json(user);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({message: "Invalid data"});
        } else {
            res.status(500).json({message: "Error on creating a new user.", error: e});
        }
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const {homeOffice, homeOfficeStart, homeOfficeEnd} = req.body;

        const start = new Date(homeOfficeStart);
        const end = new Date(homeOfficeEnd);
        const validatedData = userUpdateSchema.safeParse(req.body);

        if (!validatedData.success) {
            res.status(400).json({message: "Invalid data", errors: validatedData.error.format()});
            return;
        }

        let userData = {
            ...(validatedData.data.name ? {name: validatedData.data.name} : {}),
            ...(validatedData.data.email ? {email: validatedData.data.email} : {}),
            ...(validatedData.data.roleId ? {roleId: validatedData.data.roleId} : {}),
            ...(validatedData.data.departmentId ? {departmentId: validatedData.data.departmentId} : {}),
        };
        let homeOfficeData = {}

        if (homeOffice === true) {
            if (start instanceof Date && !isNaN(start.getTime()) && end instanceof Date && !isNaN(end.getTime())) {
                if (end > start) {
                    homeOfficeData = {
                        homeOffice: homeOffice,
                        homeOfficeStart: start.toISOString(),
                        homeOfficeEnd: end.toISOString(),
                    };
                }
            }
        } else if (homeOffice === false) {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(req.params.id),
                },
            });

            if (user) {
                if (user.homeOffice === true) {
                    homeOfficeData = {
                        homeOffice: false,
                        homeOfficeStart: null,
                        homeOfficeEnd: null,
                    };
                }
            }
        }

        let user = await prisma.user.update({
            where: {id: Number(req.params.id)},
            data: {
                ...userData,
                ...homeOfficeData
            }
        });

        let actions = {}

        if (validatedData.data.name || req.body.homeOffice) {
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
            res.status(400).json({message: "Invalid data"});
        } else {
            res.status(500).json({message: "Error on update user."});
        }
    }
}

export const remove = async (req: Request, res: Response) => {
    try {

        const user = await prisma.user.update({
            where: {id: Number(req.params.id)},
            data: {deletedAt: new Date()}
        });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({message: "Error on removing user."});
    }
};

export const restore = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.update({
            where: {id: Number(req.query.userId)},
            data: {deletedAt: null}
        });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({message: "Error on restoring user. Check if another account is already registered."});
    }

}

export const findOne = async (req: Request, res: Response) => {
    try {
        const {disable} = req.query;

        const disableBoolean = disable === 'true' ? true : false;

        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
                deletedAt: disableBoolean ? {not: null} : null
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
                Logs: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        operation: true,
                        createdAt: true,
                        admin: {
                            select: {
                                username: true,
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({message: "Error on find user."});
    }
}

interface UserQuery {
    query?: string;
}

export const findAll = async (req: Request, res: Response) => {
    try {
        let {
            query,
            disable,
            selectedRoles,
            selectedDepartments,
            selectedSystems,
            homeOffice,
            homeOfficeStart,
            homeOfficeEnd
        } = req.query;

        let roleIds: number[] = [];
        let systemIds: number[] = [];
        let departmentIds: number[] = [];

        if (selectedSystems) {
            if (!Array.isArray(selectedSystems)) {
                res.status(400).json({message: "Invalid query parameters"});
            } else {
                systemIds = (selectedSystems as string[]).map(system => parseInt(system, 10)).filter(system => !isNaN(system));
            }
        }

        if (selectedRoles) {
            if (!Array.isArray(selectedRoles)) {
                res.status(400).json({message: "Invalid query parameters"});
            } else {
                roleIds = (selectedRoles as string[]).map(role => parseInt(role, 10)).filter(role => !isNaN(role));
            }
        }

        if (selectedDepartments) {
            if (!Array.isArray(selectedDepartments)) {
                res.status(400).json({message: "Invalid query parameters"});
            } else {
                departmentIds = (selectedDepartments as string[]).map(department => parseInt(department, 10)).filter(department => !isNaN(department));
            }
        }
        const disableBoolean = disable === 'true';
        const homeOfficeBoolean = homeOffice === 'true';

        let databaseQuery = {
            AND: [
                {
                    OR: [
                        query ? {name: {contains: query as string}} : {},
                        query ? {email: {contains: query as string}} : {}
                    ]
                },
                roleIds.length > 0 ? {roleId: {in: roleIds}} : {},
                departmentIds.length > 0 ? {departmentId: {in: departmentIds}} : {},
                systemIds.length > 0 ? {permissions: {some: {systemId: {in: systemIds}}}} : {},
                disableBoolean ? {deletedAt: {not: null}} : {deletedAt: null},
                homeOfficeBoolean ? {homeOffice: true} : {},
            ]
        }

        let users = await prisma.user.findMany({
            where: databaseQuery,
            include: {
                permissions: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            }
        });

        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({message: "Error on find users.", error: e});
    }
};