import express from "express";

import UserService from "../service/user.service.ts"; 

import { sendResponse } from "../../../common/utilities/response.ts";
import { ApiError } from "../../../common/error.entity.ts";
import * as DTO from "../dto/user.dto.ts";
import RoleGuard from "../guards/role.guard.ts";
import UserRepository from "../repository/user.repository.ts";


const router = express.Router();

router.post('/register', async(req, res) => {
    try {
        const {
            birthdate,
            email,
            name,
            password
        } = req.body;

        if( !birthdate || !email || !name || !password ) throw new ApiError(`Input data is incorrect`, 400, req);

        await UserService.register({ birthdate, email, name, password });
        
        const loginData = await UserService.login({ email, password });

        sendResponse<DTO.RegisterResponseDto>(
            res, 
            200, 
            `${req.method} ${req.baseUrl}${req.path}: Successful register ${email}`, 
            { 
                sessionId: loginData.sessionId, 
                sessionToken: loginData.sessionToken 
            }
        );
    } catch (e) {
        if(e instanceof ApiError) sendResponse(res, e.status, e.message);
        else sendResponse(res, 500, `${req.method} ${req.baseUrl}${req.path}: Unexpected error`);
    }
});

router.post('/login', async(req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if( !email || !password ) throw new ApiError(`Input data is incorrect`, 400, req);

        const loginData = await UserService.login({ email, password });

        sendResponse<DTO.LoginResponseDto>(
            res, 
            200, 
            `${req.method} ${req.baseUrl}${req.path}: Successful login ${email}`, 
            { 
                sessionId: loginData.sessionId,
                sessionToken: loginData.sessionToken
            }
        );
    } catch (e) {
        if(e instanceof ApiError) sendResponse(res, e.status, e.message);
        else sendResponse(res, 500, `${req.method} ${req.baseUrl}${req.path}: Unexpected error`);
    }
});

router.post('/:id', async(req, res) => {
    try {
        const {
            sessionId,
            sessionToken
        } = req.body;

        if( !sessionId || !sessionToken ) throw new ApiError(`Input data is incorrect`, 400, req);

        const executer = await UserRepository.findBySessionId(sessionId);
        if( !executer ) throw new ApiError('Executer undefined', 404, req);

        if(!await RoleGuard.is('admin', executer.dataValues.id) && executer.dataValues.id !== Number(req.params.id)) throw new ApiError('Forbidden', 403);

        const foundUser = await UserService.getData(Number(req.params.id));

        if(!foundUser) throw new ApiError('Target user undefined', 404, req);

        sendResponse<DTO.getUserResponseDto>(
            res, 
            200, 
            `${req.method} ${req.baseUrl}${req.path}: User ${req.params.id} information received (${sessionId})`,
            {
                userData: foundUser
            }
        );
    } catch (e) {
        if(e instanceof ApiError) sendResponse(res, e.status, e.message);
        else sendResponse(res, 500, `${req.method} ${req.baseUrl}${req.path}: Unexpected error`);
    }
});

export default router;