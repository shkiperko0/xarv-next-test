import { IOptionData } from "@components/gui/Select"
import statics from "src/statics"
import { fetchJSON, callback, defaultField_BooleanSelect } from "src/tools"
import { IFieldReflection, Response_List } from "src/tools/types"

interface IRole{
    id: number,
    name: string,
    parent: string | null
}

const GetMicroservicesOptions = async (): Promise<IOptionData<number>[]> => {
    try{
        const response = await fetchJSON<Response_List<IRole>>('POST', statics.host.api + '/api/v1/ms/list', {})
        const data = response!.list
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
        const response = await fetchJSON<Response_List>('POST', statics.host.api + '/api/v1/policy/roles/list', {})
        const data = response!.list
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
        const response = await fetchJSON('POST', statics.host.api + '/api/v1/items/categories/list', {})
        const data = response.list as Array<any>
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
        const response = await fetchJSON('POST', statics.host.api + '/api/v1/items/manufacturers/list', {})
        const data = response.list as Array<any>
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

export interface IModel{
    name: string,
    fields: IFieldInput[],
}

interface IModels{
    apigate: {
        ms: IModel,
        routes: IModel,
    },

    auth: {
        permissions: IModel,
        roles: IModel,
        users: IModel,
    }

    market: {
        categories: IModel,
        manufacturers: IModel,
        items: IModel,
        pkgs: IModel,
        coins: IModel,
    }
}

export const Models: IModels = {
    apigate: {
        ms: { 
            name: 'Microservice',
            fields: [
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
                    title: 'Description', 
                    name: 'description', 
                    type: 'string' 
                },
            ]
        },
        routes: {
            name: 'API Route',
            fields: [
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
        },
    },

    auth: {
        permissions: { 
            name: 'Permission',
            fields: [
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
        },
        roles: { 
            name: 'Role',
            fields: [
                ID,
                { title: 'Name', name: 'name', type: 'string' },
                { title: 'Parent', name: 'parent', type: 'string' },
            ] 
        },
        users: {
            name: 'User',
            fields: [
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
        },
    }, 

    market: {
        items: {
            name: 'Store item',
            fields: [
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
            ] 
        },
        pkgs: {
            name: 'Item package',
            fields: [
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
        },
        coins: {
            name: 'Coins pack',
            fields: [
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
        },
        manufacturers: {
            name: 'Manufacturer',
            fields: [
                ID,
                //{ title: 'Name', name: 'name', type: 'string' },
                { title: 'Title', name: 'title', type: 'string' },
                //{ title: 'Parent', name: 'parent', type: 'string' },
            ] 
        },
        categories: {
            name: 'Category',
            fields: [
                ID,
                { title: 'Name', name: 'name', type: 'string' },
                { title: 'Title', name: 'title', type: 'string' },
                { title: 'Parent', name: 'parent', type: 'string' },
            ] 
        },
    }
}

export const GetModelBySlug = (slug: string): IModel | undefined => Models[slug]