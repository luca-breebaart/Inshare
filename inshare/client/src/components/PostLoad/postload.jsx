import styles from './style.postload.module.scss';

function PostLoad() {
    return (
        <div className={styles.card}>
            <div >
                <div className={styles.cardheader}>
                    <div className={styles.placeholderText}></div>
                    <span className={styles.flagIcon}></span>
                </div>

                <div>
                    <div className={styles.placeholderText}></div>
                </div>

                <div>
                    <div className={styles.placeholderImage}></div>
                    <div className={styles.placeholderText}></div>
                </div>

                <div>
                    <span className={styles.placeholderCategory}></span>
                </div>

                <div>
                    <div>
                        <div className={styles.placeholderAuthor}></div>
                        <div className={styles.placeholderDate}></div>
                    </div>
                    <div>
                        <div className={styles.placeholderComments}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostLoad;

