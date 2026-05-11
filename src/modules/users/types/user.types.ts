export type role = 'admin' | 'user';

export type status = 'active' | 'inactive' | 'blocked'; 

export interface User {
    id: number,
    fullName: string,
    birthDate: Date,
    email: string,
    password: string,
    role: role,
    status: status
};

export interface Session {
    sessionToken: string,
    userId: number
};