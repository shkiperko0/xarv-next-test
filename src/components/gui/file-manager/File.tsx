import { createContext, useState } from "react"
import statics from "../../../statics"
import FileRemoveButton from "./FileRemoveButton"
import RNFileButton from "./RNFileButton"

export interface IFileProps{ 
    name: string, 
    path: string
}

export interface IFileContext extends IFileProps{
    setName: (name: string) => void,
    setPath: (path: string) => void,
}

export const FileContext = createContext<IFileContext | null>(null)

export default function File(props: IFileProps){
    const [ name, setName ] = useState(props.name)
    const [ path, setPath ] = useState(props.path)

    return <li className='file'>
        <FileContext.Provider value={{ name, path, setName, setPath }}>
            <div><a href={`${statics.host.api}${path}`}>File</a> {name} <FileRemoveButton/> <RNFileButton/> </div>
        </FileContext.Provider>
    </li>
}