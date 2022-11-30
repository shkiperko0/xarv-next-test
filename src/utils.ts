namespace utils{
    export async function uploadForm(form: HTMLFormElement){
        try{
          const response = await fetch(form.action, { 
            method: 'POST',
            body: new FormData(form)
          })
          const json = await response.json()
          return json
        }
        catch(error){
          console.error(error) 
        }
        return {}
      }
}

export type callback<Type> = () => Type

export function cl(...cls: (string | null | undefined | [ string, boolean | null | undefined | callback<boolean | null | undefined> ])[]){
    return cls.map(cl => {
      if(!cl) return null
        if(typeof cl == 'object'){
          if(typeof cl[1] == 'function'){
            return cl[1]() ? cl[0] : null
          }
          return cl[1] ? cl[0] : null
        }
        if(typeof cl == 'string'){
          return cl
        }
        return null
    }).join(' ')
}

const _Type2Text = {
  number: (data: number) => `${data}`,
  string: (data: string) => data,
  object: (data: object) => JSON.stringify(data),
}

export function Type2Text(data: any, type: string): string{
  const parser = _Type2Text[type]
  return parser ? parser(data) : ''
}

const _Text2Type = {
  number: (text: string) => parseInt(text),
  string: (text: string) => text,
  object: (text: string) => { try{ return JSON.parse(text) } catch(error) { return undefined } },
}

export function Text2Type(text: string, type: string): any{
  const format = _Text2Type[type]
  return format ? format(text) : undefined
}

export default utils