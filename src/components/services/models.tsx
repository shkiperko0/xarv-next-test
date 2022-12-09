import { IOptionData } from "@components/gui/Select"
import statics from "src/statics"
import { fetchJSON } from "src/tools"
import { IFieldReflection } from "src/tools/types"
import { callback, defaultField_BooleanSelect } from "src/utils"

interface IRole{
    id: number,
    name: string,
    parent: string | null
}

const GetMicroservicesOptions = async (): Promise<IOptionData<number>[]> => {
    try{
        const response = await fetchJSON('GET', statics.host.api + '/api/v1/ms/list')
        const data = response as Array<IRole>
        return data.map(({id, name}) => ({
            id, title: `${id}: ${name}`, value: id
        }))
    }

    catch(error){
        return []
    }
}

async function GetRolesOptions(): Promise<IOptionData<string>[]> {
    try{
        const response = await fetchJSON('GET', statics.host.api + '/api/v1/policy/roles/list')
        const data = response as Array<IRole>
        return data.map(({id, name}) => ({
            id, title: name, value: name
        }))
    }

    catch(error){
        return []
    }
}

function GetHTTPMethodsOptions(): IOptionData<string>[] {
    return [
        { id: 0, title: 'GET', value: 'GET' },
        { id: 1, title: 'POST', value: 'POST' },
        { id: 2, title: 'DELETE', value: 'DELETE' },
        { id: 3, title: 'PUT', value: 'PUT' },
        { id: 4, title: 'PATCH', value: 'PATCH' },
        { id: 5, title: 'ANY', value: 'ANY' },
    ]
}


const ID: IFieldInput = { 
    title: 'ID',
    name: 'id', 
    type: 'number' 
}

export interface IFieldInput<Type=any> extends IFieldReflection{
    title?: string,
    select?: {
        default?: Type,
        options: callback<Promise<IOptionData<Type>[]>> | callback<IOptionData<Type>[]> | IOptionData<Type>[]
    }
}

export interface IObjectReflection{
    [svc: string]: IFieldInput<any>
}

const permission_fields: IFieldInput[] = [
    ID,
    { 
        title: 'Name',
        name: 'role', 
        type: 'string', 
        select: { options: GetRolesOptions } 
    },
    { 
        title: 'Url', 
        name: 'url', 
        type: 'string' 
    },
    { 
        title: 'Enabled',
        name: 'enabled', 
        type: 'boolean',
        select: defaultField_BooleanSelect
    },
]

const ms_fields: IFieldInput[] = [
    ID,
    { 
        title: 'Name', 
        name: 'name', 
        type: 'string' 
    },
    { 
        title: 'Host', 
        name: 'host', 
        type: 'string' 
    },
    { 
        title: 'Auto Entries', 
        name: 'auto', 
        type: 'boolean', 
        select: defaultField_BooleanSelect
    },
    { 
        title: 'Description', 
        name: 'description', 
        type: 'string' 
    },
]

const routes_fields: IFieldInput[] = [
    ID,
    { 
        title: 'MSID', 
        name: 'ms_id', 
        type: 'number',
        select: {
            options: GetMicroservicesOptions
        }
    },
    { name: 'name', title: 'Name', type: 'string' },
    { 
        name: 'method', 
        title: 'Method', 
        type: 'string',
        select: {
            options: GetHTTPMethodsOptions,
            default: 'GET',
        }
    },
    { name: 'gate_url', title: 'GateURL', type: 'string' },
    { name: 'api_url', title: 'ApiURL', type: 'string' },
]

const roles_fields: IFieldInput[] = [
    ID,
    { title: 'Name', name: 'name', type: 'string' },
    { title: 'Parent', name: 'parent', type: 'string' },
]

const users_fields: IFieldInput[] = [
    ID,
    { title: 'Alias', name: 'alias', type: 'string' },
    { title: 'Email', name: 'email', type: 'string' },
    { title: 'Birth date', name: 'bdate', type: 'string' },
    { title: 'Role', name: 'role', type: 'string' },

    { title: 'Verifed', name: 'verified', type: 'boolean' },
    { title: 'Blocked', name: 'blocked', type: 'boolean' },
    { title: 'Subscribes', name: 'subscribe', type: 'string' },
    { title: 'Ref', name: 'referral', type: 'string' },
    { title: 'Promo', name: 'promo', type: 'string' },
]

export const svcs_item: {
    [svc: string]: { fields: IFieldInput<any>[] }
} = {
    permissions: { fields: permission_fields },
    ms: { fields: ms_fields },
    roles: { fields: roles_fields },
    routes: { fields: routes_fields },
    users: { fields: users_fields },
}


// ID          uint           `json:"id" gorm:"primaryKey, autoIncrement"`
// Name        string         `json:"name" gorm:"not null"`
// Host        string         `json:"host" gorm:"index:idx_host,unique"`
// AutoEntries bool           `json:"auto" gorm:"not null, default:false"`
// Description string         `json:"description" gorm:"default:null"`
// CreatedAt   time.Time      `json:"created_at" gorm:"autoCreateTime"`
// UpdatedAt   time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
// DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`

// ID          uint           `json:"id" gorm:"primaryKey, autoIncrement"`
// MSID        uint           `json:"ms_id" gorm:"not null"`
// Name        string         `json:"name" gorm:"not null"`
// Description string         `json:"description" gorm:"default:null"`
// GateURL     string         `json:"gate_url" gorm:"index:idx_gate_url,unique"`
// ApiURL      string         `json:"api_url" gorm:"not null"`
// Method      string         `json:"method" gorm:"not null"`
// CreatedAt   time.Time      `json:"created_at" gorm:"autoCreateTime"`
// UpdatedAt   time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
// DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`










export default {}