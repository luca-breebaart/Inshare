import logo from '../../images/LOGO.svg';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './style.reliability.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProfileModal from '../ProfileEdit/profileedit';
import PostLoad from '../PostLoad/postload';
import { Container } from 'react-bootstrap';
import Postload from '../../components/PostLoad/postload'

const ProfileCard = () => {

    const [loading, setLoading] = useState(true);

    const username = "Jhon Doe";
    const name = "Julie Steyn";

    // let reliability = '';
    const [reliability, setReliability] = useState('');

    const [user, setUser] = useState({});

    const fetchData = async () => {
        try {
            // Retrieve the JSON string from localStorage
            const storedUserData = localStorage.getItem('userLoggedIn');

            if (storedUserData) {
                // Parse the JSON string back to an object
                const parsedUserData = JSON.parse(storedUserData);

                // Now, parsedUserData contains the object
                console.log(parsedUserData);

                // Make the GET request only when parsedUserData is available
                const response = await axios.get(`/api/user/${parsedUserData._id}`);
                setUser(response.data);
                console.log(user);

                setReliability(response.data.reliabilityScore.toFixed(2));
                setLoading(false);

            } else {
                console.log('No data found in localStorage.');
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        setLoading(true);


    }, []);

    return (



        <div className={styles.card}>
            {loading ? (
                <>
                    <Container>
                        <Postload />
                    </Container>
                </>
            ) : (

                <>
                    <div className="pic-right">
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className={styles.profile}
                        />
                    </div>
                    <div className={styles.user}>
                        <div className={styles.username}>
                            {user.username}
                        </div>
                        <div >
                            {user.name} {user.surname}
                        </div>
                    </div>
                    <div>
                        <div className={styles.rcard}>
                            Reliability:
                            <span className={styles.relibility}>
                                {/* {user.reliabilityScore.toFixed(2)}% */}
                                {/* {user.reliabilityScore}% */}
                                {reliability}%
                            </span>
                        </div>
                        <div className={styles.line}>
                            <hr />
                        </div>
                    </div>

                    <div className={styles.cardcontent}>
                        {user.about}
                    </div>

                    {/* Profile Edit Modal */}
                    <div>
                        <Container className={styles.modal}>
                            <EditProfileModal />
                        </Container>
                    </div>
                </>
            )}
        </div>
    );
}
export default ProfileCard;

