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
type ICSSStyle = string | null | undefined
type ICSSStyleCondition = boolean | null | undefined
type ICSSStyleArg = (ICSSStyle | callback<ICSSStyle> | [ ICSSStyle, ICSSStyleCondition ])

export function cl(...c: ICSSStyleArg[]){
    return c.map(c => {
      if(c){
        if(typeof c == 'string') return c
        if(typeof c == 'object') return c[1] ? (c[0] ?? null) : null
        if(typeof c == 'function') return c() ?? null
      }
      return null
    }).join(' ')
}

export const _str_boolean_true = ['true', 'y', 'yes', '+', 'on', 'enabled']
export const _str_boolean_false = ['false', 'n', 'no', '-', 'off', 'disabled']

export function parseBool(str: string): boolean{
	return _str_boolean_true.indexOf(str.toLowerCase()) != -1  
}

export function formatBool(data: boolean, index = 0): string{
  const _str_boolean = data ? _str_boolean_true : _str_boolean_false
  return _str_boolean.length < index ? _str_boolean[index] : _str_boolean[0]
}

const _Type2Text = {
  boolean: (data: boolean) => data ? 'true' : 'false',
  number: (data: number) => data.toString(10),
  string: (data: string) => data,
  object: (data: object) => JSON.stringify(data),
}

export function Type2Text(data: any, type: string): string{
  if(data === undefined || data === null)
    return ''
    
  const parser = _Type2Text[type]
  return parser ? parser(data) : ''
}

const _Text2Type = {
  boolean: (text: string) => parseBool(text),
  number: (text: string) => parseInt(text, 10),
  string: (text: string) => text,
  object: (text: string) => { try{ return JSON.parse(text) } catch(error) { return undefined } },
}

export function Text2Type(text: string, type: string): any{
  const format = _Text2Type[type]
  return format ? format(text) : undefined
}

export const defaultField_BooleanSelect = { 
  default: true,
  options: [
      { id: 0, title: 'false', value: false },
      { id: 1, title: 'true', value: true }
  ] 
}

export default utils