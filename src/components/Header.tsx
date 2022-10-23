import { createContext, useContext, useState } from "react"

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
        ['/ira', 'Bagirka'],
        ['/valera', 'CoqDe'],
        ['/wtf', 'Page 404'],

        
        ['/file-manager', 'Файлы'],
        ['/gallery-view', 'Галерея'],
    ] 

    return <nav className={styles.navbar}>
        { links.map((link, index) => <NavbarLink key={index} href={link[0]} title={link[1]}/>) }
    </nav>
}

export default function Header(props: any){
    return <>
        <header className={styles.header}>
            <div>
                <LogoPanel/>
                <ProfilePanel/>
            </div>
        </header>
        <TopNavbar/>
    </>
}