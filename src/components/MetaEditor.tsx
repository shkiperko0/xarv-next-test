import styles from './MetaEditor.module.scss'
import { useState } from 'react'


interface IMetaKey{
    type: 'number' | 'string' | 'object' | 'array'


}

export interface IMetaScheme{
    [key: string]: string | IMetaScheme
}

interface IMetaEditorProps{
    scheme: IMetaScheme,
    data: any,
    setData: (data: any) => void
}

interface ITypeField<Type>{
    name: string, 
    value_key: string, 
    value: Type, 
    setValue: (_: Type) => void
}

interface IStringFieldProps extends ITypeField<string>{}
interface INumberFieldProps extends ITypeField<number>{}

interface ITypeArray<Type>{
    name: string,
    array: Type[],
}

interface StringArrayProps extends ITypeArray<string>{}
interface NumberArrayProps extends ITypeArray<number>{}

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

function StringArray(props: StringArrayProps){
    const { name: key, array: arr } = props
    if(!arr) return <></>
    const [ _, lengthChanged ] = useState(arr.length)
     return <div className={styles['field-array']}>
        <span>{key}</span>
        { 
            arr.map((value, index) => 
                <StringField key={index} {...{ name: `${key}: string[${index}]`, value_key: key, value, setValue: (value: string) => { arr[index] = value }}} />)
        } 
        <button onClick={() => 
            { arr.push(''); lengthChanged(arr.length)}}>Add row</button>
    </div>
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
        <button onClick={() => 
            { arr.push(0); lengthChanged(arr.length)}}>Add row</button>
    </div>
}

function isTypeArray(type_def: string){
    const a = type_def.indexOf('[')
    if(a == -1) return { type: type_def }
    const type = type_def.substring(0, a)

    const b = type_def.indexOf(']', a)
    if(b == -1) return { type }

    return { type, isArray: true }
}

interface IInputs{
    scheme: IMetaScheme, 
    data: any
}

function Inputs({ data, scheme }: IInputs){
    const cb = function(key: string){
        return <InputValue key={key} key_name={key} scheme={scheme} data={data} />
    } 
    return <>{ Object.keys(scheme).map(key => cb(key)) }</>
}

interface IInputValue{
    scheme: IMetaScheme, 
    data: any, 
    key_name: string
}

function InputValue({ data, key_name, scheme }: IInputValue){ 
    const value_type = scheme[key_name]

    const setValue = (value: any) => { data[key_name] = value }

    console.log({data, key_name} )
    if(typeof value_type == 'string'){
        const { isArray, type } = isTypeArray(value_type)
        //console.log({ key_name, arr, type, min, ext, max })

        if(isArray){
            if(!data[key_name]) data[key_name] = []
            switch(type){
                case 'number': 
                    return <NumberArray {...{ name: key_name, key: key_name, array: data[key_name] }}/>
                
                case 'string': 
                    return <StringArray {...{ name: key_name, key: key_name, array: data[key_name] }}/>
            }
        }

        switch(type){
            case 'number':{
                if(!data[key_name]) data[key_name] = 0
                return <NumberField {...{ name: `${key_name}: ${type}`, value_key: key_name, key: key_name, value: data[key_name], setValue}}/>
            }
            case 'string':{
                if(!data[key_name]) data[key_name] = ''
                return <StringField {...{ name: `${key_name}: ${type}`, value_key: key_name, key: key_name, value: data[key_name], setValue}}/>
            }
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

export function MetaEditor(props: IMetaEditorProps){
    const { scheme, data, setData } = props
    const title = 'Редактор метаданных'
    //const [ view, setView ] = useState(JSON.stringify(data))

    return <>
        <div className={styles['meta-editor']}>
            { title && <span className={styles['editor-title']}>{title}</span> }
            <div className={styles.fields}>
                <Inputs data={data} scheme={scheme}/>
            </div>
            <button 
                onClick={
                    event => { 
                        //console.log(data)
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