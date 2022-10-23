import { useContext } from "react"
import { fetch_json, ManagerContext } from "."
import statics from "../../../statics"
import Button from "../Button"
import { FileContext } from "./File"

export default function FileRemoveButton(){
    const file = useContext(FileContext)
    const mgr = useContext(ManagerContext)

    async function OnClick(){
        if(!file) return

        try{
            const res = await fetch_json(file.path, {
                method: 'POST',
                headers: statics.header.json,
                body: JSON.stringify({ op: 'rm' })
            })

            console.log(res)
            mgr?.setShow({ text: res.message, color: 'green' })
        }
        catch(error){
            console.log(error)
            mgr?.setShow({ text: JSON.stringify(error), color: 'red' })
        }
        
        return
    }

    return <Button name={'fremove'} onClick={OnClick}> fremove </Button>
}