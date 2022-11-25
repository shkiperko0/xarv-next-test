

export function getCookie(name: string): string {
    const { cookie } = document
    const rows = cookie.split('; ')
    const row = rows.find((row) => row.startsWith(`${name}=`))
    if(row){
        const [_, value] = row?.split('='); 
        return value
    }
    return ""
}

export function parseToken<Type=any>(token: string): Type {
    const [ header, body, signature ] = token.split('.');
    const json = Buffer.from(body, 'base64').toString('utf-8')
    return JSON.parse(json)
}

export function setCookie(name: string, value: string, date: Date){
    const expires = date.toUTCString()
    // Thu, 18 Dec 2013 12:00:00 UTC
    console.log({expires})
    document.cookie = `${name}=${value}; expires=${expires}; SameSite=Strict`
}

export const getRefreshToken = () => getCookie('refreshToken')
export const getAccessToken = () => getCookie('accessToken')

export const Header_Auth = () => ({
    Authorization: `Bearer ${getRefreshToken()}`
})

export const Header_Auth_JSON = () => ({
    Authorization: `Bearer ${getRefreshToken()}`,
    'Content-Type': 'application/json'
})

export function getDocument(){
    return (typeof document == 'undefined') ? null : document
}

export function getWindow(){
    return (typeof window == 'undefined') ? null : window
}