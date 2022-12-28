import statics from "src/statics"
import { fetchJSON } from "src/tools"
import { IFetchProvider, Params_Paged, Response_ID } from "src/tools/types"


export const ItemsProvider = new class implements IFetchProvider{
    async add(data: any): Promise<Response_ID> {
        throw new Error("Method not implemented.")
    }

    async edit(data: any): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async get(id: number): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async list(req: Params_Paged) {
        const { page, perpage } = req
        const res = await fetchJSON('POST', statics.host.api + '/api/v1/market/items/list', {
            offset: page * perpage,
            limit: perpage,
            count: true,
        })
        return res ?? { list: [], count: 0 }
    }

    async delete(id: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
}

