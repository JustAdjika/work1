import { ApiError } from "../../../common/error.entity.ts";
import { redis } from "../../../database/redis/redis.ts";
import Users from "../../../database/sql/users.db.ts";

import * as UserTypes from "../types/user.types.ts";

export default class UserRepository {

    static async findByEmail(email: string) {
        return await Users.findOne({ where: { email } });
    };

    static async findById(id: number) {
        return await Users.findOne({ where: { id } });
    };

    static async create(fullName: string, birthDate: Date, email: string, hashPassword: string) {
        return await Users.create({
            fullName,
            birthDate,
            email,
            password: hashPassword,
            role: 'user',
            status: 'inactive'
        });
    };

    static async findBySessionId(sessionId: string) {
        const foundSession = await redis.get(sessionId);

        if(!foundSession) throw new ApiError('findBySessionId in UserRepository: User undefined', 404);
        const parsedSession = JSON.parse(foundSession) as UserTypes.Session

        return await Users.findOne({ where: { id: parsedSession.userId } })
    }
}