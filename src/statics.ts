namespace statics {

    const xarv = {
        main: 'https://xarv.ru',
        api: 'https://api.xarv.ru',
    }

    export const host = xarv

    export const url = {
        files: '/files'
    }

    export const headers = {
        content_type: 'Content-Type'
    }

    export const mime = {
        json: 'application/json'
    }

    export const header = {
        json: { [statics.headers.content_type]: statics.mime.json }
    }

}  

export default statics


// Линковать ./build к ~/Data/html/build
// mklink /J create_link_dir target_real_dir
// mklink /J build "./../../../Data/html/build