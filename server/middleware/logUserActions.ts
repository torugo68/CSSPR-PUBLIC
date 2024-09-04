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

async function log(adminId:any, userId:any, operation:any) {
    try {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        },
        include: {
            role: {
                select: {
                    name: true
                }
            },
        }
    });
    const admin = await prisma.admin.findUnique({
        where: {
            id: Number(adminId)
        }
    });
    const operationName = await prisma.operationsTypes.findUnique({
        where: {
            id: Number(operation)
        }
    });
        if (user && admin && operationName && user.role) {
            await prisma.logs.create({
                data: {
                    name: user.name,
                    email: user.email,
                    role: user.role.name,
                    operation: operationName.name,
                    operationId: operation,
                    adminName: admin.username,
                    adminId: adminId,
                    userId: userId,
                }
            });
        } else {
            console.error('Error logging:', 'User, Admin or Operation not found');
            console.error(adminId, userId, operation);
            console.error(user, admin, operationName);
        }
    } catch (error) {
        console.error('Error logging:', error);
    }
}

function logAccess(req: Request, res: Response, next: NextFunction): void {
  const originalResJson = res.json;
  
  res.json = function (body: any) {
    (async () => {
      try {
        const userUpdateUrl = /^\/api\/user\/(\d+)$/;
        const userRestoreUrl = /^\/api\/user\?userId=(\d+)$/;
        const userSidsUpdateUrl = /^\/api\/user-sids\/(\d+)$/;
        const userPermissionUpdateUrl = /^\/api\/permission\/(\d+)$/;
        
        if (res.statusCode === 200 && req.method === 'POST') {
          if (req.originalUrl === '/api/user') {
            const adminId = Number(req.user);
            const userId = Number(body.id);
            log(adminId, userId, 1);
          }
          
          if (req.originalUrl === '/api/user-sids') {
            const adminId = Number(req.user);
            const userId = Number(body.userId);
            log(adminId, userId, 3);
          }
          
          if (req.originalUrl === '/api/permission') {
            const adminId = Number(req.user);
            const userId = Number(body.userId);
            log(adminId, userId, 4);
          }
          
        } else if (res.statusCode === 200 && req.method === 'DELETE') {
          if (userUpdateUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);
            const userId = Number(body.id);
            log(adminId, userId, 2);
            console.log('User deleted');
          }

          if (userPermissionUpdateUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);
            const userId = Number(body.userId);
            log(adminId, userId, 4);
          }
        } else if (res.statusCode === 200 && req.method === 'PUT') {
          if (userUpdateUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);
            const userId = Number(body.user.id);

            if (body.actions.nameEdited || body.actions.emailEdited) {
              log(adminId, userId, 6);
            }

            if (body.actions.roleIdEdited) {
                log(adminId, userId, 10);
            }

            if (body.actions.departmentIdEdited) {
                log(adminId, userId, 9);
            }

          } 
          if (userSidsUpdateUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);
            const userId = Number(body.userId);
            log(adminId, userId, 5);
          }
        } else if (res.statusCode === 200 && req.method === 'PATCH') {
          if (userRestoreUrl.test(req.originalUrl)) {
            const adminId = Number(req.user);
            const userId = Number(body.id);
            log(adminId, userId, 11);
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