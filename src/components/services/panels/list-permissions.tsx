import statics from "src/statics"
import { useJSONFetch } from "src/tools"
import { DefaultArrayFetcher, IServiceMenuProps, ServiceMenu, styles } from ".."

interface IPermission{
    id: number,
    role: string,
    url: string,
    enabled: boolean
}

export function PermissionsMenu(props: IServiceMenuProps){
    const hook = useJSONFetch<IPermission[], null>('GET', statics.host.api + props.data.apiListEntry, null)
    return <>
        <ServiceMenu data={props.data}/>
        <DefaultArrayFetcher svc={props.data} hook={hook}/>  
    </>
}