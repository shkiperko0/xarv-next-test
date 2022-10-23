import { AppProps } from 'next/app'
import 'src/index.css'

export default (props: AppProps) => {
    const { Component, pageProps} = props
    return <Component {...pageProps} />
}