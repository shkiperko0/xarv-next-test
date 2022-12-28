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
export type JSType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

export interface IObjectField{
    name: string,
    type: JSType,
    value: any
}

export interface IClassOf<Type=any>{
    new(): Type,
    new(_: any): any,
}

export interface IFieldReflection{
    name: string,
    disabled?: true,
    type: JSType,
    class?: IClassOf
}

export interface Params_ID{
	id: number
}

export interface Response_ID{
	id: number
}

export interface Params_List{
	limit: number,
	offset: number,
	count?: true,
}

export interface Params_Paged{
	page: number,
	perpage: number,
}

export interface Response_List<Type=never>{
    list: Type[],
    count: number
}

export const null_list: Response_List = { list: [], count: 0 }

export interface IFetchProvider{
    add(data: any): Promise<any>
    edit(data: any): Promise<any>
    get(id: number): Promise<any>
    list(req: Params_Paged): Promise<Response_List>
    delete(id: number): Promise<void>
}