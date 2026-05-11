import { ApiError } from "../../../common/error.entity.ts";
import UserRepository from "../repository/user.repository.ts";
import type { role } from "../types/user.types.ts";

export default class RoleGuard {
    static async is(role: role, id: number) {
        const foundUser = await UserRepository.findById(id)
        
        if( !foundUser ) throw new ApiError('RoleGuard "is" error: User undefined', 404);

        return foundUser.dataValues.role === role;
    }
}