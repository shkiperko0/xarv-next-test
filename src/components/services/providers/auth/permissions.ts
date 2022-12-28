import statics from "src/statics"
import { fetchJSON } from "src/tools"
import { IFetchProvider, null_list, Params_Paged, Response_ID, Response_List } from "src/tools/types"

export const PermissionsProvider = new class implements IFetchProvider{

    async add(data: any): Promise<Response_ID> {
        const res = await fetchJSON<Response_ID>('POST', statics.host.api + '/api/v1/policy/permissions/add', data)
        return { id: res ? res.id : 0 }
    }

    async edit(data: any): Promise<any> {
        return fetchJSON('POST', statics.host.api + '/api/v1/policy/permissions/edit', data)
    }

    async get(id: number): Promise<any> {
        throw new Error("Method not implemented.")
    }

    async list(req: Params_Paged): Promise<Response_List> {
        const { page, perpage } = req
        const res = await fetchJSON('POST', statics.host.api + '/api/v1/policy/permissions/list', {
            offset: page * perpage,
            limit: perpage,
            count: true,
        })
        return res ?? null_list
    }

    async delete(id: number): Promise<void> {
        return fetchJSON('DELETE', statics.host.api + '/api/v1/policy/permissions/delete', { id })
    }
}

