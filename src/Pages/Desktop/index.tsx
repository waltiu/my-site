
import Footer from "./Footer"
import styles from "./index.module.less"
const Desktop = ()=>{

    return <div className={styles.desk}>
        <div className={styles.container}></div>
        <div className={styles.footer}>
            <Footer/>
        </div>

    </div>
}
export default Desktop
