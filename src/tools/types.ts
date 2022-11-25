
export interface IUserProfile{
    user_id: number,
    role: string,
    email: string,
    alias: string,
}

export interface ITokenPayload{
    version: string,
}

export interface ITokenPayload_V1 extends ITokenPayload{
    alias: string
    email: string,
    role: string,
    session_id: string,
    user_id: number,
}