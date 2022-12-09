import { Button } from "@components/gui/Button"
import { Buttons }from "@components/gui/Buttons"
import { useRouter } from "next/router"
import { useState } from "react"
import statics from "src/statics"
import { useJSONFetch } from "src/tools"
import { getServiceBySlug, IServiceMenuProps, ItemEditMenu, styles } from ".."
import { svcs_item } from "../models"

export function AddItemMenu(props: IServiceMenuProps){
    const { query, pathname, push } = useRouter()
    const { svc: slug, index, data: text} = query as { [_: string]: string }
    const [ data = {}, setData ] = useState<object>({}) 

    const svc_item = svcs_item[slug]
    const svc = getServiceBySlug(slug)
    if(!svc_item || !svc) return <></>

    const { fetch } = useJSONFetch('POST', statics.host.api + svc.apiAddEntry)

    const goList = () => {
        push(pathname.replace('[slug]', slug))
    }
    
    const goSave = () => {
        fetch(data).then(() => {
            push(pathname.replace('[slug]', slug))
        })
        //push(pathname.replace('[slug]', svc as string))
    }

    const { fields } = svc_item

    return <div className={styles.svc_menu}>
        <ItemEditMenu className={styles.fields}
            fields={svc_item.fields.filter(({name}) => name != 'id')} 
            onChange={
                (field, value) => {
                    if(typeof data[field] == 'object' && value == undefined) return
                    setData({ ...data, [field]: value })
                }
            }
            data={data}
        />
        
        <Buttons className={styles.buttons}>
            <Button className={styles.button_save} onClick={goSave}>Save</Button>
            <Button className={styles.button_cancel} onClick={goList}>Cancel</Button>
        </Buttons> 
    </div>
}