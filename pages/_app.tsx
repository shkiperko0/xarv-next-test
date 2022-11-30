import { AppProps } from 'next/app'
import 'src/index.css'
import { AuthLayout } from 'src/layouts/auth'
import { PageLayout } from 'src/layouts/page'

export default (props: AppProps<any>) => {
    const { Component, pageProps } = props
    return <>
        <AuthLayout>
            <PageLayout>
                <Component {...pageProps} />
            </PageLayout>
        </AuthLayout>
    </>
}