import bcrypt from 'bcrypt';
import crypto from 'crypto';

import * as DTO from '../dto/user.dto.ts';

import { redis } from '../../../database/redis/redis.ts';

import { ApiError } from "../../../common/error.entity.ts";
import { dataCheck } from "../../../common/utilities/dataCheck.ts";
import { logger } from '../../../common/logger.ts';
import UserRepository from '../repository/user.repository.ts';

export default class UserService {

    // Регистрация
    static async register(dto: DTO.RegisterDto) {
        try {
            const checkingResult = dataCheck([
                [dto.birthdate, 'string'],
                [dto.email, 'string'],
                [dto.name, 'string'],
                [dto.password, 'string']
            ]);

            if( !checkingResult ) throw new ApiError('register at UserService error: Input data is incorrect', 400);

            const foundSame = await UserRepository.findByEmail(dto.email);
            if(foundSame) throw new ApiError('register at UserService error: This email has already been registered', 409);

            const hashPassword = await bcrypt.hash( dto.password, 10 );

            const newUser = await UserRepository.create(dto.name, dto.birthdate, dto.email, hashPassword);

            logger.info(`Registered user (${newUser.dataValues.id}) ${newUser.dataValues.email}`);
        } catch (e) {
            if(e instanceof ApiError) throw new ApiError(e.message, e.status);
            else throw new ApiError('register at UserService error: Unexpected error', 500);
        };
    };

    // Логин
    static async login(dto: DTO.LoginDto) {
        try {
            const checkingResult = dataCheck([
                [dto.email, 'string'],
                [dto.password, 'string'],
            ]);

            if( !checkingResult ) throw new ApiError('login at UserService error: Input data is incorrect', 400);

            const foundSame = await UserRepository.findByEmail(dto.email);
            if( !foundSame ) throw new ApiError('login at UserService error: User undefined', 404);

            if( !await bcrypt.compare(dto.password, foundSame.dataValues.password) ) throw new ApiError('login at UserService error: Password incorrect', 403);

            const sessionToken = crypto.randomBytes(32).toString('hex');
            const hashSessionToken = await bcrypt.hash( sessionToken, 10 );
            const sessionId = crypto.randomBytes(32).toString('hex');
            

            redis.setEx(sessionId, 30 * 24 * 60 * 60, JSON.stringify({ userId: foundSame.dataValues.id, hashSessionToken }));

            logger.info(`The user has logged in (${foundSame.dataValues.id}) ${foundSame.dataValues.email}`);
            
            return { sessionId, sessionToken };
        } catch (e) {
            if(e instanceof ApiError) throw new ApiError(e.message, e.status);
            else throw new ApiError('login at UserService error: Unexpected error', 500);
        };
    };


    // Получить одного
    static async getData(targetId: number) {
        try {
            const foundUser = await UserRepository.findById(targetId);
            if( !foundUser ) throw new ApiError('getData at UserService error: User undefined', 404);

            const { password, ...safeUser } = foundUser.toJSON();

            return safeUser;
        } catch (e) {
            if(e instanceof ApiError) throw new ApiError(e.message, e.status);
            else throw new ApiError('getData at UserService error: Unexpected error', 500);
        };
    }
};