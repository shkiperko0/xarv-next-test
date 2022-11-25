import { AppProps } from 'next/app'
import 'src/index.css'
import { AuthLayout } from 'src/layouts/auth'

export default (props: AppProps) => {
    const { Component, pageProps } = props
    return <>
        <AuthLayout>
            <Component {...pageProps} />
        </AuthLayout>
    </>
}