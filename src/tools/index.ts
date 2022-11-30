import { useEffect, useState } from "react";
import { HttpMethod, JSTypes } from "./types";

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
  
export function useJSONFetch<ResponseType=any, BodyType=any>(method: HttpMethod, input: RequestInfo | URL, body?: BodyType){
    const [ data, setData ] = useState<ResponseType | undefined>(undefined)
    const [ req, setReq ] = useState<typeof body>(body)
    const [ status, setStatus ] = useState(0)
    const [ error, setError ] = useState<any>(null)
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const _refetch = () => { 
        if(req !== undefined){
            setIsLoading(true)
            _async(req)
        } 
    }

    const _refetch_t = (ms: number = 2000) => () => {
        if(req !== undefined){
            setIsLoading(true)
            setTimeout(() => _async(req), ms)
        }
    }

    useEffect(_refetch, [req])

    const _async = async (body: BodyType) => {
        try{
            const response = await fetch(input, {
                method, 
                headers: Header_Auth_JSON(), 
                body: body ? JSON.stringify(body) : undefined
            })

            const json = await response.json()

            setStatus(response.status)
            setData(json)
            setError(null)
        }
        catch(error){
            setStatus(500)
            setData(undefined)
            setError(error)
        }
        setIsLoading(false)
    }

    return { req, fetch: (_: BodyType) => setReq({..._}), data, setData, status, setStatus, error, setError, isLoading }
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