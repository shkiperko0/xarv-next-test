import { IOptionData } from "@components/gui/Select"
import statics from "src/statics"
import { fetchJSON, callback, defaultField_BooleanSelect } from "src/tools"
import { IFieldReflection } from "src/tools/types"

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

async function GetItemsCategoriesOptions(): Promise<IOptionData<string>[]> {
    try{
        const response = await fetchJSON('GET', statics.host.api + '/api/v1/market/categories')
        const data = response as Array<any>
        return data.map(({id, title}) => ({
            id, title, value: id
        }))
    }

    catch(error){
        return []
    }
}

async function GetItemsManufacturersOptions(): Promise<IOptionData<string>[]> {
    try{
        const response = await fetchJSON('GET', statics.host.api + '/api/v1/market/manufactures')
        const data = response as Array<any>
        return data.map(({id, title}) => ({
            id, title, value: id
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

    { 
        title: 'Verifed', 
        name: 'verified', 
        type: 'boolean',
        select: defaultField_BooleanSelect
    },
    { 
        title: 'Blocked', 
        name: 'blocked', 
        type: 'boolean',
        select: defaultField_BooleanSelect
    },
    { title: 'Subscribes', name: 'subscribe', type: 'string' },
    { title: 'Ref', name: 'referral', type: 'string' },
    { title: 'Promo', name: 'promo', type: 'string' },
]

const market_fields: IFieldInput[] = [
    ID,
    { title: 'Name', name: 'name', type: 'string' },
    { 
        title: 'Category', 
        name: 'category_id', 
        type: 'number', 
        select: {
            options: GetItemsCategoriesOptions
        } 
    },
    { title: 'Description', name: 'description', type: 'string' },
    { 
        title: 'Enabled', 
        name: 'enabled', 
        type: 'boolean',
        select: defaultField_BooleanSelect
    },

    { title: 'Image URL', name: 'image_url', type: 'string' },
    { title: 'Price', name: 'price', type: 'object' },
    { 
        title: 'Manufacturer', 
        name: 'manufacturer_id', 
        type: 'number',
        select: {
            options: GetItemsManufacturersOptions
        } 
    },
    { title: 'Title', name: 'title', type: 'string' },
    { title: 'Time limit', name: 'timelimit', type: 'string' },
    { 
        title: 'Time limit check', 
        name: 'timelimit_check', 
        type: 'boolean',
        select: defaultField_BooleanSelect
    },
]

const pkg_fields: IFieldInput[] = [
    ID,
    { title: 'Name', name: 'name', type: 'string' },
    { title: 'Title', name: 'title', type: 'string' },
    { title: 'Items', name: 'items', type: 'object' },
    { title: 'Price', name: 'price', type: 'object' },
    { title: 'Description', name: 'description', type: 'string' },
    { title: 'Image URL', name: 'image_url', type: 'string' },
    { 
        title: 'Enabled', 
        name: 'enabled', 
        type: 'boolean',
        select: defaultField_BooleanSelect
    },
]

const coins_fields: IFieldInput[] = [
    ID,
    { title: 'RDC', name: 'rdc', type: 'number' },
    { title: 'Price', name: 'price', type: 'number' },
    { 
        title: 'Enabled', 
        name: 'enabled', 
        type: 'boolean',
        select: defaultField_BooleanSelect
    },
    { title: 'Image URL', name: 'image_url', type: 'string' },
]

const market_manufacturers_fields: IFieldInput[] = [
    ID,
    //{ title: 'Name', name: 'name', type: 'string' },
    { title: 'Title', name: 'title', type: 'string' },
    //{ title: 'Parent', name: 'parent', type: 'string' },
]

const market_categories_fields: IFieldInput[] = [
    ID,
    { title: 'Name', name: 'name', type: 'string' },
    { title: 'Title', name: 'title', type: 'string' },
    { title: 'Parent', name: 'parent', type: 'string' },
]

export const svcs_item = {
    permissions: { fields: permission_fields },
    ms: { fields: ms_fields },
    roles: { fields: roles_fields },
    routes: { fields: routes_fields },
    users: { fields: users_fields },
    market: { fields: market_fields },
    pkg: { fields: pkg_fields },
    coins: { fields: coins_fields },

    
    market_manufacturers: { fields: market_manufacturers_fields },
    market_categories: { fields: market_categories_fields },
}

export const Models = Object.fromEntries(
    Object.entries(svcs_item).map(
        ([name, i]) => [name, i.fields]
    )
)

export type IModel = IFieldInput[]
