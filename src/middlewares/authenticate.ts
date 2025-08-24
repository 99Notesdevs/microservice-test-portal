import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { getAuthToken } from '../grpc/client/client';

declare global {
    namespace Express {
        interface Request {
            authUser?: string;
            authType?: string;
        }
    }
}

dotenv.config();
const secret = process.env.TOKEN_SECRET || '';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Inside authenticate middleware");
    try {
        const cookie = req.cookies['token'];
        if (!cookie) throw new Error('No Cookie provided');

        const authRepo = await getAuthToken(cookie);
        if (!authRepo) throw new Error('Cannot get token');
        const type = authRepo.type;

        const { id } = jwt.verify(cookie, secret) as { id: string };
        if(!id) throw new Error('Cannot verify token');
        logger.info("Identity verified successfully");
        
        req.authUser = id;
        req.authType = type;
        
        next();
    } catch(err: unknown) {
        if(err instanceof Error) {
            logger.error(err.message);
            res.status(401).json({
                success: false,
                message: err.message
            });
        } else {
            logger.error('Error checking token in admin middleware');
            res.status(401).json({
                success: false,
                message: 'Error checking token'
            });
        }
    }

}