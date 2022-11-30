import { LeftSide, RightSide, SidedDiv } from "@components/gui/Bars"
import { Button } from "@components/gui/Button"
import Buttons from "@components/gui/Buttons"
import { ITableRowProps, Table } from "@components/gui/Table"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { format } from "path"
import { ChangeEventHandler, useState } from "react"
import { publicProfile, useAuth } from "src/contexts/auth"
import statics from "src/statics"
import { AnyJSON_fromBase64, AnyJSON_toBase64, clearAuthCookies, findByKey, GetObjectReflect, Header_Auth_JSON, toBase64, useJSONFetch } from "src/tools"
import { IButtonProps, JSTypes } from "src/tools/types"
import { cl, Text2Type, Type2Text } from "src/utils"
import { AddItemMenu } from "./panels/add-panel"
import { EditItemMenu, EditTestItemMenu } from "./panels/edit-panel"
import { PermissionsMenu } from "./panels/list-permissions"
import { RolesMenu } from "./panels/list-roles"
import styles from "./styles.module.scss"

export { styles }

interface IService{
    name?: string,
    menu?(props:{ data: IService }): JSX.Element,
    slug: string,
    apiEditEntry?: string
}

interface IContentCategory{
    id: number,
    name: string,
    title: string
}


interface IDefaultArrayFetcherProps<Res>{
    hook: ReturnType<typeof useJSONFetch<Res, any>>,
    svc: IService,
}

export function DefaultArrayFetcher<Res=any[]>(props: IDefaultArrayFetcherProps<Res>){
    const { hook: { data, isLoading }, svc } = props
    const { push } = useRouter()

    if(isLoading){
        return <>
            loading
        </>
    }

    function Actions(props: ITableRowProps){
        return <>
            <Button>Edit</Button>
        </>
    }

    function onAction(action: string, item: any, index: number){
        push(`/services/edit?svc=${svc.slug}&index=${index}&data=${AnyJSON_toBase64(item)}`)
        //alert(`ACTION ${action} ON INDEX ${index} DATA ${JSON.stringify(item)} `)
    }

    if(data){
        if((data as any[]).length == 0){
            return <>No Data {'(length == 0)'}</>
        }

        return <Table className={styles.table} data={data as any[]} columns={{ Actions }} />
    }

    return <>No Data {'(undefined)'}</>
}


interface IServiceButtonProps{
    data: IService
    active?: boolean
}

function ServiceButton(props: IServiceButtonProps){
    const { data: service } = props
    return <Link href={`/services/${service.slug}`}>
        <div className={cl(styles.svc_navlink, [styles.active, props.active])}>
            <span>{service.name}</span>
        </div>
    </Link>
}

interface IServiceProps{
    data: IService
    apiEditEntry?: string
}

export type IServiceMenuProps = IServiceProps

export function ServiceMenu(props: IServiceMenuProps){
    const { data: service } = props
    const { query: { slug } , push } = useRouter()
    return <>
        <SidedDiv className={styles.svc_header}>
            <LeftSide className={styles.svc_name}>
                <span>{service.name}</span>
            </LeftSide>
            <RightSide>
                <Button onClick={() => push(`add?svc=${service.slug}`)}>Add item +</Button>
            </RightSide>
        </SidedDiv>
    </>
}

function RoutesMenu(props: IServiceMenuProps){
    const hook = useJSONFetch<IContentCategory[], null>('GET', statics.host.api + '/api/v1/routes/list', null)
    return <>
        <ServiceMenu data={props.data}/>
        <DefaultArrayFetcher svc={props.data} hook={hook}/>   
    </>
}

function MCsMenu(props: IServiceMenuProps){
    const hook = useJSONFetch<IContentCategory[], null>('GET', statics.host.api + '/api/v1/ms/list', null)
    return <>
        <ServiceMenu data={props.data}/>
        <DefaultArrayFetcher svc={props.data} hook={hook}/>  
    </>
}


interface IItemFieldInputProps{
    name: string,
    title: string,
    disabled?: true,
    type: JSTypes,
    value: string
    onChange?: ChangeEventHandler<HTMLInputElement>
}

function ItemFieldInput(props: IItemFieldInputProps){
    const { name, title, type, value, onChange } = props
    const unchangeabl_types: JSTypes[] = ['function', 'symbol', 'undefined']
    const disabled = props.disabled || unchangeabl_types.indexOf(type) != -1
    return <>
        <p>
            <span>{title}</span>: <span>{type}</span>
            <input onChange={onChange} defaultValue={value} name={name} type="text" disabled={disabled} />
            <span>{Type2Text(value, type)}</span>
        </p>
    </>
}

interface IItemEditMenuProps<Type=any>{
    data?: Type,
    fields: {
        [name: string]: {
            title: string,
            disabled?: true,
            type: JSTypes
        }
    },
    apiEditEntry?: string
    onChange(field: string, value: Type): Promise<void> | void
}

export function ItemEditMenu<Type>(props: IItemEditMenuProps<Type>){
    const { fields, onChange, data = {}, apiEditEntry } = props
    return <>
        { 
            Object.entries(fields).map(([name, value]) => 
                <ItemFieldInput 
                    name={name} 
                    title={value.title}
                    type={value.type}
                    disabled={value.disabled}
                    value={ Type2Text(data[name], value.type) } 
                    onChange={(event) => onChange(name, Text2Type(event.currentTarget.value, value.type))}
                />
            ) 
        }
    </>
}



const services: IService[] = [
    { 
        name: 'Microservices',
        slug: 'ms',
        menu: MCsMenu,
    },{ 
        name: 'Roles', 
        menu: RolesMenu,
        slug: 'roles',
        apiEditEntry: '/test/public/edit'
    },{ 
        name: 'Permissions',
        menu: PermissionsMenu,
        slug: 'permissions',
    },{   
        name: 'Routes',
        slug: 'routes',
        menu: RoutesMenu,
    },{ 
        name: 'Users',
        slug: 'users',
    },{ 
        slug: 'add',
        menu: AddItemMenu,
    },{ 
        slug: 'edit',
        menu: EditItemMenu,
    },{ 
        slug: 'edit-test',
        menu: EditTestItemMenu,      
    }
] 

export const getServiceBySlug = (slug: string) => findByKey(services, 'slug', slug)

export default function(props: any){
    return <>
        <Head><title>Services</title></Head>   
        <div className={styles.root}>
            <Topbar/>
            <Body/>
            <Bottombar/>
        </div>
    </>
}

function LogoutButton(props: IButtonProps){
    const { setProfile } = useAuth()
    return <Button 
        className={styles.logout_btn} 
        onClick={
                event => {
                clearAuthCookies()
                setProfile(publicProfile)
                event.preventDefault()
                event.stopPropagation()
            }
        }
    > 
        <span>Logout</span>
    </Button>
}

function Topbar(){
    const { query: { slug } } = useRouter()

    return <SidedDiv className={styles.topbar}>
        <LeftSide className={styles.left}>
            { services.map(s => (s.name && <ServiceButton data={s} active={s.slug == slug} />)) }
        </LeftSide>
        <RightSide className={styles.right}>
            <LogoutButton/>
        </RightSide>
    </SidedDiv>
}

function Bottombar(){
    const { pathname, query, route } = useRouter()

    return <SidedDiv className={styles.bottombar}>
        <LeftSide className={styles.left}>{JSON.stringify({ router: { pathname, query, route } })}</LeftSide>
    </SidedDiv>
}

function Leftbar(){
    return <div className={styles.lbar}></div>
}


function Main(){
    const { query: { slug } } = useRouter()
    const service = getServiceBySlug(slug as string)

    if(!service)
        return <>Undefined service {`'${slug}'`}</>

    const Menu = service.menu
    return <div className={styles.main}>
        { Menu && <Menu data={service}/> }
    </div>
}

function Body(){
    return <div className={styles.body}>
        <Leftbar/><Main/>
    </div>
}

