import express from "express";

import UserService from "../service/user.service.ts"; 

import { sendResponse } from "../../../common/utilities/response.ts";
import { ApiError } from "../../../common/error.entity.ts";
import { logger } from "../../../common/logger.ts";


const router = express.Router();

router.post('/register', async(req, res) => {
    try {
        const {
            birthdate,
            email,
            name,
            password
        } = req.body;

        if( !birthdate || !email || !name || !password ) throw new ApiError('register Error: Input data is incorrect', 400);

        await UserService.register({ birthdate, email, name, password });
        
        const newToken = await UserService.login({ email, password });

        sendResponse(res, 200, `The user has successfully registered and logged in ${email}`, { token: newToken });
    } catch (e) {
        if(e instanceof ApiError) sendResponse(res, e.status, e.message);
        else sendResponse(res, 500, 'register Error: Unexpected error')
    }
});

export default router;