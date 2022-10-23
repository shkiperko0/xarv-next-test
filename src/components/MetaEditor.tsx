import styles from './MetaEditor.module.scss'
import { useState } from 'react'

export interface IMetaScheme{
    [key: string]: string | IMetaScheme
}

interface IMetaEditorProps{
    scheme: IMetaScheme,
    data: any,
    setData: (data: any) => void
}

interface IStringFieldProps{
    name: string, 
    value_key: string, 
    value: string, 
    setValue: (_: string) => void
}

function StringField(props: IStringFieldProps){
    const { value_key, name, setValue, value } = props
    return <>
        <div className={styles['field-value']}>{value_key} ({name}): 
            <input 
                key={value_key} 
                type='text' 
                defaultValue={value} 
                onChange={event => setValue(event.currentTarget.value)}
            />
        </div>
    </>
}

interface INumberFieldProps{
    name: string, 
    value_key: string, 
    value: number, 
    setValue: (_: number) => void
}

function NumberField(props: INumberFieldProps){
    const { value_key, name, setValue, value } = props
    return <>
        <div className={styles['field-value']}>{value_key} ({name}): 
            <input 
                key={value_key} 
                type='text' 
                defaultValue={value} 
                onChange={event => setValue(parseInt(event.currentTarget.value, 10))}
            />
        </div>
    </>
}

interface StringArrayProps{
    name: string,
    array: string[],
}

function StringArray(props: StringArrayProps){
    const { name: key, array: arr } = props
    if(!arr) return <></>
    const [ _, lengthChanged ] = useState(arr.length)
     return <div className={styles['field-array']}>
        <span>{key}</span>
        { 
            arr.map((value, index) => 
                <StringField key={index} {...{ name: `${key}: string[${index}]`, value_key: key, value, setValue: (value: string) => { arr[index] = value }}} />
            )
        } 
        <button onClick={() => {
            arr.push('')
            lengthChanged(arr.length)
        }}>add row</button>
    </div>
}

interface NumberArrayProps{
    name: string,
    array: number[],
}

function NumberArray(props: NumberArrayProps){
    const { name: key, array: arr } = props
    const [ _, lengthChanged ] = useState(arr.length)
     return <div className={styles['field-array']}>
        <span>{key}</span>
        { 
            arr.map((value, index) => 
                <NumberField key={index} {...{ name: `${key}: number[${index}]`, value_key: key, value, setValue: (value: number) => { arr[index] = value }}} />
            )
        } 
        <button onClick={() => {
            arr.push(0)
            lengthChanged(arr.length)
        }}>add row</button>
    </div>
}

interface ITypeFN{ 
    type: string, 
    ext?: true, 
    arr?: true, 
    min?: number, 
    max?: number 
}

const type_fn = (type_def: string): ITypeFN => {
    const arr_a = type_def.indexOf('[')
    if(arr_a == -1) return { type: type_def }
    const type = type_def.substring(0, arr_a)

    const arr_b = type_def.indexOf(']', arr_a)
    if(arr_b == -1) return { type }

    const arr = true

    const arr_in = type_def.substring(arr_a + 1, arr_b)
    //console.log({type, arr_a, arr_b, arr_in})

    if(!arr_in.length) return { type, ext: true, arr }
    
    if(arr_in.indexOf('-') != -1){
        const [min, max] = arr_in.split('-').map(str => parseInt(str, 10))
        return { type, min, max, arr }
    }

    const is_plus = arr_in.indexOf('+') != -1 ? true : undefined
    const min = parseInt(arr_in, 10)
    return { type, min, ext: is_plus, arr }
}

interface IInputs{
    scheme: IMetaScheme, 
    data: any
}

function Inputs({ data, scheme }: IInputs){
    return <>{ Object.keys(scheme).map((key) => <InputValue key={key} key_name={key} scheme={scheme} data={data} />) }</>
}

interface IInputValue{
    scheme: IMetaScheme, 
    data: any, 
    key_name: string
}

function InputValue({ data, key_name, scheme }: IInputValue){ 
    const value_type = scheme[key_name]

    const setValue = (value: any) => { data[key_name] = value }

    if(typeof value_type == 'string'){
        const { arr, type, min, ext, max } = type_fn(value_type)
        console.log({ key_name, arr, type, min, ext, max })
        if(arr){
            switch(type){
                case 'number': 
                    return <NumberArray {...{ name: key_name, key: key_name, array: data[key_name] }}/>
                
                case 'string': 
                    return <StringArray {...{ name: key_name, key: key_name, array: data[key_name] }}/>
            }
        }

        switch(type){
            case 'number':
                return <NumberField {...{ name: `${key_name}: ${type}`, value_key: key_name, key: key_name, value: data[key_name], setValue}}/>
            
            case 'string':
                return <StringField {...{ name: `${key_name}: ${type}`, value_key: key_name, key: key_name, value: data[key_name], setValue}}/>
        }
    }
    
    if(typeof value_type == 'object' && value_type instanceof Object){
        return <div className={styles['field-object']}>
            <span>{key_name}</span>
            <Inputs data={data[key_name]} scheme={scheme[key_name] as IMetaScheme}/>
        </div>
    }

    return <div>wtf type {value_type} with name {key_name}</div>
}

export default function MetaEditor(props: IMetaEditorProps){
    const { scheme, data, setData } = props
    const title = 'Редактор метаданных'
    const [ view, setView ] = useState(JSON.stringify(data))

    return <>
        <div className={styles['meta-editor']}>
            { title && <span className={styles['editor-title']}>{title}</span> }
            <div className={styles.fields}>
                <Inputs data={data} scheme={scheme}/>
            </div>
            <button 
                onClick={
                    event => { 
                        console.log(data)
                        setData({... data})
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