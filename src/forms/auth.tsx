import { FormEvent, useState } from "react";
import { useAuth } from "src/contexts/auth";
import statics from "src/statics";
import { parseToken, setCookie, useJSONFetch } from "src/tools";
import { ITokenPayload_V1 } from "src/tools/types";

export function AuthForm(){
    const { setProfile } = useAuth()
    const { fetch } = useJSONFetch('POST', statics.host.api + '/api/v1/auth/login')
    const [ message, setMessage ] = useState(<></>)

    async function onSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        event.stopPropagation()

        interface ILoginForm{
            action: string
            email: HTMLInputElement
            password: HTMLInputElement
        }

        const { currentTarget: form } = event
        const { email: { value: email }, password: { value: password }, action } = form as any as ILoginForm
    
        const req = { email, password } 
        const res = await fetch(req)

        if(res.status != 200)
            return setMessage(<>[{res.status}] {JSON.stringify(res.data)}</>)
        
        const { data: tk } = res
        const tkp = {
            accessToken: parseToken<ITokenPayload_V1>(tk.accessToken),
            refreshToken: parseToken<ITokenPayload_V1>(tk.refreshToken),
        }

        const { alias, role, user_id } = tkp.refreshToken
        const today = new Date();
        const priorDate = new Date(new Date().setDate(today.getDate() + 30));

        setCookie('refreshToken', tk.refreshToken, priorDate)
        setProfile({ alias, role, user_id, email})
        return
    }

    return <>
        <span>Login bitch</span>
        <form onSubmit={onSubmit}>
            <p><span>Email</span><input name="email" type="text" /></p>
            <p><span>Password</span><input name="password" type="text" /></p>
            <button type="submit">GO</button>
            { message && <p>{message}</p> }
        </form>
    </>
}





