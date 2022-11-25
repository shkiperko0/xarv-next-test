import Head from "next/head"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import statics from "src/statics"
import { Header_Auth_JSON } from "src/tools"
import styles from "./styles.module.scss"

interface IService{
    name: string,
    menu?: ReactNode
}

type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS'

function useJSONFetch<BodyType=any, ResponseType=any>(method: HttpMethod, input: RequestInfo | URL){
    const [ data, setData ] = useState<ResponseType | null>(null)
    const [ status, setStatus ] = useState(0)

    function _fetch(body: BodyType){

        const _async = async (body: BodyType) => {
            try{
                const response = await fetch(input, {
                    method, 
                    headers: Header_Auth_JSON(), 
                    body: body ? JSON.stringify(body) : undefined
                })

                const json = await response.json()

                setStatus(response.status)
                setData(json)
            }
            catch(error){
                setStatus(500)
                setData(null)
            }
        }

        _async(body)
    }

    return { fetch: _fetch, data, status }
}

function RolesMenu(){
    const [ req, setReq ] = useState<any>(null)
    const { data, fetch } = useJSONFetch<any, any>('GET', statics.host.api + '/api/v1/content/categories')

    useEffect(() => fetch(req), [req])

    if(data){
        return <>
            { JSON.stringify(data) }
        </>
    }

    return <>
        loading
    </>
}


const services: IService[] = [
    { name: 'Microservices' },
    { name: 'Roles', menu: <RolesMenu/> },
    { name: 'Permissions' },
    { name: 'Routes' },
    { name: 'Users' },
] 



export default function(){
    return <>
        <Head><title>Services</title></Head>   
        <div className={styles.root}>
            <Topbar/>
            <Body/>
        </div>
    </>
}

function ServiceButton(props: IService){
    return <div className={styles.svcnavlink}>{props.name}</div>
}

function Topbar(){
    return <div className={styles.topbar}>
        { services.map(s => <ServiceButton {...s} />) }
    </div>
}

function Leftbar(){
    return <div className={styles.lbar}></div>
}

function Main(){

    const service = services[1]

    return <div className={styles.main}>
        <div className={styles.svcname}><span>{service.name}</span></div>
        <div className={styles.svcmenu}>{service.menu}</div>
    </div>
}

function Body(){
    return <div className={styles.body}>
        <Leftbar/><Main/>
    </div>
}

