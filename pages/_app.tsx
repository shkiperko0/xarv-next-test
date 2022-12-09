import { AppProps } from 'next/app'
import 'src/index.css'
import { AuthLayout } from 'src/layouts/auth'
import { BackgroundLayout } from 'src/layouts/bg'
import { PageLayout } from 'src/layouts/page'
import { TaskManagerLayout } from 'src/components/taskmanager'

export default (props: AppProps<any>) => {
    const { Component, pageProps } = props
    return <>
        <BackgroundLayout>
            <AuthLayout>
                <PageLayout>
                    <TaskManagerLayout>
                        <Component {...pageProps} />
                    </TaskManagerLayout>
                </PageLayout>
            </AuthLayout>
        </BackgroundLayout>
    </>
}