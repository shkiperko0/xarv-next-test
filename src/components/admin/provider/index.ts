import { CreateParams, CreateResult, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetListParams, GetListResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, PaginationPayload, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult } from 'react-admin';
import { ResourceController } from './controller';
import { PagesController } from './controller/pages';
import { PostsController } from './controller/posts';

const ResourceControllers: {
    [name: string]: ResourceController
} = {
    posts: new PostsController(),
    pages: new PagesController()
}

function getResourceController(name: string): ResourceController {
    const controller = ResourceControllers[name]
    if(!controller) throw Error(`Invalid resource controller (${name})`)
    return controller
}

export class ResourceProvider{
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        return await getResourceController(resource).getList(params)
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        return await getResourceController(resource).getOne(params)       
    }

    async getMany(resource: string, params: GetManyParams): Promise<GetManyResult> {
        return getResourceController(resource).getMany(params)
    }

    async getManyReference(resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult> {
        return getResourceController(resource).getManyReference(params)
    }

    async update(resource: string, params: UpdateParams): Promise<UpdateResult> {
        return getResourceController(resource).update(params)
    }
        
    async updateMany(resource: string, params: UpdateManyParams): Promise<UpdateManyResult> {
        return getResourceController(resource).deleteMany(params)
    }

    async create(resource: string, params: CreateParams): Promise<CreateResult> {
        return getResourceController(resource).create(params)
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        return getResourceController(resource).delete(params)
    }

    async deleteMany(resource: string, params: DeleteManyParams): Promise<DeleteManyResult> {
        return getResourceController(resource).deleteMany(params)
    }
}
