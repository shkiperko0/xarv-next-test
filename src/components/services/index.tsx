import { LeftSide, RightSide, SidedDiv } from "@components/gui/Bars"
import { Button } from "@components/gui/Button"
import { Buttons }from "@components/gui/Buttons"
import { ITableRowProps, Table } from "@components/gui/Table"
import { Select } from "@components/gui/Select"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEventHandler, MouseEventHandler, ReactChild } from "react"
import { publicProfile, useAuth } from "src/contexts/auth"
import statics from "src/statics"
import { IButtonProps, JSType } from "src/tools/types"
import { cl, Text2Type, Type2Text, AnyJSON_toBase64, clearAuthCookies, findByKey, useJSONFetch } from "src/tools"
import { AddItemMenu } from "./panels/add-panel"
import { EditItemMenu } from "./panels/edit-panel"
import { PermissionsMenu } from "./panels/list-permissions"
import { RolesMenu } from "./panels/list-roles"
import styles from "./styles.module.scss"
import { Input } from "@components/gui/Input"
import { IFieldInput, svcs_item } from "./models"
import { useBackground } from "src/contexts/bg"
import { useWindows } from "@components/taskmanager"
import { FileManager } from "@components/filemanager"
import { DataEditorTest } from "./panels/data-editor"
import { Slugger } from "@components/gui/Slugger"
import { ConfirmDialog } from "@components/gui/Dialog"

import { Menu as MarketMenu } from './panels/market'

export { styles }

interface IService{
    name?: string,
    menu(props:{ data: IService }): JSX.Element,
    slug: string,

    apiAddEntry?: string
    apiEditEntry?: string
    apiListEntry?: string
    apiDeleteEntry?: string
}

interface IContentCategory{
    id: number,
    name: string,
    title: string
}

const defaultDatesHeaderNames = {
    name: 'Name',
    description: 'Description',
	created_at: 'Created At',
	updated_at: 'Updated At',
	deleted_at: 'Deleted At'
}

interface IDefaultArrayFetcherProps<Res>{
    hook: ReturnType<typeof useJSONFetch<Res, any>>,
    svc: IService,
}

export function DefaultArrayFetcher(props: IDefaultArrayFetcherProps<any>){
    const { hook: { data: _data, isLoading, setFetchState }, svc } = props
    const { push } = useRouter()
    const { fetch } = useJSONFetch('DELETE', statics.host.api + svc.apiDeleteEntry)
    const bg = useBackground()

    let data: any[] | undefined = undefined
    if(_data instanceof Array){
        data = _data
    }
    
    else if(_data instanceof Object && _data['list'] !== undefined){    
        data = _data.list
    }

    //console.log({some: 'a', data})

    //_data ? ((_data as any).list ?? _data) : undefined ()?.list ?? _data


    const Actions = (svc.apiDeleteEntry || svc.apiEditEntry) ? ((props: ITableRowProps) => {
        const { row, index } = props

        const onAccept_Delete = async () => {
            fetch({
                id: row['id'],
                //name: row['name'],
            }).then(({ data: res, status, error }) => {
                bg.close();

                if( status != 200 ){
                    if(error){
                        alert(`net error ` + error)
                    } else if(res){

                        const split = res.message.split(' ') as string []
                        if(split[0] == 'PostgreDB'){
                            const code = parseInt(split[2], 10)
                            if(code == 23503){
                                alert("foreign_key_violation: Item have foreign rows")
                                return
                            }
                        }

                        alert(`api error ` + res.message)
                    }else{
                        alert("wtf error")
                    }
                    return
                }
                setFetchState({ 
                    status: 0,
                    isLoading: false,
                    data: data?.filter(({id}) => row.id != id)
                })
            }).catch((error) => {
                if(error){
                    alert(`default error ` + error)
                }else{
                    alert("uncatched error")
                }
            })
        }
        
        const onClick_Edit = () => 
            push(`/services/edit?svc=${svc.slug}&index=${index}&data=${AnyJSON_toBase64(row)}`)

        const onAccept = async () => { console.log('delete chosed'); await onAccept_Delete() }
        const onReject = () => { bg.close(); console.log('cancel chosed') }
        const onClick_BG = () => { bg.close(); console.log('bg cancel chosed') }

        const Dialog = ({onAccept, onReject}) => (
            <ConfirmDialog className={styles.confirm_dialog} onAccept={onAccept} onReject={onReject} >
                <div><span>Do you realy want elete this object?</span></div>
            </ConfirmDialog>
        )

        const onClick_Delete = () => bg.open(<Dialog {...{onAccept, onReject}}/>, onClick_BG)
        
        return <Buttons>
            { svc.apiEditEntry && <Button className={styles.button_edit} onClick={onClick_Edit}>Edit</Button> }
            { svc.apiDeleteEntry && <Button className={styles.button_delete} onClick={onClick_Delete}>Delete</Button> }
        </Buttons>
    }) : undefined

    if(isLoading){
        return <div className={styles.loading}>Loading</div>
    }

    if(data){
        if(!data.length) return <>No Data {'(length == 0)'}</>

        const svc_item = svcs_item[svc.slug]
        if(!svc_item || !svc) return <>svc?</>

        const headers = {
            ...Object.fromEntries(svc_item.fields.map((field) => {
                return [field.name, field.title ?? field.name]
            })),
            ...defaultDatesHeaderNames
        }

        return <Table className={styles.table} headers={headers} data={data as any[]} columns={Actions ? { Actions } : undefined} />
    }

    return <>No Data {'(undefined)'}</>
}


interface IServiceButtonProps{
    data: IService
    active?: boolean
}

export function ServiceButton(props: IServiceButtonProps){
    const { data: service } = props
    return <Link href={`/services/${service.slug}`}>
        <div className={cl(styles.svc_navlink, [styles.active, props.active])}>
            <span>{service.name}</span>
        </div>
    </Link>
}

export interface IServiceProps{
    data: IService
}

export interface IServiceMenuProps{
    data: IService
}

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
    const hook = useJSONFetch<IContentCategory[], null>('GET', statics.host.api + props.data.apiListEntry, null)
    return <>
        <ServiceMenu data={props.data}/>
        <DefaultArrayFetcher svc={props.data} hook={hook}/>   
    </>
}

function UsersMenu(props: IServiceMenuProps){
    const hook = useJSONFetch<IContentCategory[], any>('POST', statics.host.api + props.data.apiListEntry, { limit: 200, offset: 0 })
    return <>
        <ServiceMenu data={props.data}/>
        <DefaultArrayFetcher svc={props.data} hook={hook}/>   
    </>
}

function MCsMenu(props: IServiceMenuProps){
    const hook = useJSONFetch<IContentCategory[], null>('GET', statics.host.api + props.data.apiListEntry, null)
    return <>
        <ServiceMenu data={props.data}/>
        <DefaultArrayFetcher svc={props.data} hook={hook}/>  
    </>
}


interface IItemFieldInputProps{
    name: string,
    title?: string,
    disabled?: true,
    type: JSType,
    value: string
    onChange?: ChangeEventHandler<HTMLInputElement>
}

function ItemFieldInput(props: IItemFieldInputProps){
    const { name, title = name, type, value, onChange } = props
    const unchangeabl_types: JSType[] = ['function', 'symbol', 'undefined']
    const disabled = props.disabled || unchangeabl_types.indexOf(type) != -1
    return <>
        <div>
            <span className={styles.title}>{title}</span>
            <Input className={styles.input} onChange={onChange} defaultValue={value} name={name} type="text" disabled={disabled} />
            {/* <span>{Type2Text(Text2Type(value, type), type)}</span> */}
        </div>
    </>
}

interface IFieldEditorProps<Type=any>{
    data: Type,
    field: IFieldInput<Type>,
    onChange(field: string, value: Type): Promise<void> | void
}

export function FieldEditor<Type>(props: IFieldEditorProps<Type>){
    const { field, onChange, data } = props
    const { name, type, disabled, select, title } = field

    if(select){
        const { options, default: defaultValue } = select
        return <div>
            <span className={styles.title}>{title ?? name}</span>
            <Select options={options} defaultValue={data[name] ?? defaultValue} onSelect={
                (option) => { onChange(name, option.value) }
            } />
        </div>
    }
    
    return <ItemFieldInput 
        key={name}
        name={name} 
        title={title ?? name}
        type={type}
        disabled={disabled}
        value={ Type2Text(data[name], type) } 
        onChange={(event) => onChange(name, Text2Type(event.currentTarget.value, type))}
    />
}

interface IItemEditMenuProps<Type=any>{
    className?: string,
    data?: Type,
    fields: IFieldInput<Type>[],
    apiEditEntry?: string
    onChange(field: string, value: Type): Promise<void> | void
}

export function ItemEditMenu<Type>(props: IItemEditMenuProps<Type>){
    const { fields, onChange, data = {} as Type, className } = props
    
    
    return <>
        {/* <span>item: { Type2Text(data, 'object') } </span>  */}
        <div className={className}>
            { 
                fields.map((field) => <>
                    {/* <span>type: {field.type} </span>
                    <span>value: { Type2Text(data[field.name], field.type) } </span> */}
                    <FieldEditor data={data} field={field} onChange={onChange} />
                </>) 
            }
        </div>
    </>
}

const services: IService[] = [
    { 
        name: 'Microservices',
        slug: 'ms',
        menu: MCsMenu,
        apiAddEntry: '/api/v1/ms/add',
        apiEditEntry: '/api/v1/ms/edit',
        apiListEntry: '/api/v1/ms/list',
        apiDeleteEntry: '/api/v1/ms/delete',
    },{ 
        name: 'Roles', 
        slug: 'roles',
        menu: RolesMenu,
        apiAddEntry: '/api/v1/policy/roles/add',
        apiEditEntry: '/api/v1/policy/roles/edit',
        apiListEntry: '/api/v1/policy/roles/list',
        apiDeleteEntry: '/api/v1/policy/roles/delete',
    },{ 
        name: 'Permissions',
        slug: 'permissions',
        menu: PermissionsMenu,
        apiAddEntry: '/api/v1/policy/permissions/add',
        apiEditEntry: '/api/v1/policy/permissions/edit',
        apiListEntry: '/api/v1/policy/permissions/list',
        apiDeleteEntry: '/api/v1/policy/permissions/delete',
    },{   
        name: 'Routes',
        slug: 'routes',
        menu: RoutesMenu,
        apiAddEntry: '/api/v1/routes/add',
        apiListEntry: '/api/v1/routes/list',
        apiEditEntry: '/api/v1/routes/edit',
        apiDeleteEntry: '/api/v1/routes/delete',
    },{ 
        name: 'Users',
        slug: 'users',
        menu: UsersMenu,
        apiListEntry: '/api/v1/users/list',
        apiEditEntry: '/api/v1/users/edit',
    },{ 
        name: 'Market MS',
        slug: 'market',
        menu: MarketMenu,
    },{ 
        slug: 'add',
        menu: AddItemMenu,
    },{ 
        slug: 'edit',
        menu: EditItemMenu,
    },{ 
        name: 'Data editor',
        slug: 'dedit',
        menu: DataEditorTest,
        apiListEntry: '/api/v1/users/list',
        apiEditEntry: '/api/v1/users/edit',
    },
]

export const getServiceBySlug = (slug: string) => findByKey(services, 'slug', slug)

export function Page_Services(props: any){
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
    return <>
        <Button 
            className={styles.button_logout} 
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
    </>
}

function Topbar(){
    const { query: { slug } } = useRouter()
    const windows = useWindows()

    const openFilemanager = () => {
        windows.open(<FileManager/>, {
            x: 'center',  y: 'center',
            w: '50vw', h: '50vh',
            title: 'File Manager',
        })
    }
            
    return <SidedDiv className={styles.topbar}>
        <LeftSide className={styles.left}>
            { services.map(s => (s.name && <ServiceButton key={s.slug} data={s} active={s.slug == slug} />)) }
        </LeftSide>
        <RightSide className={styles.right}>
            <Buttons>
                <Button className={styles.button_logout} onClick={openFilemanager}>Open Filemanager</Button>
                <LogoutButton/>
            </Buttons>
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
    const { query } = useRouter()
    const slug = query.slug as string

    function Service(props: { current: string, svc: IService }){
        const { current, svc } = props
        const { slug, menu: Menu } = svc
    
        return <>
            <Slugger slug={slug} current={current}>
                <Menu data={svc} />
            </Slugger>
        </>
    }

    return <div className={styles.main}>
        { services.map((svc) => <Service key={svc.slug} current={slug} svc={svc} />) }
    </div>
}

function Body(){
    return <div className={styles.body}>
        <Leftbar/><Main/>
    </div>
}

