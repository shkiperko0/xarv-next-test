import { useEffect, useState } from "react";
import statics from "src/statics";
import styles from "./WiwManager.module.scss"

interface IRole{
    include: string[],
    permissions: string[],
    access: string[],
}

interface IPermission{
    include?: string[],
    description?: string
}

interface IRoles{
    [name: string]: IRole
}

interface IPermissions{
    [name: string]: IPermission
}

async function fetch_wiw(url: string, cb: (_: any) => void){
    const res = await fetch(`${statics.host.api}${url}`)
    const json = await res.json()
    cb(json)
}

export function WiwPermission(props: { name: string, value?: IPermission }){
    const { name, value } = props
    return <div draggable className={styles.permission}>
        <span>{name}</span>
    </div>
}

export function WiwManager(){
    const [ roles, setRoles ] = useState<IRoles>(null as any)
    const [ permissions, setPermissions ] = useState<IPermissions>(null as any)

    useEffect(() => { if(!roles) fetch_wiw('/api/roles', setRoles) }, [roles])
    useEffect(() => { if(!permissions) fetch_wiw('/api/permissions', setPermissions) }, [permissions])

    const Role = (name: string, role: IRole) => <>
        <div>
            <span>Role: {name}</span>
            <div className={styles.permissions}>
                { role.access.map(perm => WiwPermission({ name: perm, value: permissions[perm] })) }
            </div>
        </div>
    </>

    if(!roles || !permissions)
        return <>Loading?</>

    return <div className={styles.wiwm}>
        <div className={styles.roles}>
            { Object.entries(roles).map(([name, value]) => Role(name, value)) }
        </div>
    
        <div>
            <span>All permissions</span>
            <div className={styles.permissions}>
                { Object.entries(permissions).map(([name, value]) => WiwPermission({ name, value })) }
            </div>
        </div>
    </div>
}
