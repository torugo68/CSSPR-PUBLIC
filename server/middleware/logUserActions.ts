import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import prisma from "../config/db";

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

function logAccess(req: Request, res: Response, next: NextFunction): void {
  const originalResJson = res.json;
  
  res.json = function (body: any) {
    (async () => {
      try {
        const userUpdateUrl = /^\/api\/user\/(\d+)$/;
        const userSidsUpdateUrl = /^\/api\/user-sids\/(\d+)$/;
        const userPermissionUpdateUrl = /^\/api\/permission\/(\d+)$/;
        
        if (res.statusCode === 200 && req.method === 'POST') {
          if (req.originalUrl === '/api/user') {
            const adminId = Number(req.user);
            await prisma.logs.create({
              data: {
                userId: Number(body.id),
                adminId: adminId,
                operationId: 1,
              }
            });
          }
          
          if (req.originalUrl === '/api/user-sids') {
            const adminId = Number(req.user);
            await prisma.logs.create({
              data: {
                userId: Number(body.userId),
                adminId: adminId,
                operationId: 3,
              }
            });
          }
          
          if (req.originalUrl === '/api/permission') {
            const adminId = Number(req.user);
            const userId = Number(body.userId);
            await prisma.logs.create({
              data: {
                userId: userId,
                adminId: adminId,
                operationId: 4,
              }
            });
          }
          
        } else if (res.statusCode === 200 && req.method === 'DELETE') {
          if (userUpdateUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);
            await prisma.logs.create({
              data: {
                userId: Number(body.id),
                adminId: adminId,
                operationId: 2,
              }
            });
          }

          if (userPermissionUpdateUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);
            const userId = Number(body.userId);
            await prisma.logs.create({
              data: {
                userId: userId,
                adminId: adminId,
                operationId: 4,
              }
            });
          }
        } else if (res.statusCode === 200 && req.method === 'PUT') {
          if (userUpdateUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);

            if (body.actions.nameEdited || body.actions.emailEdited) {
              await prisma.logs.create({
                data: {
                  userId: Number(body.user.id),
                  adminId: adminId,
                  operationId: 6,
                }
              });
            }

            if (body.actions.roleIdEdited) {
              await prisma.logs.create({
                data: {
                  userId: Number(body.user.id),
                  adminId: adminId,
                  operationId: 9,
                }
              });
            }

            if (body.actions.departmentIdEdited) {
              await prisma.logs.create({
                data: {
                  userId: Number(body.user.id),
                  adminId: adminId,
                  operationId: 10,
                }
              });
            }

          } 
          if (userSidsUpdateUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);
            await prisma.logs.create({
              data: {
                userId: Number(body.userId),
                adminId: adminId,
                operationId: 5,
              }
            });
          }
        }
      } catch (error) {
        console.error('Error logging:', error);
      }
    })();
    return originalResJson.call(this, body);
  };

  res.on('finish', async () => {
    if ((res.statusCode === 200) && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
      console.log(`URL: ${req.originalUrl}, Method: ${req.method}, Status: ${res.statusCode}`);
    }
  });
  next();
}

export default logAccess;