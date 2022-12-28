import { Providers as MarketProviders } from './market'
import { Providers as ApigateProviders } from './apigate'
import { Providers as AuthProviders } from './auth'
import { Providers as ContentProviders } from './content'

export const Providers = {
    apigate: ApigateProviders,
    auth: AuthProviders,
    content: ContentProviders,
    market: MarketProviders
}