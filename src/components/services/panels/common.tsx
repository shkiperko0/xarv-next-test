import { IOptionData } from "@components/gui/Select";
import { Button } from "@components/gui/Button"
import { useState } from "react"
import { ItemEditMenu, styles } from ".."
import { IModel } from "../models";
import { Buttons } from "@components/gui/Buttons";
import { IFetchProvider } from "src/tools/types";

export const select_perpage_options: IOptionData[] = [
    { id: 0, value: 5 },
    { id: 1, value: 10 },
    { id: 2, value: 15 },
    { id: 3, value: 30 },
    { id: 4, value: 45 },
    { id: 5, value: 60 },
]

interface IAddModelProps{
    data: any,
    model: IModel,
    provider: IFetchProvider
    onSave?(): void,
    onClose?(): void
}

export function AddModel(props: IAddModelProps){
    const { model, provider, onClose, onSave } = props
    const [ data = {}, setData ] = useState<object>(props.data) 

    const goSave = async () => { 
        await provider.add(data)
        onSave && onSave()
    }

    const goClose = () => {
        onClose && onClose()
    }

    const fields = model.fields.filter(({name}) => name != 'id')

    return <div className={styles.svc_menu}>
        <ItemEditMenu className={styles.fields}
            fields={fields} 
            onChange={
                (field, value) => {
                    if(typeof data[field] == 'object' && value == undefined) return
                    setData({ ...data, [field]: value })
                }
            }
            data={data}
        />
        
        <Buttons className={styles.buttons}>
            <Button className={styles.button_save} onClick={() => goSave()}>Save</Button>
            <Button className={styles.button_cancel} onClick={() => goClose()}>Cancel</Button>
        </Buttons> 
    </div>
}

interface IEditModelProps{
    data: any,
    model: IModel,
    provider: IFetchProvider
    onSave?(): void,
    onClose?(): void
}

export function EditModel(props: IEditModelProps){
    const { model, provider, onClose, onSave } = props
    const [ data = {}, setData ] = useState(props.data) 

    const goSave = async () => { 
        await provider.edit(data)
        onSave && onSave()
    }

    const goClose = () => {
        onClose && onClose()
    }
    
    const fields = model.fields.filter(({name}) => name != 'id')

    return <div className={styles.svc_menu}>
        <ItemEditMenu className={styles.fields}
            fields={fields} 
            onChange={
                (field, value) => {
                    if(typeof data[field] == 'object' && value == undefined) return
                    setData({ ...data, [field]: value })
                }
            }
            data={data}
        />
        
        <Buttons className={styles.buttons}>
            <Button className={styles.button_save} onClick={() => goSave()}>Save</Button>
            <Button className={styles.button_cancel} onClick={() => goClose()}>Cancel</Button>
        </Buttons> 
    </div>
}