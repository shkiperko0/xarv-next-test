import { useEffect, useState } from "react";
import { number } from "react-admin";
import { HttpMethod, JSType } from "./types";

export function getCookie(name: string): string {
    const { cookie } = document
    const rows = cookie.split('; ')
    const row = rows.find((row) => row.startsWith(`${name}=`))
    if(row){
        const [_, value] = row?.split('='); 
        return value
    }
    return ""
}

export const toBase64 = (data: string, enc: BufferEncoding = 'utf-8') => Buffer.from(data, enc).toString('base64')
export const fromBase64 = (data: string, enc: BufferEncoding = 'utf-8') => Buffer.from(data, 'base64').toString(enc)

export const AnyJSON_toBase64 = (data: any) => toBase64(JSON.stringify(data))
export const AnyJSON_fromBase64 = (data: string) => { try{ return JSON.parse(fromBase64(data)) } catch(error) { return undefined } }

export function parseToken<Type=any>(token: string): Type {
    const [ header, body, signature ] = token.split('.');
    const json = fromBase64(body, 'utf-8')
    return JSON.parse(json)
}

export function setCookie(name: string, value: string, date: Date, path: string | null ='/'){
    const expires = date.toUTCString()
    // Thu, 18 Dec 2013 12:00:00 UTC
    console.log({ cookie: { name, value, expires } })
    document.cookie = `${name}=${value}; expires=${expires}; ${path ? `path=${path};` : null}SameSite=Strict`
}

export const clearCookie = (name: string) => setCookie(name, '', new Date(1))

export const getRefreshToken = () => getCookie('refreshToken')
export const getAccessToken = () => getCookie('accessToken')

export const clearAuthCookies = () => ['refreshToken', 'accessToken'].forEach(name => clearCookie(name))

export const Header_Auth = () => ({
    Authorization: `Bearer ${getRefreshToken()}`
})

export const Header_Auth_JSON = () => ({
    Authorization: `Bearer ${getRefreshToken()}`,
    'Content-Type': 'application/json'
})

export function getDocument(){
    return (typeof document == 'undefined') ? null : document
}

export function getWindow(){
    return (typeof window == 'undefined') ? null : window
}

export async function fetchJSON<ResponseType=any, BodyType=any>(method: HttpMethod, input: RequestInfo | URL, body?: BodyType) {
    const res = await fetch(input, {
        method, 
        headers: Header_Auth_JSON(), 
        body: body ? JSON.stringify(body) : undefined
    })
    return await res.json()
}

type IFetchEntry = [HttpMethod, RequestInfo | URL]


interface IFetchState<ResponseType=any>{
    data?: ResponseType,
    status: number,
    isLoading: boolean,
    error?: any
}

interface IFetchResponse<ResponseType=any>{
    data?: ResponseType,
    status: number,
    error?: any
}
  
export function useJSONFetch<ResponseType=any, BodyType=any>(method: HttpMethod, input: RequestInfo | URL, body?: BodyType){
    //const [ entry, setEntry ] = useState<IFetchEntry>([http_method, url])
    const [ state, setFetchState ] = useState<IFetchState<ResponseType>>({ status: 0, isLoading: false })
    const { data, status, isLoading, error } = state
    //const [ method, input ] = entry

    //const _method = (method: HttpMethod, input: RequestInfo) => setEntry([ method, input ])

    const _fetch = async (body?: BodyType): Promise<IFetchResponse<ResponseType>> => {
        if(body === undefined) 
            return { status: 0, data, error }

        try{
            setFetchState({ status: 0, isLoading: true })

            const response = await fetch(input, {
                method, 
                headers: Header_Auth_JSON(), 
                body: body ? JSON.stringify(body) : undefined
            })

            let json
            try{
                json = await response.json()
            }
            catch(error){
                json = undefined
            }
            setFetchState({ status: response.status, data: json, isLoading: false })
            return { status: response.status, data: json }
        }

        catch(error){
            setFetchState({ status: 0, isLoading: false, error })
            return { status: 0, error }
        }
    }

    useEffect(() => { _fetch(body) }, [])

    return { fetch: _fetch, data, error, status, isLoading, setFetchState, /*entry, method: _method*/ }
}

export interface IFetchProvider<Type=any>{
    get(id: number): Promise<Type>,
    edit(data: Type): Promise<Type>
    list(): Promise<Type>
    delete(id: number): Promise<Type>
}

export class FetchProvider implements IFetchProvider{
    async get(id: number): Promise<any> {
        throw new Error("Get method not implemented.");
    }
    async edit(data: any): Promise<any> {
        throw new Error("Edit method not implemented.");
    }
    async list(): Promise<any> {
        throw new Error("List method not implemented.");
    }
    async delete(id: number): Promise<any> {
        throw new Error("Delete method not implemented.");
    }
}

export const useFetchProvider = (provider: IFetchProvider) => {

} 

export function findByKey<T>(array_of: T[], key: keyof T, value: any){
    return array_of.find((item: T) => (item[key] === value))
}

export function keyByValue(object: object, value: any){
  return Object.entries(object).find((entry) => entry[1] == value)?.[0]
}

export function GetObjectReflect(data: object){
    return Object.fromEntries(Object.entries(data).map(([name, value]) => ([name, {
        title: name,
        type: typeof value,
        value,
        disabled: false
    }] as [string, any])))
}