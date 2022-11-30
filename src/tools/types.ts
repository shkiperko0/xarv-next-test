import { MouseEvent } from "react"

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

export interface IButtonProps<Element=any>{
    onClick?(event: MouseEvent<Element>): void
}

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS'
export type JSTypes = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

export interface IObjectField{
    name: string,
    type: JSTypes,
    value: any
}