import bcrypt from 'bcrypt'
import crypto from 'crypto'

import type { RegisterDto } from "../dto/register.dto.ts";
import type { LoginDto } from "../dto/login.dto.ts"

import Users from "../../../database/sql/users.db.ts";
import { redis } from '../../../database/redis/redis.ts';

import { ApiError } from "../../../common/error.entity.ts";
import { dataCheck } from "../../../common/utilities/dataCheck.ts";
import { logger } from '../../../common/logger.ts';

export default class UserService {

    // Регистрация
    static async register(dto: RegisterDto) {
        try {
            const checkingResult = dataCheck([
                [dto.birthdate, 'string'],
                [dto.email, 'string'],
                [dto.name, 'string'],
                [dto.password, 'string']
            ]);

            if( !checkingResult ) throw new ApiError('register at UserService error: Input data is incorrect', 400);

            const foundSame = await Users.findOne({ where: { email: dto.email } });
            if(foundSame) throw new ApiError('register at UserService error: This email has already been registered', 409);

            const hashPassword = await bcrypt.hash( dto.password, 10 );

            const newUser = await Users.create({
                fullName: dto.name,
                birthDate: dto.birthdate,
                email: dto.email,
                password: hashPassword,
                role: 'user',
                status: 'inactive'
            })

            logger.info(`Registered user (${newUser.dataValues.id}) ${newUser.dataValues.email}`)
        } catch (e) {
            throw new ApiError('register at UserService error: Unexpected error', 500);
        }
    };

    static async login(dto: LoginDto) {
        try {
            const checkingResult = dataCheck([
                [dto.email, 'string'],
                [dto.password, 'string'],
            ]);

            if( !checkingResult ) throw new ApiError('login at UserService error: Input data is incorrect', 400);

            const foundSame = await Users.findOne({ where: { email: dto.email } });
            if( !foundSame ) throw new ApiError('login at UserService error: User undefined', 404);

            if( !await bcrypt.compare(dto.password, foundSame.dataValues.password) ) throw new ApiError('login at UserService error: Password incorrect', 403);

            const newToken = crypto.randomBytes(32).toString('hex');

            redis.setEx(newToken, 30 * 24 * 60 * 60, String(foundSame.dataValues.id));

            logger.info(`The user has logged in (${foundSame.dataValues.id}) ${foundSame.dataValues.email}`);
            
            return newToken;
        } catch (e) {
            throw new ApiError('login at UserService error: Unexpected error', 500);
        }
    }
};