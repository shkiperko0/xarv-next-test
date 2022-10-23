import Button from "../Button";
import { MouseEvent, useContext, useState } from "react"
import Some from "../../Some";
import { DirContext } from "./Dir";

export default function DirUnploadButton(){
    const dir = useContext(DirContext)

    const [ isOpen, setOpened ] = useState(false)

    async function OnClick(event: MouseEvent<HTMLButtonElement>){
        if(!dir) return
        setOpened(true)
        event.stopPropagation()
        return
    }

    if(isOpen) return <Some.TempUpload path={dir!.path}/>

    return <Button name={'upload'} onClick={OnClick}> upload </Button>
}