import statics from "src/statics"
import { fetchJSON, IFetchProvider } from "src/tools"
import { Params_List, Response_List } from ".."


interface IItem{
    id: number,
    name: string,
    title: string,
}

type IData = Omit<IItem, 'id'>

export const CategoriesProvider = new class implements IFetchProvider{

    async add(data: IData): Promise<Response_List> {
        const res = await fetchJSON<Response_List>('POST', statics.host.api + '/api/v1/items/categories/add', data)
        return res
    }

    async edit(id: number, data: IData): Promise<any> {
        const res = await fetchJSON('POST', statics.host.api + '/api/v1/items/categories/add', { id, ...data } )
        return res
    }

    async get(id: number): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async list(req: Params_List): Promise<Response_List> {
        const res = await fetchJSON<Response_List>('POST', statics.host.api + '/api/v1/items/categories/list', req)
        return res
    }

    async delete(id: number): Promise<void> {
        const res = await fetchJSON('DELETE', statics.host.api + '/api/v1/items/categories/delete', { id })
        return
    }
}