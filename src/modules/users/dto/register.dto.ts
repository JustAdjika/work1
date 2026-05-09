export interface RegisterDto {
    name: string,
    birthdate: Date,
    email: string,
    password: string
}
export interface RegisterResponseDto {
    sessionToken: string
}