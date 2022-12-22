import { IOptionData, Select } from '@components/gui/Select'
import { IServiceMenuProps } from '@components/services'
import { useState } from 'react'
import { CategoriesMenu } from './categories'
import { CoinsMenu } from './coins'
import { ItemsMenu } from './items'
import { ManufacturersMenu } from './manufacturers'
import { PackagesMenu } from './packages'

const options: IOptionData[] = [
    { id: 0, value: ItemsMenu, title: 'Items' },
    { id: 1, value: CategoriesMenu, title: 'Categories' },
    { id: 2, value: ManufacturersMenu, title: 'Manufacturers' },
    { id: 3, value: CoinsMenu, title: 'Coins' },
    { id: 4, value: PackagesMenu, title: 'Packages' },
] 

type MenuRender = (props: IServiceMenuProps) => JSX.Element

export function Menu(props: IServiceMenuProps){
    const [ Menu, setMenu ] = useState<MenuRender>(() => ItemsMenu)

    return <>
        <Select options={options} onSelect={(option) => setMenu(() => option.value)} />
        <Menu data={props.data} />
    </>
}
