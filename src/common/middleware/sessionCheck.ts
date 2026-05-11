import type { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';

import { ApiError } from "../error.entity.ts";
import redis from "../../database/redis/redis.ts";
import { sendResponse } from "../utilities/response.ts";

import * as UserTypes from '../../modules/users/types/user.types.ts'

export default async function SessionCheck(req: Request, res: Response, next: NextFunction) {
    try {
        const [ sessionId, sessionToken ] = [ req.headers['x-session-id'], req.headers['authorization']?.replace('Bearer ', '')];

        if( !sessionId || !sessionToken || Array.isArray(sessionId) ) throw new ApiError(`Input data is incorrect`, 400, req);

        const foundSession = await redis.get(sessionId);

        if(!foundSession) throw new ApiError(`Session undefined`, 404, req);

        const parsedSession = JSON.parse(foundSession) as UserTypes.Session;

        if( !await bcrypt.compare(sessionToken, parsedSession.hashSessionToken) ) throw new ApiError('Session is invalid', 403, req);

        req.userId = parsedSession.userId;
        req.sessionToken = parsedSession.hashSessionToken;
        req.sessionId = sessionId;

        next();
    } catch (e) {
        if(e instanceof ApiError) sendResponse(res, e.status, e.message);
        else sendResponse(res, 500, `${req.method} ${req.baseUrl}${req.path}: Unexpected error`);
    }
}
