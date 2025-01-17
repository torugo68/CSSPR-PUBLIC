import { Request, Response, NextFunction } from 'express';
import prisma from "../config/db";

function getRequestInfo(req: Request): string {
  const body = { ...req.body };
  const params = req.params;

  if (body.password) {
    delete body.password;
  }
  return JSON.stringify({
    Body: body,
    params: params
  }, null, 2);
}

async function AdvancedLog(adminId: any, operation: any, req: Request, item?: any) {
  const admin = await prisma.admin.findUnique({
    where: {
      id: Number(adminId)
    }
  });

  if (admin && req.ip) {
    await prisma.advancedLogs.create({
      data: {
        name: admin.username,
        operation: operation,
        adminId: adminId,
        ip: req.ip,
        req: getRequestInfo(req),
        params: JSON.stringify(item)
      }
    });
  }
}

async function log(adminId: any, userId: any, operation: any) {
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

        const updateUrls = [
          {
            pattern: /^\/api\/admin\/(\d+)$/,
            message: 'um administrador',
            item: req.params.id ? await prisma.admin.findUnique({
              where: { id: parseInt(req.params.id) },
              select: {
                id: true,
                username: true,
                password: false,
              },
            }) : {}
          },
          {
            pattern: /^\/api\/role\/(\d+)$/,
            message: 'um grupo',
            item: req.params.id ? await prisma.role.findUnique({ where: { id: parseInt(req.params.id) } }) : {}
          },
          {
            pattern: /^\/api\/department\/(\d+)$/,
            message: 'um setor',
            item: req.params.id ? await prisma.department.findUnique({ where: { id: parseInt(req.params.id) } }) : {}
          },
          {
            pattern: /^\/api\/sid\/(\d+)$/,
            message: 'um SID',
            item: req.params.id ? await prisma.sid.findUnique({ where: { id: parseInt(req.params.id) } }) : {}
          },
          {
            pattern: /^\/api\/system\/(\d+)$/,
            message: 'um sistema',
            item: req.params.id ? await prisma.system.findUnique({ where: { id: parseInt(req.params.id) } }) : {}
          }
        ];

        const adminId = Number(req.user);

        if (res.statusCode === 200 && req.method === 'POST') {
          if (req.originalUrl === '/api/user') {
            const userId = Number(body.id);
            log(adminId, userId, 1);
          }

          if (req.originalUrl === '/api/auth/login') {
            const admin = req.user;
            AdvancedLog((admin as any).id, 'Acessou o sistema', req);
          }

          if (req.originalUrl === '/api/user-sids') {
            const userId = Number(body.userId);
            log(adminId, userId, 3);
          }

          if (req.originalUrl === '/api/permission') {
            const userId = Number(body.userId);
            log(adminId, userId, 4);
          }

          // Advanced Log
          switch (req.originalUrl) {
            case '/api/auth/signup': {
              AdvancedLog(adminId, 'Criou novo administrador', req);
              break;
            }
            case '/api/role': {
              AdvancedLog(adminId, 'Criou novo grupo', req);
              break;
            }
            case '/api/department': {
              AdvancedLog(adminId, 'Criou novo setor', req);
              break;
            }
            case '/api/sid': {
              AdvancedLog(adminId, 'Criou novo SID', req);
              break;
            }
            case '/api/system': {
              AdvancedLog(adminId, 'Criou novo sistema', req);
              break;
            }
          }
        } else if (res.statusCode === 200 && req.method === 'DELETE') {
          if (userUpdateUrl.test(req.originalUrl)) {
            const userId = Number(body.id);
            log(adminId, userId, 2);
          }


          if (userPermissionUpdateUrl.test(req.originalUrl)) {
            const userId = Number(body.userId);
            log(adminId, userId, 4);
          }

          // Advanced Log
          updateUrls.forEach(({ pattern, message, item }) => {
            if (pattern.test(req.originalUrl)) {
              AdvancedLog(adminId, ('Deletou ' + message), req, item);
            }
          });

        } else if (res.statusCode === 200 && req.method === 'PUT') {
          if (userUpdateUrl.test(req.originalUrl)) {
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
            const userId = Number(body.userId);
            log(adminId, userId, 5);
          }

          // Advanced Log
          updateUrls.forEach(({ pattern, message, item }) => {
            if (pattern.test(req.originalUrl)) {
              AdvancedLog(adminId, ('Editou ' + message), req, item);
            }
          });
        } else if (res.statusCode === 200 && req.method === 'PATCH') {
          if (userRestoreUrl.test(req.originalUrl)) {
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