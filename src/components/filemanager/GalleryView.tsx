import { style } from '@mui/system'
import { createContext, DragEvent, MouseEvent, useContext, useEffect, useState } from 'react'
import statics from 'src/statics'

import styles from './GalleryView.module.scss'

export interface IGalleryViewProps{
    path: string
}

export interface IGalleryContext extends IGalleryViewProps{
    selection: string[], 
    setSelection: (selection: string[]) => void,
    setPath: (path: string) => void,
    addFile: (file: IFileProps) => void,
    removeFile: (paths: string[]) => void,
}

export const GalleryContext = createContext<IGalleryContext>(null as any)


export interface IFolderRecordData{
    name: string, 
    path: string,
    type: string,
    mime?: string,
}

export interface IFileProps extends IFolderRecordData{ 
    selected: boolean,
}

export interface IFileContext extends IFileProps{
    setName: (name: string) => void,
    setPath: (path: string) => void,
}

export const FileContext = createContext<IFileContext>(null as any)


/*
    Создание папки
    Переименование файлов
    Удаление
    Выделение предметов
*/

export async function fetch_json(path: string, init: RequestInit = {}){
    try{
        const response = await fetch(`${statics.host.contentMS}${path}`, Object.assign<RequestInit, RequestInit>({}, init))
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
        //console.log(res)
        return res
    }
}


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


// <FileRemoveButton/> <RNFileButton/> 
// <FilesUnploadButton/> <MKDirButton/> <DirRemoveButton/> <RNDirButton/>

namespace GalleryButtons{

    export function Rename(){
        const gallery = useContext(GalleryContext)

        return <button onClick={ event => {
            if(gallery){
                const index = gallery.path.lastIndexOf('/')
                if(index == -1) return
                const new_path = gallery.path.substring(0, index)
                //console.log(index, new_path)
                gallery.setPath(new_path)
            }
        }}>Переименовать</button>
    }
    
    export function Delete(){
        const gallery = useContext(GalleryContext)

        return <button onClick={ event => {
            if(gallery){
                const index = gallery.path.lastIndexOf('/')
                if(index == -1) return
                const new_path = gallery.path.substring(0, index)
                //(index, new_path)
                gallery.setPath(new_path)
            }
        }}>Удалить</button>
    }
    
    export function Up(){
        const gallery = useContext(GalleryContext)

        return <button onClick={ event => {
            if(gallery){
                const index = gallery.path.lastIndexOf('/')
                if(index == -1) return
                const new_path = gallery.path.substring(0, index)
                //console.log(index, new_path)
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
                //console.log(index, new_path)
                gallery.setPath(new_path)
            }
        }}>Создать папку</button>
    }

    export function Select(){
        const gallery = useContext(GalleryContext)
        const item = useContext(FileContext)
        
        return <input className={styles.selected} type={'checkbox'} checked={item.selected}/>
    }

    export function Upload(){
        const gallery = useContext(GalleryContext)
        
        return <button onClick={ event => {
            if(gallery){
                const index = gallery.path.lastIndexOf('/')
                if(index == -1) return
                const new_path = gallery.path.substring(0, index)
                //console.log(index, new_path)
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
        // console.log({file, target})
        return
    }
    
    const delim = <span>/</span>
    const jsxs = parts.map( (part, index) => <span key={index} className={styles.path_text} onDrop={getOnDrop(index)} onDragOver={onDragOver}>{part}</span> )
    const any: any[] = []
    
    let i = 0
    while(i < jsxs.length - 1){
        any.push(jsxs[i++])
        any.push(delim)
    }
    any.push(jsxs[i])

    return <div className={styles.path}>
        { any }
        
    </div>
}

export function GalleryFile(props: IFileProps){
    const [ name, setName ] = useState(props.name)
    const [ path, setPath ] = useState(props.path)
    const gallery = useContext(GalleryContext)
    const { selected } = props

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
        gallery.removeFile([file])
        await ApiFiles.move(file, target)
        return
    }

    function onDoubleClick(event: MouseEvent<HTMLDivElement>){
        if(isFolder)
            gallery.setPath(path)
        event.stopPropagation()
        return
    }

    function onClick(event: MouseEvent<HTMLDivElement>){
        if(event.ctrlKey){
            const selection = (!selected ? [ ...gallery.selection, path ] : gallery.selection.filter(gpath => gpath != path))
            gallery.setSelection(selection)
        }

        else{
            gallery.setSelection([path])
            // console.log('selected', path)
        } 
        event.stopPropagation()
        return
    }

    return <div 
            draggable 
            className={[
                styles.file_item, 
                selected ? styles.file_item_selected : null, 
                (!props.type || props.type == 'file' ? null : props.type)
            ].join(' ')} 
            onClick={onClick}
            onDoubleClick={onDoubleClick} 
            onDragStart={onDragStart}
            onDragOver={isFolder ? onDragOver : undefined}
            onDrop={isFolder ? onDrop : undefined}
        >
        <FileContext.Provider value={{ type: props.type, name, path, setName, setPath, selected }}>
            <div className={styles.buttons}>
                <GalleryButtons.Select/>
            </div>
            <div>
                <img className={styles.image_preview} src={isFolder ? `${statics.host.contentMS}/dir/icons/folder.webp` : `${statics.host.contentMS}${path}`} alt={name} />  
            </div>
        </FileContext.Provider>
        <span className={styles.file_name} title={props.mime}>{name}</span>
    </div>
}

export default function GalleryView(props: IGalleryViewProps){
    const [ path, setPath ] = useState(props.path) 
    const [ files, setFiles ] = useState<IFolderRecordData[] | null>(null)
    const [ selection, setSelection ] = useState<string[]>([]) 

    function addFile(file: IFileProps){
        setFiles([...files ?? [], file])
    }

    function removeFile(paths: string[]){
        setFiles([...(files ?? []).filter(file => paths.indexOf(file.path) == -1)])
    }

    const clearFiles = () => setFiles(null)
    const fetchFiles = async (path: string) => setFiles(await fetch_json(path))
    
    useEffect(() => {
        clearFiles()
        fetchFiles(path)
    }, [path])

    return <div className={styles.gallery}>
        <GalleryContext.Provider value={{setPath, path, selection, setSelection, addFile, removeFile}}>
            <div className={styles.topline}>
                <PathBreadcrumps/> 
                <div className={styles.buttons}>
                    <GalleryButtons.Up/>
                    <GalleryButtons.MKDir/>
                    <GalleryButtons.Upload/>
                </div>
            </div>
            <div className={styles.gallery_content}>
                {
                    files && `map` in files && 
                    files.map(
                        (props) => <GalleryFile 
                            key={props.path}
                            {...props}
                            selected={selection.indexOf(props.path) != -1} 
                            path={`${path}/${props.name}`}
                        />
                    )
                }
            </div>
        </GalleryContext.Provider>
    </div>
}



// <Dir path='/my' name='Мои файлы'/>

















































