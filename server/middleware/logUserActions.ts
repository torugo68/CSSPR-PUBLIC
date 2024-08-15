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

// Middleware to log
function logAccess(req: Request, res: Response, next: NextFunction): void {
  const originalResJson = res.json;

  res.json = function (body: any) {
    (async () => {
      try {
        if (req.originalUrl === '/api/user' && req.method === 'POST' && res.statusCode === 200) {
          console.log(`${body.name} created | ${res.statusCode}`);
          const adminId = Number(req.user);
          await prisma.logs.create({
            data: {
              userId: Number(body.id),
              adminId: adminId,
              operationId: 1,
            }
          });
        } 
      } catch (error) {
        console.error('Error logging user creation:', error);
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