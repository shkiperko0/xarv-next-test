import { Bar, Left, Right } from "@components/gui/Bars"
import { Button } from "@components/gui/Button"
import { Buttons } from "@components/gui/Buttons"
import { ConfirmDialog } from "@components/gui/Dialog"
import { Pagination } from "@components/gui/Pagination"
import { IOptionData, Select } from "@components/gui/Select"
import { ITableRowProps, Table } from "@components/gui/Table"
import { Models } from "@components/services/models"
import { PackagesProvider } from "@components/services/providers/market/packages"
import { useWindows } from "@components/taskmanager"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { useBackground } from "src/contexts/bg"
import { AnyJSON_toBase64 } from "src/tools"

import { IServiceMenuProps, styles } from "../.."
import { AddModel, select_perpage_options } from "../common"

export function PackagesMenu(props: IServiceMenuProps){
    const [ perpage, setPerpage ] = useState(select_perpage_options[0].value)
    const [ page, setPage ] = useState(0)
    const [ count_rows, setCountRows ] = useState(0)
    const [ data, setData ] = useState([])
    const bg = useBackground()
    const router = useRouter()

    function onPerPageChange(option: IOptionData){
        setPerpage(option.value)
    }

    function onPageChange(page: number){
        setPage(page)
    }

    async function fetchItemsList(){
        const data = await PackagesProvider.list({ offset: page * perpage, limit: perpage, count: true })
        const { count, list } = data
        setData(list)
        setCountRows(count!)
    }

    useEffect(() => { fetchItemsList() }, [page, perpage])

    async function onAccept_Delete() {
        
    }

    function Actions(row: ITableRowProps){

        const onAccept = async () => { console.log('delete chosed'); await onAccept_Delete() }
        const onReject = () => { bg.close(); console.log('cancel chosed') }
        const onClick_BG = () => { bg.close(); console.log('bg cancel chosed') }

        const Dialog = ({onAccept, onReject}) => (
            <ConfirmDialog className={styles.confirm_dialog} onAccept={onAccept} onReject={onReject} >
                <div><span>Do you realy want elete this object?</span></div>
            </ConfirmDialog>
        )

        const onClick_Edit = () => 
            router.push(`/services/edit?svc=${props.data.slug}&index=${row.index}&data=${AnyJSON_toBase64(row.row)}`)

        const onClick_Delete = () => bg.open(<Dialog {...{onAccept, onReject}}/>, onClick_BG)
        
        return <Buttons>
            <Button className={styles.button_edit} onClick={onClick_Edit}>Edit</Button>
            <Button className={styles.button_delete} onClick={onClick_Delete}>Delete</Button>
        </Buttons>
    }

    const { data: service } = props
    const windows = useWindows()
    const model = "pkg"

    const AddItem = () => {
        const window = windows.create()
        const close = () => windows.close(window.id)

        window.options = {
            title: "New package", 
            w: 'auto', h: 'auto',
            x: 'center', y: 'center',
            className: styles.window
        }

        window.content = <AddModel 
            data={{}} 
            model={Models.pkg} 
            provider={PackagesProvider} 
            onClose={close}
        />

        windows.add(window)
    }

    return <>
        {count_rows} {page} {perpage} {data.length}        
        <Bar className={styles.svc_header}>
            <Left className={styles.svc_name}>
                <span>{service.name}</span>
            </Left>
            <Right>
                <Button onClick={AddItem}>Add item +</Button>
            </Right>
        </Bar>
        <div className={styles.controls}>
            <Select options={select_perpage_options} onSelect={onPerPageChange} currentValue={perpage}/>
            <Pagination count={count_rows} perpage={perpage} onChange={onPageChange} currentPage={page} />
        </div>
            <Table className={styles.table} data={data} columns={{Actions}}/>
        <div className={styles.controls}>
            <Select options={select_perpage_options} onSelect={onPerPageChange} currentValue={perpage}/>
            <Pagination count={count_rows} perpage={perpage} onChange={onPageChange} currentPage={page} />
        </div>
    </>
}