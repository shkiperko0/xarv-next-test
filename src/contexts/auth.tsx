import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { IUserProfile } from "src/tools/types"

interface IAuthContext{
    isLogged: boolean,
    profile: IUserProfile,
    setProfile: Dispatch<SetStateAction<IUserProfile>>
}

export const publicProfile: IUserProfile = {
    user_id: 0, 
    alias: '', 
    email: '', 
    role: 'public'
}

export const AuthContext = createContext<IAuthContext>({ isLogged: false, profile: publicProfile } as IAuthContext)
export const useAuth = () => useContext(AuthContext)