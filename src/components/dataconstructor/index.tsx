import styles from './styles.module.scss'
import { ChangeEventHandler, MouseEventHandler, useMemo, useState } from 'react'
import { ISelectEventHandler, ISelectOptions, Select } from '@components/gui/Select'
import { Button } from '@components/gui/Button'
import { parseBool } from 'src/tools'

type IDataType = 'boolean' | 'number' | 'string' | 'object' | 'undefined'
type IDataClass = 'Array' | 'Object' | 'null'

const CHolderField = '*'

class JSONConstructor{
    [CHolderField]: any = undefined

    constructor(data: any){
        this[CHolderField] = data
    }

    getData(){
        return this[CHolderField]
    }

    cbByPath(path: string, cb: (parent: object, key: string) => any){
        if(path == '')
            return cb(this, CHolderField)

        let last = this[CHolderField]
        const parts = path.split('/').slice(1)
        if(parts.length){
            let current = last
            let lpart: any
    
            for(const part of parts){
                last = current
                current = current[part]
                lpart = part
            }
    
            return cb(last, lpart)
        }
    
        return undefined
    }
    
    getValueByPath(path: string){
        return this.cbByPath(path, (parent, key) => parent[key])
    }
    
    
    setValueByPath(path: string, value: any){
        return this.cbByPath(path, (parent, key) => { parent[key] = value })
    }
    
    deleteValueByPath(path: string){
        return this.cbByPath(path, (parent, key) => { delete parent[key] })
    }
}

export interface IEditorProps<Type=any> {
	ctor: JSONConstructor,
	path: string,
}

export type IEditor<Type=any> = (props: IEditorProps<Type>) => JSX.Element

export interface IDataKey<Type=any> {
	type: IDataType,
    class?: IDataClass, 
	Editor?: IEditor<Type>,
    defaultValue?: IData,
    
	title?: string,
	description?: string,
	placeholder?: Type,
	
    scheme?: IDataScheme,
}

export type IDataScheme = {[key: string]: IDataKey} | IDataKey[] 
export type IData = any

export const data_number: IDataKey = { type: 'number', Editor: EditorNumber }
export const data_string: IDataKey = { type: 'string', Editor: EditorString }
export const data_boolean: IDataKey = { type: 'boolean', Editor: EditorBoolean }
export const data_object: IDataKey = { type: 'object', class: 'Object', Editor: EditorObject }
export const data_array: IDataKey = { type: 'object', class: 'Array', Editor: EditorArray }

function EditorBoolean(props: IEditorProps<boolean>) {
	const { path, ctor } = props

	return <span className={styles['field-value']}>
		{/* <a title={path}>{title ?? name}: </a> */}
		<select 
			onChange={event => { 
				const value = parseBool(event.currentTarget.value)
				//console.log({ name: title ?? name, value})
				//setValue(value)
                ctor.setValueByPath(path, value)
			}}
		>
			<option value="true">true</option>
			<option value="false">false</option>
		</select>
	</span>
}

function EditorString(props: IEditorProps<string>) {
	const { path, ctor } = props
	return <span className={styles['field-value']}>
		{/* <a title={path}>{title ?? name}: </a> */}
		<input
			type='text'
			defaultValue={ ctor.getValueByPath(path) }
			onChange={event => ctor.setValueByPath(path, event.currentTarget.value) }
		/>
	</span>
}

function EditorNumber(props: IEditorProps<number>) {
	const { path, ctor } = props
	return <span className={styles['field-value']}>
		{/* <a title={path}>{title ?? name}: </a> */}
		<input
			type='text'
			defaultValue={ ctor.getValueByPath(path)}
			onChange={event => ctor.setValueByPath(path, parseInt(event.currentTarget.value, 10)) }
		/>
	</span>
}

interface IEditorObjectFieldProps{
    ctor: JSONConstructor,
    path: string,
    name: string,
    onChangeName: (path: string, name: string) => void,
}

function EditorObjectField(props: IEditorObjectFieldProps) {
    const { ctor, path, name, onChangeName } = props
    return <>
        <span className={styles.field}>
            <input defaultValue={name} onChange={(e) => onChangeName(path, e.target.value)}/>
            <TypeEditor ctor={ctor} path={path + `/${name}`} />asdas
        </span>
    </>
}

function EditorObject(props: IEditorProps<object>) {
	const { ctor, path } = props
    const [ data , setData ] = useState(() => ctor.getValueByPath(path))

    if(typeof data != 'object' || data === null || data === undefined)
        return <>{typeof data} {path} {JSON.stringify({ctor})}</>

    const addField: MouseEventHandler = () => {
        // const new_data = { ...data, [CHolderField]: undefined }
        // setValueByPath(ctor, path, new_data)
        // setData(new_data)
    }

    const onChangeName = (fpath: string, name: string) => {
        // const data = getValueByPath(ctor, fpath)
        // setValueByPath(ctor, path + '/' + name , data)
        // deleteValueByPath(ctor, fpath)
    }

	return <span className={styles.object}>
        <>{typeof data} {path} {JSON.stringify({ctor})}</>
        { Object.entries(data).map(([name]) => <EditorObjectField onChangeName={onChangeName} name={name} ctor={ctor} path={path + `/${name}`} />) }
        <Button onClick={addField}>Add field</Button>
	</span>
}

function EditorArray(props: IEditorProps<Array<any>>) {
	const { ctor, path } = props
    const [ data = [], setData ] = useState(() => ctor.getValueByPath(path))

    if(typeof data != 'object' || data === null || data === undefined)
        return <>{typeof data} {path} {JSON.stringify({ctor})}</>

    const addValue: MouseEventHandler = () => {
        const new_data = [ ...data, undefined ]
        ctor.setValueByPath(path, new_data)
        setData(new_data)
    }

	return <span className={styles.array}>
        {typeof data} {path} {JSON.stringify({ctor})}
        { data.map((_, index) => <TypeEditor ctor={ctor} path={path + `/${index}`} />) }
        <Button onClick={addValue}>Add value</Button>
	</span>
}

export function NormalizeData(data: IData, key: IDataKey) {
    const data_t = typeof data

    if(data_t != key.type){
        return GetKeyDefaultValue(key)
    }

    if(typeof data == 'object' && data.constructor.name != key.class){

        if(key.scheme)


        return GetKeyDefaultValue(key)
    }

	return data
}

function GetObjetcKeyDefaultValue(key: IDataKey) {

	switch(key.class){
        case 'Array': return new Array()
        case 'Object': return new Object()
        case 'null': return null
    }

	return {}
}

export function GetKeyDefaultValue(key: IDataKey): IData {
	if (!key) debugger

	if (key.defaultValue) return key.defaultValue

	switch (key.type) {
		case 'number': return 0
		case 'undefined': return undefined
		case 'string': return ''
		case 'boolean': return false
		case 'object': return GetObjetcKeyDefaultValue(key)
	}
}


export function GetSchemeFromData(data: any): IDataScheme {
	let scheme: IDataScheme = {}

	for (const [key, value] of Object.entries(data)) {
		const type = typeof value;
    }

	return scheme
}




export type DataChangeHandler = (data: IData) => void



export interface ITypeEditorProps{

} 

type IDataTC = [IDataType, IDataClass?]

function GetConstructor(data: any): IDataClass | undefined {
    return typeof data == 'object' ? (data ? data.constructor.name : 'null') : undefined
}

function GetValueTC(data: any): IDataTC {
    return [ (typeof data as IDataType), GetConstructor(data) ]
}

function GetEditor([data_t, class_t]: IDataTC): IEditor {

    if(data_t == 'undefined')
        return () => <>{`<undefined>`}</>

    if(data_t == 'boolean')
        return EditorBoolean

    if(data_t == 'number')
        return EditorNumber

    if(data_t == 'string')
        return EditorString

    if(data_t == 'object'){
        
        if(class_t == 'Array')
            return EditorArray

        if(class_t == 'Object')
            return EditorObject

        if(class_t == 'null')
            return () => <>{`<null>`}</>

        return () => <>Invalid editor {data_t}:{class_t}</>
    }

    return () => <>Invalid editor {data_t}</>
}

const type_options: ISelectOptions<IDataType> = [
    { id: 0, value: 'undefined' },
    { id: 1, value: 'boolean' },
    { id: 2, value: 'number' },
    { id: 3, value: 'string' },
    { id: 4, value: 'object' },
]

const class_options: ISelectOptions<IDataClass> = [
    { id: 0, value: 'null' },
    { id: 1, value: 'Object' },
    { id: 2, value: 'Array' },
]

function GetTCDefaultValue([type_t, class_t]: IDataTC): any{
    if(type_t === 'boolean') return false
    if(type_t === 'number') return 0
    if(type_t === 'string') return ''
    if(type_t === 'object'){
        if(class_t === 'Array') return new Array()
        if(class_t === 'Object') return new Object()
        if(class_t === 'null') return null
        return {}
    }
    return undefined
}

export interface ITypeEditorProps{
    ctor: JSONConstructor,
    path: string,
}

export function TypeEditor(props: ITypeEditorProps){
    interface IValueState{
        type: IDataType,
        class?: IDataClass
        data: any
    }

    const { path, ctor } = props

    const [ state, setState ] = useState<IValueState>(() => {
        const data = ctor.getValueByPath(path)
        const tc = GetValueTC(data)
        return { data, type: tc[0], class: tc[1] }
    })

    const tc = GetValueTC(state.data)
    const Editor = GetEditor(tc)

    const onTC_Changed = (tc: IDataTC) => {
        const data = GetTCDefaultValue(tc)
        setState({
            data,
            type: tc[0],
            class: tc[1]
        })
        ctor.setValueByPath(path, data)
    }

    const onSelectType: ISelectEventHandler = (option) => {
        onTC_Changed([ option.value, state.class ])
    }

    const onSelectClass: ISelectEventHandler = (option) => {
        onTC_Changed([ state.type, option.value ])
    }

    const { data } = state

    return <span className={styles.typeeditor}>
        <Select className={styles.select} onSelect={onSelectType} options={type_options} defaultValue={state.type} />
        { (tc[0] == 'object') && <Select className={styles.select} onSelect={onSelectClass} options={class_options} defaultValue={state.class} /> }
        <Editor path={path} ctor={ctor}  />
    </span>
}


export interface IDataEditorProps {
	data: IData,
	onChange: DataChangeHandler
}


function isspace(c){
    return c == '\t' || c == ' '|| c == '\n'
}

function skip_last(text: string, index = 0){
    let i = index
    for(; isspace(text[i]) && (i < text.length) ; i++){}
    return i
}

function skip_next(text: string, index = 0){
    let i = index
    for(; isspace(text[i]) && (i < text.length) ; i++){}
    return i
}

function tabs(count = 0){
    let result = ''
    for(let j = 0; j < count; j++){
        result += '    '
    }
    return result
}

function tabbed(text: string){
    let result = ''
    let t = 0
    for(let i = 0 ; i < text.length ; i++){
        if(text[i] == '[' || text[i] == '{'){
            t++;
            result += (text[i] + '\n' + tabs(t))
            i = skip_next(text, i + 1) - 1
            continue;
        }

        if(text[i] == ','){
            result += (text[i] + '\n' + tabs(t))
            i = skip_next(text, i + 1) - 1
            continue
        }

        if(text[i] == ':'){
            result += (text[i] + ' ')
            continue
        }

        if(text[i] == ']' || text[i] == '}'){
            t--;
            result += ('\n' + tabs(t) + text[i])
            continue;
        }

        if(!isspace(text[i])){       
            result += text[i]
        }
    }
    return result
}

export function DataConstructor(props: IDataEditorProps) {
    // const ctor = useMemo(() => new JSONConstructor(props.data), [])
    const [ data, setData ] = useState<any>()
    const [ text, setText ] = useState('')

    const print = () => {
        try{
            const text = JSON.stringify(data)
            return tabbed(text)
        }
        catch(error){
            return 'error'
        }
    }

    const getData = (text: string) => {
        try{
            return JSON.parse(text);
        }
        catch(error){
            return error
        }
    }

    const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const { target: element } = e
        const { value: text } = element
        //const { selectionStart, selectionEnd, selectionDirection } = element
        try{
            const result = JSON.parse(text);
            const t = tabbed(text)
            setText(t)
            setData(getData(e.target.value))
            if(e.target.value != t){
                e.target.value = t
                //Object.assign(element, { selectionStart, selectionEnd, selectionDirection })
            }

        }
        catch(error){

        }
        
    }

	return <>
		<div className={styles.ctor}>
            <textarea onChange={onChange} onSelect={(e)=>{
                const { currentTarget: element } = e
                const { selectionStart, selectionEnd, selectionDirection } = element
                console.log({selectionStart, selectionEnd, selectionDirection})
            }}/>
            <textarea value={text}/>
            {/* <TypeEditor ctor={ctor} path={CHolderField} /> */}
         
		</div>
	</>
}




