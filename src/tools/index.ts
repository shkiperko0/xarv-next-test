import { useEffect, useState } from "react";
import { HttpMethod, IFetchProvider, JSType } from "./types";

export function getCookie(name: string): string {
	const { cookie } = document
	const rows = cookie.split('; ')
	const row = rows.find((row) => row.startsWith(`${name}=`))
	if (row) {
		const [_, value] = row?.split('=');
		return value
	}
	return ""
}

export const toBase64 = (data: string, enc: BufferEncoding = 'utf-8') => Buffer.from(data, enc).toString('base64')
export const fromBase64 = (data: string, enc: BufferEncoding = 'utf-8') => Buffer.from(data, 'base64').toString(enc)

export const AnyJSON_toBase64 = (data: any) => toBase64(JSON.stringify(data))
export const AnyJSON_fromBase64 = (data: string) => { try { return JSON.parse(fromBase64(data)) } catch (error) { return undefined } }

export function parseToken<Type = any>(token: string): Type {
	const [header, body, signature] = token.split('.');
	const json = fromBase64(body, 'utf-8')
	return JSON.parse(json)
}

export function setCookie(name: string, value: string, date: Date, path: string | null = '/') {
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

export function getDocument() {
	return (typeof document == 'undefined') ? null : document
}

export function getWindow() {
	return (typeof window == 'undefined') ? null : window
}

export async function fetchJSON<ResponseType = any, BodyType = any>(method: HttpMethod, input: RequestInfo | URL, body?: BodyType) {
	const res = await fetch(input, {
		method, headers: Header_Auth_JSON(),
		body: body ? JSON.stringify(body) : undefined
	})
	try{
		return await res.json() as ResponseType
	}
	catch(error){
		return
	}
}

type IFetchEntry = [HttpMethod, RequestInfo | URL]


interface IFetchState<ResponseType = any> {
	data?: ResponseType,
	status: number,
	isLoading: boolean,
	error?: any
}

interface IFetchResponse<ResponseType = any> {
	data?: ResponseType,
	status: number,
	error?: any
}

export function useJSONFetch<ResponseType = any, BodyType = any>(method: HttpMethod, input: RequestInfo | URL, body?: BodyType) {
	//const [ entry, setEntry ] = useState<IFetchEntry>([http_method, url])
	const [state, setFetchState] = useState<IFetchState<ResponseType>>({ status: 0, isLoading: false })
	const { data, status, isLoading, error } = state
	//const [ method, input ] = entry

	//const _method = (method: HttpMethod, input: RequestInfo) => setEntry([ method, input ])

	const _fetch = async (body?: BodyType): Promise<IFetchResponse<ResponseType>> => {
		if (body === undefined)
			return { status: 0, data, error }

		try {
			setFetchState({ status: 0, isLoading: true })

			const response = await fetch(input, {
				method,
				headers: Header_Auth_JSON(),
				body: body ? JSON.stringify(body) : undefined
			})

			let json
			try {
				json = await response.json()
			}
			catch (error) {
				json = undefined
			}
			setFetchState({ status: response.status, data: json, isLoading: false })
			return { status: response.status, data: json }
		}

		catch (error) {
			setFetchState({ status: 0, isLoading: false, error })
			return { status: 0, error }
		}
	}

	useEffect(() => { _fetch(body) }, [])

	return { fetch: _fetch, data, error, status, isLoading, setFetchState, /*entry, method: _method*/ }
}

export function findByKey<T>(array_of: T[], key: keyof T, value: any) {
	return array_of.find((item: T) => (item[key] === value))
}

export function keyByValue(object: object, value: any) {
	return Object.entries(object).find((entry) => entry[1] == value)?.[0]
}

export function GetObjectReflect(data: object) {
	return Object.fromEntries(Object.entries(data).map(([name, value]) => ([name, {
		title: name,
		type: typeof value,
		value,
		disabled: false
	}] as [string, any])))
}


export async function uploadForm(form: HTMLFormElement) {
	try {
		const response = await fetch(form.action, {
			method: 'POST',
			body: new FormData(form)
		})
		const json = await response.json()
		return json
	}
	catch (error) {
		console.error(error)
	}
	return {}
}

export type callback<Type> = () => Type
type cssfunc = () => string | null | undefined
type ICSSStyle = string | null | undefined | cssfunc 
type ICSSStyleCondition = boolean | null | undefined
type ICSSStyleArg = (ICSSStyle | callback<ICSSStyle> | [ICSSStyle, ICSSStyleCondition])

export function cl(...c: ICSSStyleArg[]) {
	return c.map(c => {
		if (c) {
			if (typeof c == 'string') return c
			if (typeof c == 'object') return c[1] ? (c[0] ?? null) : null
			if (typeof c == 'function') return c() ?? null
		}
		return null
	}).join(' ')
}

export function boolToString(bool: any): string {
	switch (typeof bool) {
		case 'boolean': return bool ? 'true' : 'false'
		case 'number': return bool > 0 ? 'true' : 'false'
		case 'string': return parseBool(bool) ? 'true' : 'false'
	}
	return 'false'
}

export const _str_boolean_true = ['true', 'y', 'yes', '+', 'on', 'enabled']
export const _str_boolean_false = ['false', 'n', 'no', '-', 'off', 'disabled']

export function parseBool(str: string): boolean {
	return _str_boolean_true.indexOf(str.toLowerCase()) != -1
}

export function formatBool(data: boolean, index = 0): string {
	const _str_boolean = data ? _str_boolean_true : _str_boolean_false
	return _str_boolean.length < index ? _str_boolean[index] : _str_boolean[0]
}

const _Type2Text = {
	boolean: (data: boolean) => data ? 'true' : 'false',
	number: (data: number) => data.toString(10),
	string: (data: string) => data,
	object: (data: object) => JSON.stringify(data),
}

export function Type2Text(data: any, type: string): string {
	if (data === undefined || data === null)
		return ''

	const parser = _Type2Text[type]
	return parser ? parser(data) : ''
}

const _Text2Type = {
	boolean: (text: string) => parseBool(text),
	number: (text: string) => parseInt(text, 10),
	string: (text: string) => text,
	object: (text: string) => { try { return JSON.parse(text) } catch (error) { return undefined } },
}

export function Text2Type(text: string, type: string): any {
	const format = _Text2Type[type]
	return format ? format(text) : undefined
}

export const defaultField_BooleanSelect = {
	default: true,
	options: [
		{ id: 0, title: 'false', value: false },
		{ id: 1, title: 'true', value: true }
	]
}

export type IValueHolder = Array<never> | Object
export type IValuePathCB = (holder: IValueHolder, ki: string | number) => any

export function cbByPath(root: IValueHolder, path: string, cb: IValuePathCB){
	let holder = root

	const parts = path.split('/')
	if(parts.length){
		let current = root
		let lpart: any

		for(const part of parts){
			holder = current
			if(typeof current !== 'object' || current === null)
				return

			current = current[part]
			lpart = part
		}

		return cb(holder, lpart)
	}

	return
}

export function ObjectRenameField(holder: Object, oldname: string, newname: string){
	holder[newname] = holder[oldname]
	delete holder[oldname]
	return
}

export function GetHolderValueByPath(root: IValueHolder, path: string){
	return cbByPath(root, path, (holder, ki) => holder[ki])
}


export function SetHolderValueByPath(root: IValueHolder, path: string, value: any){
	cbByPath(root, path, (holder, ki) => { 
		console.log({holder, path, ki, value})
		holder[ki] = value 
	})
	return 
}

export function DeleteHolderValueByPath(root: IValueHolder, path: string){
	cbByPath(root, path, (holder, ki) => { 
		if(holder instanceof Array){
			const index = typeof ki == 'string' ? parseInt(ki, 10) : ki
			holder.slice(index, 1)
			return
		}

		// else object
		delete holder[ki] 
	})
	return
}
