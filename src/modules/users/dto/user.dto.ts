import * as UserTypes from "../types/user.types.ts"

export interface RegisterDto {
    name: string,
    birthdate: Date,
    email: string,
    password: string
};
export interface RegisterResponseDto {
    sessionToken: string
    sessionId: string
};


export interface LoginDto {
    email: string,
    password: string
};
export interface LoginResponseDto {
    sessionToken: string,
    sessionId: string
};


export interface getUserResponseDto {
    userData: responseUserDto
};


export interface getAllUserResponseDto {
    userList: responseUserDto[]
};



export type responseUserDto = Omit<UserTypes.User, "password">;