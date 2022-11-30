import statics from "src/statics"
import { useJSONFetch } from "src/tools"
import { DefaultArrayFetcher, IServiceMenuProps, ServiceMenu, styles } from ".."

interface IRole{
    id: number,
    name: string,
    parent: string | null
}

export function PermissionsMenu(props: IServiceMenuProps){
    const hook = useJSONFetch<any, null>('GET', statics.host.api + '/api/v1/policy/permissions/list', null)
    return <>
        <ServiceMenu data={props.data}/>
        <DefaultArrayFetcher svc={props.data} hook={hook}/>  
    </>
}