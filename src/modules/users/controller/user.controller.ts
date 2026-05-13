import express from "express";

import UserService from "../service/user.service.ts"; 

import { sendResponse } from "../../../common/utilities/response.ts";
import { ApiError } from "../../../common/error.entity.ts";
import PermsCheck from "../../../common/middleware/permsCheck.ts";
import SessionCheck from "../../../common/middleware/sessionCheck.ts";

import * as DTO from "../dto/user.dto.ts";

const router = express.Router();

router.post('/register', async(req, res) => {
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
});

router.post('/login', async(req, res) => {
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
});

router.get('/personal/:id', SessionCheck, PermsCheck.isAdmin(PermsCheck.isOwner()), async(req, res) => {
    const foundUser = await UserService.getData(Number(req.params.id));

    if(!foundUser) throw new ApiError('Target user undefined', 404, req);

    sendResponse<DTO.getUserResponseDto>(
        res, 
        200, 
        `${req.method} ${req.baseUrl}${req.path}: User ${req.params.id} information received (${req.sessionId})`,
        { userData: foundUser }
    );
});

router.get('/all', SessionCheck, PermsCheck.isAdmin(), async(req, res) => {
    const userList = await UserService.getAll();

    sendResponse<DTO.getAllUserResponseDto>(
        res, 
        200, 
        `${req.method} ${req.baseUrl}${req.path}: User information list received (${req.sessionId})`,
        { userList }
    );
});

router.patch('/ban/:id', SessionCheck, PermsCheck.isAdmin(PermsCheck.isOwner()), async(req, res) => {
    if( !req.params.id ) throw new ApiError(`Input data is incorrect`, 400, req);

    await UserService.ban(Number(req.params.id));

    sendResponse(
        res, 
        200, 
        `${req.method} ${req.baseUrl}${req.path}: User ${req.params.id} banned (${req.sessionId})`,
    );
});



export default router;