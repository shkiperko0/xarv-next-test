import { Bar, Left, LeftSide, Right, RightSide, SidedDiv } from "@components/gui/Bars"
import { Button } from "@components/gui/Button"
import { Buttons }from "@components/gui/Buttons"
import { ITableRowProps, Table } from "@components/gui/Table"
import { IOptionData, Select } from "@components/gui/Select"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEventHandler, useEffect, useState } from "react"
import { publicProfile, useAuth } from "src/contexts/auth"
import { IButtonProps, IFetchProvider, JSType, Params_ID } from "src/tools/types"
import { cl, Text2Type, Type2Text, clearAuthCookies } from "src/tools"
import styles from "./styles.module.scss"
import { Input } from "@components/gui/Input"
import { IFieldInput, IModel, Models } from "./models"
import { ITaskManagerContext, useWindows } from "@components/taskmanager"
import { FileManager } from "@components/filemanager"
import { DataEditorTest } from "./panels/data-editor"
import { Slugger } from "@components/gui/Slugger"
import { ConfirmDialog } from "@components/gui/Dialog"

import { Menu as MarketMenu } from './panels/market'
import { Pagination } from "@components/gui/Pagination"
import { AddModel, EditModel, select_perpage_options } from "./panels/common"
import { Providers } from "./providers"

export { styles }

interface IService{
    name?: string,
    menu(props:{ data: IService }): JSX.Element,
    slug: string,
}

const defaultDatesHeaderNames = {
    name: 'Name',
    description: 'Description',
	created_at: 'Created At',
	updated_at: 'Updated At',
	deleted_at: 'Deleted At'
}

interface IDefaultArrayFetcherProps{
    provider: IFetchProvider,
    model: IModel,
}

interface IListResponse{
    list: any[],
    count: number,
}

interface IListFetchState{
    isLoading: boolean,
    data: IListResponse,
    page: number, 
    perpage: number, 
}

interface IItemEvents{
    onSave?(): void
}

const AddItem = (windows: ITaskManagerContext, model: IModel, provider: IFetchProvider, events: IItemEvents) => {
    const window = windows.create()
    const close = () => windows.close(window.id)
    const { onSave } = events

    window.options = {
        title: "New item", 
        className: styles.window
    }

    window.content = <AddModel 
        data={{}} 
        model={model} 
        provider={provider} 
        onClose={() => close()}
        onSave={() => { onSave && onSave(); close() }}
    />

    windows.add(window)
}

const EditItem = (windows: ITaskManagerContext, model: IModel, provider: IFetchProvider, item: any, events: IItemEvents) => {
    const window = windows.create()
    const close = () => windows.close(window.id)
    const { onSave } = events

    window.options = {
        title: "Edit item", 
        className: styles.window
    }

    window.content = <EditModel 
        data={item} 
        model={model} 
        provider={provider} 
        onClose={close}
        onSave={() => { onSave && onSave(); close() }}
    />

    windows.add(window)
}

export function DefaultArrayFetcher(props: IDefaultArrayFetcherProps){
    const { model, provider } = props

    const [ state, setState ] = useState<IListFetchState>({ 
        isLoading: false,
        data: { 
            list: [], 
            count: 0 
        },
        page: 0,
        perpage: 10,
    })

    const { data: { count, list }, isLoading, page, perpage } = state

    const windows = useWindows()

    const FetchList = async (state: IListFetchState) => {
        setState({ ...state, isLoading: true })

        const promise = provider.list({ page, perpage })
        promise.then(data => {
            const { list, count } = data
            setState({ ...state, isLoading: false, data })
        })
    }

    const onClick_Add = () => AddItem(windows, model, provider, {
        onSave: () => FetchList(state)
    })

    const onClick_Edit = (row: any) => EditItem(windows, model, provider, row, {
        onSave: () => FetchList(state)
    })

    const onClick_Delete = (item: Params_ID) => {

        const window = windows.create()

        const onAccept = async () => { 
            await provider.delete(item.id)
            await FetchList(state)
            windows.close(window.id); 
        }

        const onReject = () => { 
            windows.close(window.id); 
        }

        const Dialog = ({onAccept, onReject}) => (
            <ConfirmDialog className={styles.confirm_dialog} onAccept={onAccept} onReject={onReject} >
                <div><span>Do you realy want elete this object?</span></div>
            </ConfirmDialog>
        )

        window.options = { title: 'Confirm delete' }
        window.content = <Dialog {...{onAccept, onReject}}/>
        windows.add(window)
    }

    useEffect(() => { FetchList(state) }, [page, perpage])

    function onPerPageChange(option: IOptionData){
        const { perpage, ...other } = state
        setState({ perpage: option.value, ...other })
    }

    function onPageChange(nextpage: number){
        const { page, ...other } = state
        setState({ page: nextpage, ...other })
    }

    const Actions = (props: ITableRowProps) => {
        const { row } = props

        return <Buttons>
            { <Button className={styles.button_edit} onClick={() => onClick_Edit(row)}>Edit</Button> }
            { <Button className={styles.button_delete} onClick={() => onClick_Delete(row)}>Delete</Button> }
        </Buttons>
    }

    if(isLoading){
        return <div className={styles.loading}>Loading</div>
    }

    if(list){
        if(!list.length) return <>No Data {'(length == 0)'}</>

        const headers = {
            ...Object.fromEntries(model.fields.map((field) => {
                return [field.name, field.title ?? field.name]
            })),
            ...defaultDatesHeaderNames
        }
     
        return <>
            <Bar className={styles.svc_header}>
                <Left className={styles.svc_name}>
                    <span>{model.name}</span>
                </Left>
                <Right>
                    <Button onClick={() => onClick_Add()}>Add item +</Button>
                </Right>
            </Bar>
            <div className={styles.controls}>
                <Select options={select_perpage_options} onSelect={onPerPageChange} currentValue={perpage}/>
                <Pagination count={count} perpage={perpage} onChange={onPageChange} currentPage={page} />
            </div>
                <Table className={styles.table} data={list} columns={{Actions}} headers={headers} />
            <div className={styles.controls}>
                <Select options={select_perpage_options} onSelect={onPerPageChange} currentValue={perpage}/>
                <Pagination count={count} perpage={perpage} onChange={onPageChange} currentPage={page} />
            </div>
        </>
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

const RoutesMenu = () => <DefaultArrayFetcher model={Models.apigate.routes} provider={Providers.apigate.routes}/>   
const UsersMenu = () => <DefaultArrayFetcher model={Models.auth.users} provider={Providers.auth.users}/> 
const MCsMenu = () => <DefaultArrayFetcher model={Models.apigate.ms} provider={Providers.apigate.ms}/> 
const PermissionsMenu = () => <DefaultArrayFetcher model={Models.auth.permissions} provider={Providers.auth.permissions}/> 
const RolesMenu = () => <DefaultArrayFetcher model={Models.auth.roles} provider={Providers.auth.roles}/> 

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
    },{ 
        name: 'Roles', 
        slug: 'roles',
        menu: RolesMenu,
    },{ 
        name: 'Permissions',
        slug: 'permissions',
        menu: PermissionsMenu,
    },{   
        name: 'Routes',
        slug: 'routes',
        menu: RoutesMenu,
    },{ 
        name: 'Users',
        slug: 'users',
        menu: UsersMenu,
    },{ 
        name: 'Market MS',
        slug: 'market',
        menu: MarketMenu,
    },{ 
        name: 'Data editor',
        slug: 'dedit',
        menu: DataEditorTest,
    },
]

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

/*

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
            */