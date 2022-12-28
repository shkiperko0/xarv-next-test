import statics from "src/statics"
import { fetchJSON } from "src/tools"
import { IFetchProvider, null_list, Params_Paged, Response_List } from "src/tools/types"

export const UsersProvider = new class implements IFetchProvider{

    async add(data: any): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async edit(data: any): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async get(id: number): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async list(req: Params_Paged): Promise<Response_List> {
        const { page, perpage } = req
        const res = await fetchJSON('POST', statics.host.api + '/api/v1/users/list', {
            offset: page * perpage,
            limit: perpage,
            count: true,
        })
        return res ?? null_list
    }

    async delete(id: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
}

