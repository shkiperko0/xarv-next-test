import { ReactNode, useMemo, useState } from "react"
import { AuthContext, publicProfile } from "src/contexts/auth"
import { AuthForm } from "src/forms/auth"
import { clearAuthCookies, getCookie, getDocument, parseToken } from "src/tools"
import { ITokenPayload_V1, IUserProfile } from "src/tools/types"

function CheckStartupProfile(): IUserProfile {
    const document = getDocument()
    if(document){
        const token = getCookie('refreshToken')
        if(token){
            const data = parseToken<ITokenPayload_V1>(token)
            const { alias, email, role, user_id } = data
            return { alias, email, role, user_id }
        }
    }
    return publicProfile
}

interface IAuthLayoutProps{
    children?: ReactNode
}

export function AuthLayout(props: IAuthLayoutProps){
    const document = getDocument()
    const startProfile = useMemo(CheckStartupProfile, [document])

    const [ profile, setProfile ] = useState<IUserProfile>(startProfile) 
    const isLogged = profile.user_id != 0

    const clearProfile = () => {
        clearAuthCookies()
        setProfile(publicProfile)
    }

    return <>
        <AuthContext.Provider value={{ isLogged, profile, setProfile, clearProfile }}>
            { props.children }
        </AuthContext.Provider>
    </>
}