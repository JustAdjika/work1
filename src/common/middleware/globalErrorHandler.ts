import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../error.entity.ts";
import { sendResponse } from "../utilities/response.ts";

export default async function GlobalErrorHandler(e: Error, req: Request, res: Response, next: NextFunction) {
    if(e instanceof ApiError) sendResponse(res, e.status, e.message);
    else sendResponse(res, 500, `${req.method} ${req.baseUrl}${req.path}: Unexpected error`);
}
