import { useContext } from "react"
import { fetch_json, ManagerContext } from "."
import statics from "../../../statics"
import Button from "../Button"
import { DirContext } from "./Dir"

export default function DirRemoveButton(){
    const dir = useContext(DirContext)
    const mgr = useContext(ManagerContext)

    async function OnClick(){
        if(!dir) return

        try{
            const res = await fetch_json(dir.path, {
                method: 'POST',
                headers: statics.header.json,
                body: JSON.stringify({ op: 'rmdir' })
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

    return <Button name={'rmdir'} onClick={OnClick}> rmdir </Button>
}