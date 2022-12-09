import styles from './MetaEditor.module.scss'
import { useState } from 'react'

type IMetaType = string | 'boolean' | 'number' | 'string' | 'object' | 'boolean[]' | 'number[]' | 'string[]' | 'object[]' // | 'class' | 'class[]'

export interface IEditorRegister{
	getValue(): any,
	setValue(_: any): void,
}

export interface IEditorRoot{
	getValue(path: string): any,
	setValue(path: string, value: any): void,
	data: IMeta,
} 

export interface IEditorProps<Type> {
	name: string,
	mt_key: IMetaKey<Type>,
	shell: number,
	root: IEditorRoot,
	path: string,
}

type IEditor<Type> = (props: IEditorProps<Type>) => JSX.Element

export interface IMetaKey<Type = any> {
	title?: string,
	description?: string,
	type: IMetaType,
	scheme?: IMetaScheme,
	Editor?: IEditor<Type>
	placeholder?: Type,
	defaultValue?: Type,
}


export interface IMetaScheme {
	[key: string]: IMetaKey
}

export type IMeta = object

interface IMetaEditorProps {
	scheme: IMetaScheme,
	meta: IMeta,
	onChange: (meta: IMeta) => void
}

export const EditorBoolean: IEditor<boolean> = (props) =>
	<BooleanField key={props.name} {...props} />

export const EditorNumber: IEditor<number> = (props) =>
	<NumberField key={props.name} {...props} />

export const EditorString: IEditor<string> = (props) =>
	<StringField key={props.name} {...props} />

export const EditorBooleanArray: IEditor<boolean[]> = (props) =>
	<BooleanArray key={props.name} {...props} />

export const EditorNumberArray: IEditor<number[]> = (props) =>
	<NumberArray key={props.name} {...props} />

export const EditorStringArray: IEditor<string[]> = (props) =>
	<StringArray key={props.name} {...props} />

export const EditorObject: IEditor<object> = (props) =>
	<ObjectField key={props.name} {...props} />

export const EditorObjectArray: IEditor<object[]> = (props) =>
	<ObjectArray key={props.name} {...props} />

export const meta_number: IMetaKey = { type: 'number', Editor: EditorNumber }
export const meta_string: IMetaKey = { type: 'string', Editor: EditorString }
export const meta_boolean: IMetaKey = { type: 'boolean', Editor: EditorBoolean }
export const meta_object = (scheme: IMetaScheme): IMetaKey => ({ type: 'object', Editor: EditorObject, scheme })
export const meta_number_array: IMetaKey = { type: 'number[]', Editor: EditorNumberArray }
export const meta_string_array: IMetaKey = { type: 'string[]', Editor: EditorStringArray }
export const meta_boolean_array: IMetaKey = { type: 'boolean[]', Editor: EditorBooleanArray }
export const meta_object_array = (scheme: IMetaScheme): IMetaKey => ({ type: 'object[]', Editor: EditorObjectArray, scheme })

// state={[value, setValue]} 

function ObjectField(props: IEditorProps<object>) {
	const { name, mt_key, shell, root, path } = props

	const { scheme } = mt_key
	if (!scheme) return <div>No scheme for '{name}'</div>

	const cb = function (name: string, key: IMetaKey) {
		const { Editor = () => (<div>No editor for '{name}'</div>) } = key

		return <Editor root={root} path={path + `/${name}`} shell={shell + 1} key={name} name={name} mt_key={key} />
	}

	return <div className={`${styles['field-object']} ${styles[`shell${shell}`]}`}>
		{name.length ? <span>{`${name}:`}</span> : null}
		{Object.entries(scheme).map(([name, key]) => cb(name, key))}
	</div>
}

export function boolToString(bool: any): string{
	switch(typeof bool){
		case 'boolean': 	return bool 			? 'true' : 'false'
		case 'number': 		return bool > 0 		? 'true' : 'false'
		case 'string': 		return parseBool(bool) 	? 'true' : 'false'
	}
	return 'false'
}

export function parseBool(str: string): boolean{
	return ['y', 'yes', 'true', '+'].indexOf(str) != -1 || parseInt(str, 10) > 0
}

function BooleanField(props: IEditorProps<boolean>) {
	const { name, mt_key: { defaultValue, placeholder, title, description }, shell, path, root } = props

	return <div className={styles['field-value'] + ' ' + styles[`shell${shell}`]}>
		<a title={path}>{title ?? name}: </a>
		<select 
			onChange={event => { 
				const value = parseBool(event.currentTarget.value)
				//console.log({ name: title ?? name, value})
				//setValue(value)
				root.setValue(path, value)
			}}
			defaultValue={boolToString(root.getValue(path) ?? defaultValue)}
		>
			<option value="true">true</option>
			<option value="false">false</option>
		</select>
	</div>
}

function StringField(props: IEditorProps<string>) {
	const { name, mt_key: { defaultValue, placeholder, title, description }, shell, path, root } = props
	return <div className={styles['field-value'] + ' ' + styles[`shell${shell}`]}>
		<a title={path}>{title ?? name}: </a>
		<input
			key={name}
			type='text'
			placeholder={placeholder}
			defaultValue={root.getValue(path) ?? defaultValue}
			onChange={event => root.setValue(path, event.currentTarget.value)}
		/>
	</div>
}

function NumberField(props: IEditorProps<number>) {
	const { name, mt_key: { defaultValue, placeholder, title, description }, shell, path, root } = props
	return <div className={styles['field-value'] + ' ' + styles[`shell${shell}`]}>
		<a title={path}>{title ?? name}: </a>
		<input
			key={name}
			type='text'
			placeholder={placeholder?.toString()}
			defaultValue={root.getValue(path) ?? defaultValue}
			onChange={event => root.setValue(path, parseInt(event.currentTarget.value, 10))}
		/>
	</div>
}

// state={[value, value => { self[index] = value }]} 

function ObjectArray(props: IEditorProps<object[]>) {
	const { name, mt_key, shell, root, path } = props
	const array = root.getValue(path)
	const [_, lengthChanged] = useState(array.length)
	return <div className={styles['field-array'] + ' ' + styles[`shell${shell}`]}>
		<span>{name}</span>
		{
			array.map((value, index, self) =>
				<ObjectField root={root} path={path + `/${index}`} shell={shell + 1} key={index} mt_key={{ 
					...mt_key, 
					type: 'object', 
					placeholder: mt_key.placeholder ? mt_key.placeholder[index] : undefined,
					defaultValue: mt_key.defaultValue ? mt_key.defaultValue[index] : undefined
				 } as any} name={`${index}`} />)
		}
		<button onClick={event => {
			array.push(GetKeyDefaultValue(mt_key))
			lengthChanged(array.length)
			event.stopPropagation()
			event.preventDefault()
		}}>Add row</button>
	</div>
}

// state={[value, value => { self[index] = value }]} 

function StringArray(props: IEditorProps<string[]>) {
	const { name, mt_key, shell, root, path } = props
	const array = root.getValue(path)
	const [_, lengthChanged] = useState(array.length)
	return <div className={styles['field-array'] + ' ' + styles[`shell${shell}`]}>
		<span>{name}</span>
		{
			array.map((value, index, self) =>
				<StringField root={root} path={path + `/${index}`} shell={shell + 1} key={index} mt_key={mt_key as any} name={`${index}`} />)
		}
		<button onClick={event => {
			array.push('')
			lengthChanged(array.length)
			event.stopPropagation()
			event.preventDefault()
		}}>Add row</button>
	</div>
}


function BooleanArray(props: IEditorProps<boolean[]>) {
	const { name, mt_key, shell, root, path } = props
	const array = root.getValue(path)
	const [_, lengthChanged] = useState(array.length)
	return <div className={styles['field-array'] + ' ' + styles[`shell${shell}`]}>
		<span>{name}</span>
		{
			array.map((value, index, self) =>
				<BooleanField root={root} path={path + `/${index}`} shell={shell + 1} key={index} mt_key={mt_key as any} name={`${index}`} />)
		}
		<button onClick={event => {
			array.push(false)
			lengthChanged(array.length)
			event.stopPropagation()
			event.preventDefault()
		}}>Add row</button>
	</div>
}

// state={[value, value => { self[index] = value }]} 

function NumberArray(props: IEditorProps<number[]>) {
	const { name, mt_key, shell, root, path } = props
	const array = root.getValue(path)
	const [_, lengthChanged] = useState(array.length)
	return <div className={styles['field-array'] + ' ' + styles[`shell${shell}`]}>
		<span>{name}</span>
		{
			array.map((value, index, self) =>
				<NumberField root={root} path={path + `/${index}`} shell={shell + 1} key={index} mt_key={mt_key as any} name={`${index}`} />)
		}
		<button onClick={event => {
			array.push(0)
			lengthChanged(array.length)
			event.stopPropagation()
			event.preventDefault()
		}}>Add row</button>
	</div>
}

function isTypeArray(mtype: IMetaType) {
	const a = mtype.indexOf('[')
	if (a == -1) return { type: mtype }
	const type = mtype.substring(0, a)

	const b = mtype.indexOf(']', a)
	if (b == -1) return { type }

	return { type, isArray: true }
}

function MetaTypeCheck(mtype: IMetaType, meta: any) {
	const type = typeof meta
	if (type == mtype) return true
	if (type == 'object')
		return isTypeArray(mtype).isArray ? meta instanceof Array : meta instanceof Object
	return false
}

export function NormalizeMeta(meta: any, key: IMetaKey) {

	if (!MetaTypeCheck(key.type, meta)) {
		meta = GetKeyDefaultValue(key)
	}

	else if (typeof meta == 'object') {
		if (meta instanceof Array) {
			// debugger
			const nkey = { type: isTypeArray(key.type).type, scheme: key.scheme }
			meta = meta.map(meta => NormalizeMeta(meta, nkey))
		}

		else if (meta instanceof Object) {
			meta = Object.fromEntries(Object.entries(key.scheme!).map(([name, scheme]) => {

				//debugger
				return [name, NormalizeMeta(meta[name], scheme)]
			}))
		}
	}

	//debugger
	return meta
}

function GetObjetcKeyDefaultValue(key: IMetaKey) {
	const { scheme = {} } = key
	let obj: any = {}

	for (const key_name of Object.keys(scheme)) {
		obj[key_name] = GetKeyDefaultValue(scheme[key_name])
	}

	return obj
}

export function GetKeyDefaultValue(key: IMetaKey) {
	if (!key) debugger

	if (key.defaultValue) return key.defaultValue

	switch (key.type) {
		case 'number': return 0
		case 'string': return ''
		case 'boolean': return false
		case 'object': return GetObjetcKeyDefaultValue(key)
		case 'number[]': return []
		case 'string[]': return []
		case 'object[]': return []
		case 'boolean[]': return []
	}
	return
}


export function GetSchemeFromData(data: any): IMetaScheme {
	let scheme: IMetaScheme = {}

	for (const [key, value] of Object.entries(data)) {
		const type = typeof value;
		const custom_editor = data[`_${key}_editor`]

		if (type == 'string') {
			scheme[key] = {
				type,
				Editor: custom_editor ?? EditorString,
				placeholder: value,
				defaultValue: value
			}
		}

		else if (type == 'number') {
			scheme[key] = {
				type,
				Editor: custom_editor ?? EditorNumber,
				placeholder: value,
				defaultValue: value
			}
		}

		else if (type == 'boolean') {
			scheme[key] = {
				type,
				Editor: custom_editor ?? EditorBoolean,
				placeholder: value,
				defaultValue: value
			}
		}

		else if (type == 'object') {
			if (value instanceof Array) {
				const type = typeof value[0];
				if (type == 'string') {
					scheme[key] = {
						type: 'string[]',
						Editor: custom_editor ?? EditorStringArray,
						//placeholder: value, 
						defaultValue: value
					}
				}

				else if (type == 'number') {
					scheme[key] = {
						type: 'number[]',
						Editor: custom_editor ?? EditorNumberArray,
						//placeholder: value, 
						defaultValue: value
					}
				}

				else if (type == 'boolean') {
					scheme[key] = {
						type: 'boolean[]',
						Editor: custom_editor ?? EditorBooleanArray,
						//placeholder: value, 
						defaultValue: value
					}
				}

				else if (type == 'object' && value[0] instanceof Object) {
					scheme[key] = {
						type: 'object[]',
						scheme: GetSchemeFromData(value[0]),
						Editor: custom_editor ?? EditorObjectArray,
						defaultValue: value,
						placeholder: value
					}
				}

				else {
				}
			}

			else if (value instanceof Object) {
				scheme[key] = {
					type: 'object',
					scheme: GetSchemeFromData(value),
					Editor: custom_editor ?? EditorObject,
					placeholder: value,
					defaultValue: value
				}
			}

			else {

			}
		}

	}

	return scheme

}


export function cbByPath(root: object, path: string, cb: (parent: object, key: string) => any){
	let lroot = root
	const parts = path.split('/').slice(1)
	if(parts.length){
		let current = root
		let lpart: any

		for(const part of parts){
			lroot = current
			current = current[part]
			lpart = part
		}

		return cb(lroot, lpart)
	}

	return undefined
}

export function getValueByPath(root: object, path: string){
	return cbByPath(root, path, (root, key) => root[key])
}


export function setValueByPath(root: object, path: string, value: any){
	return cbByPath(root, path, (root, key) => { root[key] = value })
}

export function MetaEditor(props: IMetaEditorProps) {
	const { scheme, onChange, meta } = props
	return <>
		<div className={styles['meta-editor']}>
			<EditorObject 
				root={{
					getValue: (path) => getValueByPath(meta, path),
					setValue: (path, value) => setValueByPath(meta, path, value),
					data: meta
				}} 
				path={''} 
				shell={0} 
				mt_key={{ 
					type: 'object', 
					scheme 
				}} 
				name=''
			/>
			<button
				onClick={
					event => {
						onChange && onChange(JSON.parse(JSON.stringify(meta)))
						event.stopPropagation()
						event.preventDefault()
					}
				}
			>
				Apply
			</button>
		</div>
	</>
}