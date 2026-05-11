import { ApiError } from "../../../common/error.entity.ts";
import redis from "../../../database/redis/redis.ts";
import Users from "../../../database/sql/users.db.ts";

import * as UserTypes from "../types/user.types.ts";

export default class UserRepository {

    static async findByEmail(email: string) {
        return await Users.findOne({ where: { email } });
    };

    static async findById(id: number) {
        return await Users.findOne({ where: { id } });
    };

    static async findAll() {
        return await Users.findAll();
    }

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

    static async updateStatus(userId: number, status: UserTypes.status) {
        const foundUser = await Users.findOne({ where: { id: userId } });
        if( !foundUser ) throw new ApiError('updateStatus at UserService error: User undefined', 404);

        await foundUser.update({ status });
    } 
}