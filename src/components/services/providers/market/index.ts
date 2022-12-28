import { CoinsProvider } from "./coins"
import { PackagesProvider } from "./packages"
import { CategoriesProvider } from "./categories"
import { ManufacturersProvider } from "./manufacturers"
import { ItemsProvider } from "./items"

export const Providers = {
    items: ItemsProvider,
    coins: CoinsProvider,
    pkgs: PackagesProvider,
    manufacturers: ManufacturersProvider,
    categories: CategoriesProvider,
}