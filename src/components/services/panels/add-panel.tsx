import { useRouter } from "next/router"
import { useState } from "react"
import { GetObjectReflect } from "src/tools"
import { IServiceMenuProps, ItemEditMenu, styles } from ".."


export function AddItemMenu(props: IServiceMenuProps){
    const { query, pathname } = useRouter()

    const [ data = {}, setData ] = useState<object>(props.data) 

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
        <span>{JSON.stringify(data)}</span>
        <span>{JSON.stringify({query, pathname})}</span>
    </div>
}