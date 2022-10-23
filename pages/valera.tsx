import Page from "src/components/Page"

export default () => {
    const anime = 'Anime in the word'
    const views = 30, comments = 40

    return <Page name="valera">
        <div className='blackrow'>
            <div>{anime}</div>
            <div>просмотры {views} кометрарии {comments}</div> 
            <img src="https://animevost.org/uploads/posts/2022-09/1663077766_1.jpg" alt="anim" />
        </div>
    </Page>
}