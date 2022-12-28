import styles from './styles.module.scss'
import { ChangeEventHandler, createContext, Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { ISelectEventHandler, ISelectOptions, Select } from '@components/gui/Select'
import { Button } from '@components/gui/Button'
import { Input } from '@components/gui/Input'
import { cl, defaultField_BooleanSelect, GetHolderValueByPath, ObjectRenameField, parseBool, SetHolderValueByPath } from 'src/tools'


type IDataTypeClasses = 'Array' | 'Object' | 'null'
type IDataType = 'boolean' | 'number' | 'string' | 'bigint' | IDataTypeClasses | 'undefined'

export type IEditor<Type=any> = (props: IEditorProps) => JSX.Element

type IObjectScheme = { [name: string]: IDataKey }
type IArrayScheme = IDataKey[]
type IScheme = IObjectScheme | IArrayScheme

export interface IDataKey<Type=any> {
	type: IDataType,
    scheme?: IScheme
	Editor?: IEditor<Type>,
	title?: string,
	description?: string,
}

export type IData = any

export const data_number: IDataKey = { type: 'number', Editor: EditorNumber }
export const data_string: IDataKey = { type: 'string', Editor: EditorString }
export const data_boolean: IDataKey = { type: 'boolean', Editor: EditorBoolean }
export const data_object: IDataKey = { type: 'Object', Editor: EditorObject }
export const data_array: IDataKey = { type: 'Array', Editor: EditorArray }

function EditorBoolean(props: IEditorProps) {
    const { holder, onChange } = useEditor()
	const { path } = props

	return <span className={styles.boolean}>
		<Select 
            className={styles.select}
            onSelect={(option) => { 
                SetHolderValueByPath(holder, path, option.value)
                onChange(holder.default)
			}}

            options={defaultField_BooleanSelect.options}
        />
	</span>
}

function EditorString(props: IEditorProps) {
    const { holder, onChange } = useEditor()
	const { path } = props
    const [ value, setValue ] = useState<string>(() => GetHolderValueByPath(holder, path))

    if(typeof value !== 'string'){
        return <>
            Type Error on string <>{typeof value} {path} {JSON.stringify({value})}</>
        </>
    }
    
    const format = (value: string) => {
        return value
    }

    const parse = (text: string) => {
        return text
    }

    const onValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const new_value = parse(e.currentTarget.value)
        setValue(new_value)
        SetHolderValueByPath(holder, path, new_value)
        onChange(holder.default)
    }

	return <span className={styles.string}>
		<Input className={styles.input} type='text' defaultValue={ format(value) } onChange={onValueChange} />
	</span>
}

function EditorNumber(props: IEditorProps) {
    const { holder, onChange } = useEditor()
	const { path } = props
    const defaultValue = useMemo(() => GetHolderValueByPath(holder, path), [])
    const [ value, setValue ] = useState<number>(defaultValue)

    if(typeof value !== 'number'){
        return <>
            Type Error on number <>{typeof value} {path} {JSON.stringify({value})}</>
        </>
    }
    
    const format = (value: number) => {
        return value.toString()
    }

    const parse = (text: string) => {
        return parseInt(text, 10)
    }

    const onValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const new_value = parse(e.currentTarget?.value)
        setValue(new_value)
        SetHolderValueByPath(holder, path, new_value)
        onChange(holder.default)
    }

	return <span className={styles.number}>
		<Input className={styles.input} type='text' defaultValue={ format(defaultValue) } onChange={onValueChange} />
	</span>
}

type RenameHandler = (oldname: string, neaname: string) => void

interface IEditorObjectFieldProps{
    path: string,
    name: string,
    onRename: RenameHandler,
}

function EditorObjectField(props: IEditorObjectFieldProps) {
    const { holder, onChange } = useEditor()
	const { path } = props
    const [ name, setName ] = useState(props.name)
    const { onRename } = props

    const [ state, setState ] = useState(() => GetHolderValueByPath(holder, path))

    const utypeName = GetValueUType(state)
    const Editor = GetEditor(utypeName)

    const onTC_Changed = (utypeName) => {
        const data = GetUTypeDefaultValue(utypeName) as unknown
        setState(() => data)
        SetHolderValueByPath(holder, path, data)
        onChange(holder.default)
    }

    const onSelectType: ISelectEventHandler = (option) => {
        onTC_Changed({ utypeName: option.value })
    }

    const onNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newname = e.target.value
        onRename(name, newname)
        setName(newname)
    }

    const GetStyleTC = () => styles[utypeName.toLowerCase()]
    
    return <>
        <span className={cl(styles.field, GetStyleTC)}>
            <div>
                <Input className={styles.input} defaultValue={name} onChange={onNameChange}/>
                <span className={styles.types}>
                    <Select className={cl(styles.select, styles.type)} onSelect={onSelectType} options={type_options} defaultValue={utypeName} />
                </span>
            </div>
            <Editor path={path} />
        </span>
    </>
}

export function TypeEditor(props: IEditorProps){
    const { holder, onChange } = useEditor()
    const { path, scheme } = props

    const [ state, setState ] = useState(() => GetHolderValueByPath(holder, path))

    const utypeName = GetValueUType(state)
    const Editor = GetEditor(utypeName)

    const onTC_Changed = (utypeName: IDataType) => {
        const data = GetUTypeDefaultValue(utypeName) as unknown
        setState(() => data)
        SetHolderValueByPath(holder, path, data)
        onChange(holder.default)
    }

    const onSelectType: ISelectEventHandler = (option) => {
        onTC_Changed(option.value)
    }

    useEffect(() => {
        if(scheme === undefined) return 

        console.log({ a: scheme.type, b: utypeName })

        if(utypeName != scheme.type){
            const data = GetUTypeDefaultValue(scheme.type)
            setState(() => data)
            SetHolderValueByPath(holder, path, data)
            onChange(holder.default)
        }

    }, [scheme])

    return <>
		{/* <div className={styles.typeeditor}> */}
            <span className={styles.types}>
                <Select className={cl(styles.select, styles.type)} onSelect={onSelectType} options={type_options} defaultValue={utypeName} />
            </span>
            <Editor path={path} scheme={scheme} />
        {/* </div> */}
    </>
}

function EditorObject(props: IEditorProps) {
    const { holder, onChange } = useEditor()
	const { path, scheme } = props
    const [ data = {}, setData ] = useState(() => GetHolderValueByPath(holder, path))
    const utypeName = GetValueUType(data)
    
    const addField: MouseEventHandler = () => {
        const new_data = { ...data, default: null }
        SetHolderValueByPath(holder, path, new_data)
        setData(new_data)
        onChange(holder.default)
    }

    const onRename: RenameHandler = (oldname, newname) => {
        ObjectRenameField(data, oldname, newname)
        //setData({...data})
        onChange(holder.default)
    }

    const CheckFields = (scheme: IObjectScheme) => {

    }

    useEffect(() => {
        if(scheme === undefined) return 

        if(utypeName != scheme.type){
            const data = GetUTypeDefaultValue(scheme.type)
            setData(() => data)
            
            if(scheme.type == 'Object')
                CheckFields(scheme.scheme as IObjectScheme)

            SetHolderValueByPath(holder, path, data)
            onChange(holder.default)
        }

    }, [scheme])

    if(data instanceof Object){
        return <span className={styles.object}>
            { Object.entries(data).map(([name]) => <EditorObjectField onRename={onRename} name={name} path={path + `/${name}`} />) }
            <Button onClick={addField}>Add field</Button>
        </span>
    }

    return <>
        Type Error on Object <>{typeof data} {path} {JSON.stringify({data})}</>
    </>
}

function EditorArray(props: IEditorProps) {
    const { holder, onChange } = useEditor()
	const { path } = props
    const [ data = [], setData ] = useState(() => GetHolderValueByPath(holder, path))

    const addValue: MouseEventHandler = () => {
        const new_data = [ ...data, null ]
        SetHolderValueByPath(holder, path, new_data)
        setData(new_data)
        onChange(holder.default)
    }

    if(data instanceof Array){
        return <span className={styles.array}>
            { data.map((_, index) => <TypeEditor path={path + `/${index}`} />) }
            <Button onClick={addValue}>Add value</Button>
        </span>
    }

    return <>
        Type Error on Array <>{typeof data} {path} {JSON.stringify({data})}</>
    </>
}

export function NormalizeData(data: IData, key: IDataKey) {
    const data_t = typeof data

    if(data_t != key.type){
        return GetKeyDefaultValue(key)
    }

    if(typeof data == 'object' && data.constructor.name != key.type){

        return GetKeyDefaultValue(key)
    }

	return data
}

export function GetSchemeFromData(data: any): IDataKey {
	let scheme: IDataKey = {
        type: typeof data as any,        
    }
	return scheme
}

export type ChangeHandler = (data: IData) => void



export interface ITypeEditorProps{

} 

function GetTypeClassName(data: null | object): IDataTypeClasses {
    if(data === null) return 'null'
    return data.constructor.name as any
}

function GetValueUType(data: any): IDataType {
    const typeName = typeof data
    const utypeName = (typeName == 'object' ? GetTypeClassName(data) : typeName) as IDataType
    return utypeName
}

function GetEditor(utypeName: IDataType): IEditor {

    // if(typeName == 'undefined')
    //     return () => <>{`<undefined>`}</>

    if(utypeName == 'boolean')
        return EditorBoolean

    if(utypeName == 'number')
        return EditorNumber

    if(utypeName == 'string')
        return EditorString

    if(utypeName == 'null')
        return () => <>{`<null>`}</>
    
    if(utypeName == 'Array')
        return EditorArray

    if(utypeName == 'Object')
        return EditorObject

    return () => <>No UType Editor '{utypeName}'</>
}

const type_options: ISelectOptions<IDataType> = [
//    { id: 0, value: 'undefined' },
    { id: 0, value: 'null' },
    { id: 1, value: 'boolean' },
    { id: 2, value: 'number' },
    { id: 3, value: 'string' },
    { id: 4, value: 'Object' },
    { id: 5, value: 'Array' },
]


const GetUTypeDefaultValue = (utypeName: IDataType) => {
    if(utypeName === 'boolean') return false
    if(utypeName === 'number') return 0
    if(utypeName === 'string') return ''

    if(utypeName === 'Array') return new Array()
    if(utypeName === 'Object') return new Object()
    if(utypeName === 'null') return null

    return undefined
}

export const GetKeyDefaultValue = (key: IDataKey) => GetUTypeDefaultValue(key.type)

export interface IEditorProps {
	path: string,
    scheme?: IDataKey,
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

interface IHolder{
    default: any
}

interface IEditorContext{
	holder: IHolder,
	onChange: Dispatch<SetStateAction<any>>,
}

const EditorContext = createContext<IEditorContext>(null as any)
const { Consumer: EditorConsumer, Provider: EditorProvider } = EditorContext
const useEditor = () => useContext(EditorContext)  

export { EditorConsumer, EditorProvider, useEditor } 

interface IJSON_EditorProps {
	data?: IData,
    scheme?: IDataKey,
	onChange?: ChangeHandler
}

export function JSON_Editor(props: IJSON_EditorProps) {
    const [ holder, setHolder ] = useState<IHolder>({ default: props.data ?? null })
    const { onChange: ChangeEvent, scheme } = props

    const ctx: IEditorContext = {
        holder: holder, 
        onChange(data){
            ChangeEvent && ChangeEvent(data)
            setHolder({ default: data })
        }
    }

    const json = JSON.stringify(holder)

    console.log({ passed: scheme })

	return <EditorProvider value={ctx}>
        <div className={styles.editor}>
            <TypeEditor path='default' scheme={scheme} />
            {/* <pre className={styles.pre}>
                {tabbed(json)}
            </pre> */}
        </div>
	</EditorProvider>
}




