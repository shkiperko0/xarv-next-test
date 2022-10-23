import { createContext, useEffect, useState } from "react"
import { fetch_json } from "."
import FilesUnploadButton from "./DirUploadButton"
import DirRemoveButton from "./FirRemoveButton"
import MKDirButton from "./MKDirButton"
import Record from "./Record"
import RNDirButton from "./RNDirButton"


export interface IDirProps{ 
    name: string, 
    path: string,
}

export interface IDirContext extends IDirProps{
    setName: (name: string) => void,
    setPath: (path: string) => void,
}

export const DirContext = createContext<IDirContext | null>(null)

export default function Dir(props: IDirProps){
    const [ isOpen, setOpened ] = useState(false)
    const [ files, setFiles ] = useState<any[] | null>(null)
    const [ name, setName ] = useState(props.name)
    const [ path, setPath ] = useState(props.path)

    useEffect(() => {
        if(!isOpen || files) return
        (async () => setFiles(await fetch_json(path)))()
    }, [isOpen, files, path])

    function onClick(){
        setOpened(!isOpen)
    }

    return <li className='dir'>
        <DirContext.Provider value={{name, path, setName, setPath}}>
            <div onClick={onClick}>Dir {name} <FilesUnploadButton/> <MKDirButton/> <DirRemoveButton/> <RNDirButton/> </div>
            <ul>
                { 
                    files && isOpen && 
                    files.map((props: any) => <Record {...props} path={`${path}/${props.name}`}/>)
                }
            </ul>
        </DirContext.Provider>
    </li>
}