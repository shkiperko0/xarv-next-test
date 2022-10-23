import { createContext, DragEvent, MouseEvent, useContext, useEffect, useState } from 'react'
import statics from '../../../statics'

export const GalleryContext = createContext<IGalleryContext>({
    path: '',
    setPath: () => {}
})

/*
    Создание папки
    Переименование файлов
    Удаление
    Выделение предметов
*/



export async function fetch_json(path: string, init: RequestInit = {}){
    try{
        const response = await fetch(`${statics.host.api}${path}`, Object.assign<RequestInit, RequestInit>({}, init))
        //const json = await response.json()
        //return json instanceof Array ? [ ...json ] : { ...json }
        return await response.json()
    }
    catch(error){
        console.error(error) 
    }
    return
}

class ApiFiles{
    static async move(old_path: string, new_path: string){
        const req = { 
            op: 'mvfile',
            target: new_path 
        }
        const res = await fetch_json(old_path, { 
            method: 'POST',
            body: JSON.stringify(req) 
        })
        console.log(res)
        return res
    }
}

export interface IGalleryProps{
    path: string
}

export interface IGalleryContext extends IGalleryProps{
    setPath: (path: string) => void
}

export interface IFileProps{ 
    name: string, 
    path: string,
    type: string,
    mime?: string,
}

export interface IFileContext extends IFileProps{
    setName: (name: string) => void,
    setPath: (path: string) => void,
}

export const FileContext = createContext<IFileContext | null>(null)

class DragController{
    static object: object | null = null

    static getDragObject(){
        return DragController.object
    }

    static setDaragObject(object: object | null = null){
        const t = DragController.object 
        DragController.object = object
        return t
    }
}

export function GalleryFile(props: IFileProps){
    const [ name, setName ] = useState(props.name)
    const [ path, setPath ] = useState(props.path)
    const gallery = useContext(GalleryContext)

    const isFolder = props.type == 'dir'

    function onDragStart(event: DragEvent<HTMLDivElement>){
        //console.log('drag object', path)
        event.dataTransfer.setData('file', path)
        return
    }

    function onDragOver(event: DragEvent<HTMLDivElement>){
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        return
    }

    async function onDrop(event: DragEvent<HTMLDivElement>){
        event.preventDefault()
        //console.log('drop target', path)
        const file = event.dataTransfer.getData('file')
        const target = path
        await ApiFiles.move(file, target)
        return
    }

    function onDoubleClick(event: MouseEvent<HTMLDivElement>){
        if(isFolder)
            gallery.setPath(path)
        event.stopPropagation()
        return
    }

    return <div 
            draggable 
            className={['file', (!props.type || props.type == 'file' ? null : props.type)].join(' ')} 
            onDoubleClick={onDoubleClick} 
            onDragStart={onDragStart}
            onDragOver={isFolder ? onDragOver : undefined}
            onDrop={isFolder ? onDrop : undefined}
        >
        <FileContext.Provider value={{ type: props.type, name, path, setName, setPath }}>
            <div>
                <img className='preview' src={isFolder ? `${statics.host.api}/dir/icons/folder.webp` : `${statics.host.api}${path}`} alt={name} />  
            </div>
        </FileContext.Provider>
        <span className='name' title={props.mime}>{name}</span>
    </div>
}

// <FileRemoveButton/> <RNFileButton/> 
// <FilesUnploadButton/> <MKDirButton/> <DirRemoveButton/> <RNDirButton/>

namespace GalleryButtons{
    export function Up(){
        const gallery = useContext(GalleryContext)

        return <button onClick={ event => {
            if(gallery){
                const index = gallery.path.lastIndexOf('/')
                if(index == -1) return
                const new_path = gallery.path.substring(0, index)
                console.log(index, new_path)
                gallery.setPath(new_path)
            }
        }}>Назад</button>
    }

    export function MKDir(){
        const gallery = useContext(GalleryContext)

        return <button onClick={ event => {
            if(gallery){
                const index = gallery.path.lastIndexOf('/')
                if(index == -1) return
                const new_path = gallery.path.substring(0, index)
                console.log(index, new_path)
                gallery.setPath(new_path)
            }
        }}>Создать папку</button>
    }

    export function Upload(){
        const gallery = useContext(GalleryContext)

        return <button onClick={ event => {
            if(gallery){
                const index = gallery.path.lastIndexOf('/')
                if(index == -1) return
                const new_path = gallery.path.substring(0, index)
                console.log(index, new_path)
                gallery.setPath(new_path)
            }
        }}>Загрузить</button>
    }
}

function PathBreadcrumps(){
    const gallery = useContext(GalleryContext)

    const { path, setPath } = gallery
    const parts = path.split('/') 

    function onDragOver(event: DragEvent<HTMLDivElement>){
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        return
    }

    const getOnDrop = (index: number) =>
    async function onDrop(event: DragEvent<HTMLDivElement>){
        event.preventDefault()
        const file = event.dataTransfer.getData('file')
        const target = parts.slice(0, index + 1).join('/')
        await ApiFiles.move(file, target)
        console.log({file, target})
        return
    }

    const delim = <span>/</span>
    const jsxs = parts.map( (part, index) => <span className='text' onDrop={getOnDrop(index)} onDragOver={onDragOver}>{part}</span> )
    const any: any[] = []

    let i = 0
    while(i < jsxs.length - 1){
        any.push(jsxs[i++])
        any.push(delim)
    }
    any.push(jsxs[i])

    return <div className='path'>
        { any }
        
    </div>
}

export default function GalleryView(props: IGalleryProps){
    const [ path, setPath ] = useState(props.path) 
    const [ files, setFiles ] = useState<IFileProps[] | null>(null)

    const clearFiles = () => setFiles(null)
    const fetchFiles = async (path: string) => setFiles(await fetch_json(path))

    useEffect(() => {
        clearFiles()
        fetchFiles(path)
    }, [path])

    return <div className='gallery'>
        <GalleryContext.Provider value={{setPath, path}}>
            <div><PathBreadcrumps/> <GalleryButtons.Up/> <GalleryButtons.MKDir/> <GalleryButtons.Upload/></div>
            <div 
                className='content'
                children={
                    files && files.map((props) => <GalleryFile {...props} path={`${path}/${props.name}`}/>)
                }
            />
        </GalleryContext.Provider>
    </div>
}

// <Dir path='/my' name='Мои файлы'/>

















































