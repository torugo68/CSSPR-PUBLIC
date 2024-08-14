import { permission } from 'process';
import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
    email: z.string().email({ message: "Invalid email." }),
    roleId: z.number({message: "Invalid role id."}),
    departmentId: z.number({message: "Invalid department id."}),
});

export const userUpdateSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long." }).optional(),
    email: z.string().email({ message: "Invalid email." }).optional(),
    roleId: z.number({message: "Invalid role id."}).optional(),
    departmentId: z.number({message: "Invalid department id."}).optional(),
});

export const adminSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    password: z.string().min(3, { message: "Password must be at least 3 characters long" }), // Password implement .min(6) in production
    userId: z.number().optional(),
});

export const adminUpdateSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }).optional(),
    password: z.string().min(3, { message: "Password must be at least 3 characters long" }).optional(), // Password implement .min(6) in production
    userId: z.number().optional(),
});

export const RoleOrDepartmentOrSystemSchema = z.object({
    name: z.string().min(1),
});

export const RoleOrDepartmentUpdateSchema = z.object({
    name: z.string().min(1, { message: "Name must be at least 1 characters long." }).optional(),
});

export const permissionSchema = z.object({
    userId : z.number(),
    systemId: z.number(),
});

export const sidSchema = z.object({
    userId: z.number(),
    sidId: z.number(),
    value: z.string().regex(/^\d{2}\.\d{3}\.\d{3}-\d{1}$/),
});