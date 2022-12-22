import { DetailedHTMLProps, HtmlHTMLAttributes, ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"

import styles from './Page.module.scss'

type TPageTag = HTMLDivElement

interface IPageProps{ 
    name?: string,
    children?: ReactNode,
    pageProps?: DetailedHTMLProps<HtmlHTMLAttributes<TPageTag>, TPageTag>
}

export default function Page(props: IPageProps){
    const { children, name, pageProps } = props
    return <>
      <Header/>
        <main 
          className={[styles.page, name ?? null].join(' ')}
          {...pageProps}
        >
          {children}
        </main>
      <Footer/>
    </>
}