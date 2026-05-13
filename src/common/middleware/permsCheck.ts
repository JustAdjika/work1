import type { NextFunction, Request, Response, RequestHandler } from "express";

import { ApiError } from "../error.entity.ts";
import UserRepository from "../../modules/users/repository/user.repository.ts";
import RoleGuard from "../../modules/users/guards/role.guard.ts";
import { sendResponse } from "../utilities/response.ts";

const validator = async(req: Request) => {
    if( !req.userId ) throw new ApiError(`User undefined`, 404, req);

    const executer = await UserRepository.findById(req.userId);
    if( !executer ) throw new ApiError('Executer undefined', 404, req);

    return executer;
}

export default class PermsCheck {

    // проверка на администратора
    static isAdmin(action: RequestHandler = () => { throw new ApiError('Forbidden', 403) }) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const executer = await validator(req);
    
            if( !await RoleGuard.is('admin', executer.dataValues.id) ) return action(req, res, next);

            next();
        } 

    }

    // проверка на администратора
    static isOwner(action: RequestHandler = () => { throw new ApiError('Forbidden', 403) } ) {

        return async (req: Request, res: Response, next: NextFunction) => {
            const executer = await validator(req);
    
            if( executer.dataValues.id !== Number(req.params.id) ) return action(req, res, next);

            next();
        } 

    }
}