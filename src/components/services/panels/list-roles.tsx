import statics from "src/statics"
import { useJSONFetch } from "src/tools"
import { DefaultArrayFetcher, IServiceMenuProps, ServiceMenu, styles } from ".."

interface IRole{
    id: number,
    name: string,
    parent: string | null
}


export function RolesMenu(props: IServiceMenuProps){
    const hook = useJSONFetch<IRole[], null>('GET', statics.host.api + props.data.apiListEntry, null)
    return <>
        <ServiceMenu data={props.data}/>
        <DefaultArrayFetcher svc={props.data} hook={hook}/>  
    </>
}