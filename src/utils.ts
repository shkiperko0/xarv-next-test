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

export default utils