import { IOptionData, Select } from '@components/gui/Select'
import { DefaultArrayFetcher } from '@components/services'
import { Models } from '@components/services/models'
import { Providers } from '@components/services/providers'
import { useState } from 'react'

const ItemsMenu = () => <DefaultArrayFetcher model={Models.market.items} provider={Providers.market.items}/>
const CategoriesMenu = () => <DefaultArrayFetcher model={Models.market.categories} provider={Providers.market.categories}/>
const ManufacturersMenu = () => <DefaultArrayFetcher model={Models.market.manufacturers} provider={Providers.market.manufacturers}/>
const CoinsMenu = () => <DefaultArrayFetcher model={Models.market.coins} provider={Providers.market.coins}/>
const PackagesMenu = () => <DefaultArrayFetcher model={Models.market.pkgs} provider={Providers.market.pkgs}/>

const options: IOptionData[] = [
    { id: 0, value: ItemsMenu, title: 'Items' },
    { id: 1, value: CategoriesMenu, title: 'Categories' },
    { id: 2, value: ManufacturersMenu, title: 'Manufacturers' },
    { id: 3, value: CoinsMenu, title: 'Coins' },
    { id: 4, value: PackagesMenu, title: 'Packages' },
] 

type MenuRender = () => JSX.Element

export function Menu(){
    const [ Menu, setMenu ] = useState<MenuRender>(() => ItemsMenu)

    return <>
        <Select options={options} onSelect={(option) => setMenu(() => option.value)} />
        <Menu/>
    </>
}
