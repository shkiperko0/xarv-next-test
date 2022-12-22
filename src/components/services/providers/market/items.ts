import statics from "src/statics"
import { fetchJSON, IFetchProvider } from "src/tools"
import { Params_Paged } from ".."

export const ItemsProvider = new class implements IFetchProvider{
    async add(data: any): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async edit(id: number, data: any): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async get(id: number): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async list(req: Params_Paged): Promise<any> {
        const { page, perpage } = req
        return await fetchJSON('POST', statics.host.api + '/api/v1/market/items/list', {
            offset: page * perpage,
            limit: perpage,
            count: true,
        })
    }

    async delete(id: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
}

