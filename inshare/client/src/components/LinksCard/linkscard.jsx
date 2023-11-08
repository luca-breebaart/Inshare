import React from 'react';
import styles from '../../components/LinksCard/style.linkscard.module.scss'; // Assuming you have a corresponding SCSS module


const Linkscard = () => {
    return (
        <div className={styles.card}>
            <div className={styles.textcontainer}>
                <div className={styles.leftColumn}>
                    <div className={styles.optionHover}>Help</div>
                    <div className={styles.optionHover}>Company</div>
                    <div className={styles.optionHover}>Topics</div>
                    <div className={styles.optionHover}>Top Topics</div>
                    <div className={styles.optionHover}>Blog</div>
                    <div className={styles.optionHover}>Advertise</div>
                </div>
                <div className={styles.rightColumn}>
                    <div className={styles.optionHover}>About</div>
                    <div className={styles.optionHover}>Careers</div>
                    <div className={styles.optionHover}>Press</div>
                    <div className={styles.optionHover}>Terms</div>
                    <div className={styles.optionHover}>Privacy</div>
                </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.footerText}>Company, Inc. © 2023. All rights reserved.</div>
        </div>
    );
}

export default Linkscard;
