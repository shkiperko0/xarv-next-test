import { KeyboardEvent, MouseEvent, useContext, useState } from "react"
import { fetch_json, ManagerContext } from "."
import statics from "../../../statics"
import Button from "../Button"
import { FileContext } from "./File"

export default function RNFileButton(){
    const file = useContext(FileContext)
    const mgr = useContext(ManagerContext)

    const [ isOpen, setOpened ] = useState(false)

    async function OnClick(event: MouseEvent<HTMLButtonElement>){
        if(!file) return
        setOpened(true)
        event.stopPropagation()
        return
    }

    async function onKeyUp(event: KeyboardEvent<HTMLInputElement>){
        event.stopPropagation()
        if(!file) return 
        console.log(event.key)
        if(event.key === 'Enter'){
            const input = event.currentTarget
            const name = input.value
            event.preventDefault()
            setOpened(false)

            const res = await fetch_json(file.path, {
                method: 'POST',
                headers: statics.header.json,
                body: JSON.stringify({ op: 'rnfile', name })
            })
    
            file.setName(name)

            mgr?.setShow({ text: res.message, color: 'green' })
        }
    }

    if(isOpen) return <input placeholder='Новое имя файла' defaultValue={file!.name} onKeyUp={onKeyUp}/>

    return <Button name={'rnfile'} onClick={OnClick}> rnfile </Button>
}