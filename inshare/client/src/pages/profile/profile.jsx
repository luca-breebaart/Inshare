import React, { useState, useEffect } from 'react';
import styles from './style.profile.module.scss';
import { FaHome, FaCompass, FaTags, FaUsers, FaSave, FaUser } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import TopNavbar from '../../components/TopNavBar/TopNavBar';
import { Navbar, Container } from 'react-bootstrap';
import RecentPosts from '../../components/RecentPosts/recentposts';
import Card from '../../components/PostCards/cards';
import LeftNavBar from '../../components/LeftNavBar/LeftNavBar';
import ProfileCard from '../../components/ProfileCard/profilecard';
import EditProfileModal from '../../components/ProfileEdit/profileedit';
import Postload from '../../components/PostLoad/postload'
import Linkscard from '../../components/LinksCard/linkscard';

function Profile() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postAmount, setPostAmount] = useState(0);

    // Retrieve the JSON string from localStorage
    const storedUserData = localStorage.getItem('userLoggedIn');
    // Parse the JSON string back to an object
    const parsedUserData = JSON.parse(storedUserData);

    const loggedInUserID = parsedUserData._id;

    return (

        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 p-0">
                    <LeftNavBar />
                </div>

                <div className="col-md-10 p-0">
                    <TopNavbar />
                    <div className={styles.body}>

                        <div className="row m-0">
                            <div className="col-md-8">

                                <Container className={styles.cardcontainer}>
                                    <ProfileCard />
                                </Container>

                            </div>

                            <div className="col-md-4">
                                <Container>
                                    <RecentPosts />
                                <Linkscard />
                                </Container>


                            </div>
                        </div>

                        {/* Content for the right column */}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


