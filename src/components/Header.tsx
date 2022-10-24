import { createContext, ReactChildren, useContext, useState } from "react"

import styles from './Header.module.scss'

function useAuth(){
    const [ user, setUser ] = useState<object | null>(null)

}

export const AuthContext = createContext<object>({})

function LogoPanel(props: any){
    return <div className="logo-panel">

    </div>
}

function ProfilePanel(props: any){
    const authContext = useContext(AuthContext)

    return <div className="profile-panel">
        <div className="avatare"></div>
    </div>
}

function NavbarLink({ title, href }: { href: string, title: string }){
    return <>
        <a className={styles.navlink} href={href}>{title}</a>
    </>
}

function TopNavbar(props: any){

    const links: [string, string][] = [
        ['/', 'Главная'],
        //['/minecraft', 'Minecraft: Concept'],
        //['/admin', 'Admin page'],
        //['/ira', 'Author: Ira'],
        //['/valera', 'Author: Valera'],
        //['/ira', 'Bagirka'],
        //['/valera', 'CoqDe'],
        //['/wtf', 'Page 404'],

        
        ['/file-manager', 'Файлы'],
        ['/gallery-view', 'Галерея'],
        ['/wiw-manager', 'Wiw менеджер'],
        ['/meta-editor', 'Meta редактор'],
        ['/template-manager', 'TemMan test'],
    ] 

    return <nav className={styles.navbar}>
        { links.map((link, index) => <NavbarLink key={index} href={link[0]} title={link[1]}/>) }
    </nav>
}

interface IHeaderProps{
    left?: ReactChildren
    center?: ReactChildren
    right?: ReactChildren
}


const g_right = <>
    <button className={styles.login}>Вход</button>
    <button className={styles.register}>Регистрация</button>
    <button className={styles.theme}>
    </button>
</>

const dropdown = <>
    <ul className={styles.dropdown}>
        {
            ['1', '2', '3', '4'].map(text => <li><a href="#">{text}</a></li>)
        }
    </ul>
</>

const g_center = <>
    <div className={styles.catalog + ' ' + styles.withdrop}>
        <div className={styles['icon-burger']}></div>
        <span>Каталог</span>
        <div className={styles.dropdown_wrapper}>{dropdown}</div>
    </div>
    <div className={styles.search}>
        <div className={styles['icon-search']}></div>
        <span>Поиск</span>
    </div>
    <div className={styles.forum}>
        <div className={styles['icon-talks']}></div>
        <span>Форум</span>
    </div>
    <div className={styles.faq}>
        <div className={styles['icon-qa']}></div>
        <span>FAQ</span>
    </div>
    <div className={styles.menu}></div>
</>

const g_left = <>
    <div className={styles.logo}></div>
</>

export default function Header(props: IHeaderProps){
    const { 
        center = g_center, 
        left = g_left, 
        right = g_right 
    } = props
    return <>
        <div className={styles.header_bump}/>
        <header className={styles.header}>
            <div className={styles.left}>{left}</div>
            <div className={styles.center}>{center}</div>
            <div className={styles.right}>{right}</div>
        </header>
        <TopNavbar/>
    </>
}