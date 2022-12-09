import { LeftSide, RightSide, SidedDiv } from "@components/gui/Bars"
import { Button } from "@components/gui/Button"
import { Buttons }from "@components/gui/Buttons"
import { ITableRowProps, Table } from "@components/gui/Table"
import { Select } from "@components/gui/Select"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEventHandler, MouseEventHandler, ReactChild, useState } from "react"
import { publicProfile, useAuth } from "src/contexts/auth"
import statics from "src/statics"
import { AnyJSON_fromBase64, AnyJSON_toBase64, clearAuthCookies, fetchJSON, FetchProvider, findByKey, GetObjectReflect, Header_Auth_JSON, toBase64, useJSONFetch } from "src/tools"
import { IButtonProps, IFieldReflection, JSType } from "src/tools/types"
import { cl, Text2Type, Type2Text } from "src/utils"
import { AddItemMenu } from "./panels/add-panel"
import { EditItemMenu } from "./panels/edit-panel"
import { PermissionsMenu } from "./panels/list-permissions"
import { RolesMenu } from "./panels/list-roles"
import styles from "./styles.module.scss"
import { Input } from "@components/gui/Input"
import { IFieldInput, svcs_item } from "./models"
import { useBackground } from "src/contexts/bg"
import PostsPreviews from "@components/PostPreview"
import { useWindows } from "@components/taskmanager"
import { FileManager } from "@components/filemanager"

export { styles }



interface IService{
    name?: string,
    menu?(props:{ data: IService }): JSX.Element,
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

interface IAscYesNo{
    children: ReactChild,
    onYes: MouseEventHandler,
    onNo?: MouseEventHandler,
}

function AscYesNo(props: IAscYesNo){
    return <div className={styles.asc_yesno}>
        {props.children}
        <Buttons className={styles.buttons}>
            <Button className={styles.yes_button} onClick={props.onYes}>Yes</Button>
            <Button className={styles.no_button} onClick={props.onNo}>No</Button>
        </Buttons>
    </div>
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
        
        const onClick_Edit: MouseEventHandler = () => 
            push(`/services/edit?svc=${svc.slug}&index=${index}&data=${AnyJSON_toBase64(row)}`)

        const onClick_Delete: MouseEventHandler = () => {
            bg.open(<AscYesNo 
                onYes={async () => { console.log('delete chosed'); await onAccept_Delete() }}
                onNo={() => { bg.close(); console.log('cancel chosed') }}
            >
                <div>
                    <span>Do you realy want elete this object?</span>
                </div>
            </AscYesNo>,
            () => { bg.close(); console.log('bg cancel chosed') })
        }
        
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
        if(!svc_item || !svc) return <></>

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
    //apiEditEntry?: string
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
                (_, option) => { onChange(name, option.value) }
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
        slug: 'add',
        menu: AddItemMenu,
    },{ 
        slug: 'edit',
        menu: EditItemMenu,
    },
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
    const bg = useBackground()
    const windows = useWindows()

    const openFilemanager = () => {
        windows.open(<FileManager/>, {
            x: 20,  y: 30,
            w: 600, h: 400,
            title: 'File Manager'
        })
    }
            
    const openBGTest = () => {
        const bgImage = <img src="data:image/jpeg;base64,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" alt="" />
        bg.open(bgImage, () => {
            bg.close()
        })
    }
        
    return <SidedDiv className={styles.topbar}>
        <LeftSide className={styles.left}>
            { services.map(s => (s.name && <ServiceButton key={s.slug} data={s} active={s.slug == slug} />)) }
        </LeftSide>
        <RightSide className={styles.right}>
            <Buttons>
                <Button className={styles.button_logout} onClick={openFilemanager}>Open Filemanager</Button>
                <Button className={styles.button_logout} onClick={openBGTest}>Test Image BG</Button>
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

