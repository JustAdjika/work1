import type { NextFunction, Request, Response, RequestHandler } from "express";

import { ApiError } from "../error.entity.ts";
import UserRepository from "../../modules/users/repository/user.repository.ts";
import RoleGuard from "../../modules/users/guards/role.guard.ts";
import { sendResponse } from "../utilities/response.ts";

// Колбэк функция для возможности проверки на администратора и владельца комплексно
type callbackType = RequestHandler;

export default class PermsCheck {

    // проверка на администратора
    static isAdmin(action: RequestHandler = () => { throw new ApiError('Forbidden', 403) }) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    sessionId,
                    sessionToken
                } = req.body;
        
                if( !sessionId || !sessionToken ) throw new ApiError(`Input data is incorrect`, 400, req);
        
                const executer = await UserRepository.findBySessionId(sessionId);
                if( !executer ) throw new ApiError('Executer undefined', 404, req);
        
                if( !await RoleGuard.is('admin', executer.dataValues.id) ) return action(req, res, next);

                next();
            } catch (e) {
                if(e instanceof ApiError) sendResponse(res, e.status, e.message);
                else sendResponse(res, 500, `${req.method} ${req.baseUrl}${req.path}: Unexpected error`);
            }
        } 

    }

    // проверка на администратора
    static isOwner(action: RequestHandler = () => { throw new ApiError('Forbidden', 403) } ) {

        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    sessionId,
                    sessionToken
                } = req.body;
        
                if( !sessionId || !sessionToken ) throw new ApiError(`Input data is incorrect`, 400, req);
        
                const executer = await UserRepository.findBySessionId(sessionId);
                if( !executer ) throw new ApiError('Executer undefined', 404, req);
        
                if( executer.dataValues.id !== Number(req.params.id) ) return action(req, res, next);

                next();
            } catch (e) {
                if(e instanceof ApiError) sendResponse(res, e.status, e.message);
                else sendResponse(res, 500, `${req.method} ${req.baseUrl}${req.path}: Unexpected error`);
            }
        } 

    }
}