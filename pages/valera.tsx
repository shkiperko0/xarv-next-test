import Page from "src/components/Page"
import styles from 'styles/Valera.module.scss'

export default () => {
    const anime = 'Для тебя, Бессмертный (второй сезон) / Fumetsu no Anata e 2nd Season'
    const views = 100 + Math.round(Math.random() * 1000)
    const comments = 20 + Math.round(Math.random() * 100)

    return <Page name="valera">
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.bottombar}>
                    <span>{anime}</span>
                </div>
                <div className={styles.topbar}>
                    <span>Просмотры {views}</span><span>Кометрарии {comments}</span>
                </div> 
                <img className={styles.image} src="/anime.jpg" alt="anime" />
            </div>
        </div>
    </Page>
}

