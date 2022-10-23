import { KeyboardEvent, MouseEvent, useContext, useState } from "react"
import { fetch_json, ManagerContext } from "."
import statics from "../../../statics"
import Button from "../Button"
import { DirContext } from "./Dir"

export default function RNDirButton(){
    const dir = useContext(DirContext)
    const mgr = useContext(ManagerContext)

    const [ isOpen, setOpened ] = useState(false)

    async function OnClick(event: MouseEvent<HTMLButtonElement>){
        if(!dir) return
        setOpened(true)
        event.stopPropagation()
        return
    }

    async function onKeyUp(event: KeyboardEvent<HTMLInputElement>){
        event.stopPropagation()
        if(!dir) return 
        console.log(event.key)
        if(event.key === 'Enter'){
            const input = event.currentTarget
            const name = input.value
            event.preventDefault()
            setOpened(false)

            const res = await fetch_json(dir.path, {
                method: 'POST',
                headers: statics.header.json,
                body: JSON.stringify({ op: 'rndir', name })
            })
    
            dir.setName(name)

            mgr?.setShow({ text: res.message, color: 'green' })
        }
    }

    if(isOpen) return <input placeholder='Новое имя папки' onKeyUp={onKeyUp}/>

    return <Button name={'rndir'} onClick={OnClick}> rndir </Button>
}