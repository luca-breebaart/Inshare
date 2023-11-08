import React, { useState, useEffect } from 'react';
import styles from './style.profilePastComments.module.scss';
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
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CommentsProfile from '../../components/CommentsProfile/commentsProfile';
import Linkscard from '../../components/LinksCard/linkscard';

function ProfilePastComments() {
    const [isFlagged, setIsFlagged] = useState(false);
    const [votedUp, setVotedUp] = useState(false);
    const [votedDown, setVotedDown] = useState(false);
    const [alreadyVotedUp, setAlreadyVotedUp] = useState(false);
    const [alreadyVotedDown, setAlreadyVotedDown] = useState(false);

    const [voteCount, setVoteCount] = useState(0);
    const [categoryName, setCategoryName] = useState('');
    const [author, setAuthor] = useState('');
    const [commentsCount, setCommentsCount] = useState(0);
    const [formattedDate, setFormattedDate] = useState('');
    const [formattedDate2, setFormattedDate2] = useState('01-10-2023');
    const [timeAgo, setTimeAgo] = useState('');    // const [hasImage, setHasImage] = useState(false);

    const [commentText, setCommentText] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({});
    const [commentsKey, setCommentsKey] = useState(new Date().getTime());

    const [authorCheck, setAuthorCheck] = useState('');

    const [userID, setUserID] = useState('');

    useEffect(() => {
        // Retrieve the JSON string from localStorage
        const storedUserData = localStorage.getItem('userLoggedIn');
        // Parse the JSON string back to an object
        const parsedUserData = JSON.parse(storedUserData);
        if (parsedUserData) {
            setLoggedInUser(parsedUserData);
            setUserID(parsedUserData._id);
        }
        console.log("userID:", userID);
    }, []); // Only run this effect once when the component mounts

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

                                <div className={styles.recentcontainer}>
                                    <CommentsProfile userID={userID} key={commentsKey} />
                                </div>

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

export default ProfilePastComments;


