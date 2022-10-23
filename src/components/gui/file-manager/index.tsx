import { createContext, useState } from 'react'
import statics from '../../../statics'
import Dir, { IDirProps } from './Dir'
import { IFileProps } from './File'

export const ManagerContext = createContext<IManagerContext | null>(null)

export async function fetch_json(path: string, init: RequestInit = {}){
    try{
        const response = await fetch(`${statics.host.api}${path}`, Object.assign<RequestInit, RequestInit>({}, init))
        return await response.json()
    }
    catch(error){
        console.error(error) 
    }
    return
}

interface IManagerContext{
    setShow: ({text, color}: {text: string, color: string}) => void
}

interface IFileManagerProps{}
export default function FileManager(props: IFileManagerProps){
    interface IShowText{
        text: string, 
        color: string
    }

    const [show, setShow] = useState<IShowText | null>(null)

    return <ul className='file-manager'>
        <ManagerContext.Provider value={{setShow}}>
            <Dir path='/dir' name='Файловая система'/>
            <Dir path='/tmp' name='Временные файлы'/>
        </ManagerContext.Provider>
        { show && <div style={{backgroundColor: show.color}}>{show.text}</div> }
    </ul>
}

// <Dir path='/my' name='Мои файлы'/>






