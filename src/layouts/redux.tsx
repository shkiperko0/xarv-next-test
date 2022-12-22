
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from 'src/redux/store'

interface ILayoutProps{
    children?: ReactNode
}

export function ReduxLayout(props: ILayoutProps){
    return <>
        <Provider store={store}>
            {props.children}
        </Provider>
    </>
}
