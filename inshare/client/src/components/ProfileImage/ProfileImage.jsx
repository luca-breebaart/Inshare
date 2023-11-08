import React from 'react';
import styles from './style.ProfileImage.module.scss';

const ProfileImage = ({ imageUrl }) => {
    return (
        <div className={styles.profileImage}>
            <img src={imageUrl} alt="Profile" />
        </div>
    );
};

export default ProfileImage;
