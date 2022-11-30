import { Button } from "@components/gui/Button"
import Buttons from "@components/gui/Buttons"
import { useRouter } from "next/router"
import { useState } from "react"
import statics from "src/statics"
import { AnyJSON_fromBase64, GetObjectReflect, useJSONFetch } from "src/tools"
import { getServiceBySlug, IServiceMenuProps, ItemEditMenu, styles } from ".."

export function EditItemMenu(props: IServiceMenuProps){
    const { query: { svc, index, data: text }, pathname } = useRouter()

    const [ data = {}, setData ] = useState<object>(AnyJSON_fromBase64(text as string)) 

    return <div className={styles.svc_menu}>
        <ItemEditMenu 
            fields={GetObjectReflect(data)} 
            onChange={
                (field, value) => {
                    if(typeof data[field] == 'object' && value == undefined) return
                    setData({ ...data, [field]: value })
                }
            }
            data={data}
        />
        {/* <span>{JSON.stringify(data)}</span> */}
        <span>{JSON.stringify({query: { svc, index }, pathname})}</span>
    </div>
}


export function EditTestItemMenu(props: IServiceMenuProps){
    const { query: { svc, index, data: text }, pathname, push } = useRouter()
    const service = getServiceBySlug(svc as string)

    const { fetch } = useJSONFetch('POST', statics.host.api + service!.apiEditEntry)
    const [ data = {}, setData ] = useState<object>(AnyJSON_fromBase64(text as string)) 

    const goList = () => {
        push(pathname.replace('[slug]', svc as string))
    }

    const goSave = () => {
        fetch(data)
        //push(pathname.replace('[slug]', svc as string))
    }

    return <div className={styles.svc_menu}>
        <ItemEditMenu 
            fields={GetObjectReflect(data)} 
            onChange={
                (field, value) => {
                    if(typeof data[field] == 'object' && value == undefined) return
                    setData({ ...data, [field]: value })
                }
            }
            data={data}
        />
        
        <Buttons>
            <Button onClick={goSave}>Save</Button>
            <Button onClick={goList}>Cancel</Button>
        </Buttons> 
    </div>
}