namespace statics {

    export const host = {
        // main: 'http://192.168.0.25:3000', 
        // api: 'http://192.168.0.25',
        
        main: 'https://eamgames.net', 
        api: 'https://api.eamgames.net',
        

        //eam: 'https://eamgames.net',
    }

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
