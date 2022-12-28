import statics from "src/statics"
import { fetchJSON } from "src/tools"
import { IFetchProvider, null_list, Params_Paged, Response_ID, Response_List } from "src/tools/types"


interface IItem{
    id: number,
    rdc: number,
    price: number,
    enabled: boolean,
    image_url: string | null 
}

type IData = Omit<IItem, 'id'>

export const CoinsProvider = new class implements IFetchProvider{

    async add(data: IData): Promise<Response_ID> {
        const res = await fetchJSON<Response_ID>('POST', statics.host.api + '/api/v1/items/coins/add', data)
        return { id: res ? res.id : 0 }
    }

    async edit(data: IData): Promise<any> {
        const res = await fetchJSON('POST', statics.host.api + '/api/v1/items/coins/add', data)
        return res
    }

    async get(id: number): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async list(req: Params_Paged): Promise<Response_List> {
        const { page, perpage } = req
        const res = await fetchJSON<Response_List>('POST', statics.host.api + '/api/v1/items/coins/list', {
            offset: page * perpage,
            limit: perpage,
            count: true,
        })
        return res ?? null_list
    }

    async delete(id: number): Promise<void> {
        await fetchJSON('DELETE', statics.host.api + '/api/v1/items/coins/delete', { id })
        return
    }
}