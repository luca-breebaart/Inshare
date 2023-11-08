import React, { useState, useEffect } from 'react';
import styles from './style.profileFlaggedPosts.module.scss';
import { FaHome, FaCompass, FaTags, FaUsers, FaSave, FaUser } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import TopNavbar from '../../components/TopNavBar/TopNavBar';
import { Navbar, Container, Button } from 'react-bootstrap';
import RecentPosts from '../../components/RecentPosts/recentposts';
import Card from '../../components/PostCards/cards';
import LeftNavBar from '../../components/LeftNavBar/LeftNavBar';
import ProfileCard from '../../components/ProfileCard/profilecard';
import EditProfileModal from '../../components/ProfileEdit/profileedit';
import Postload from '../../components/PostLoad/postload'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Linkscard from '../../components/LinksCard/linkscard';

function ProfileFlaggedPosts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postAmount, setPostAmount] = useState(0);
    const [flaggedPosts, setFlaggedPosts] = useState([]);

    const location = useLocation();
    const token = location.state && location.state.token;

    useEffect(() => {

        // Retrieve the JSON string from localStorage
        const storedUserData = localStorage.getItem('userLoggedIn');
        // Parse the JSON string back to an object
        const parsedUserData = JSON.parse(storedUserData);

        if (!token) {
            // Handle the case where the token is missing or undefined
            // You can redirect or show an error message
            console.log('token is missing or undefined')
        }

        // Now, you have the token, and you can store it in local storage if needed
        localStorage.setItem('token2', token);

        setLoading(true);

        fetchPosts();
    }, []);


    // Fetch posts data from the server
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`/api/posts`);
            const fetchedPosts = response.data;

            console.log("fetchedPosts:", fetchedPosts);

            // Filter the posts array to only include flagged posts
            const flagged = fetchedPosts.filter(post => post.isFlagged === true);

            console.log("flaggedPosts:", flagged);

            setPosts(fetchedPosts);
            setFlaggedPosts(flagged);
            setPostAmount(flagged.length);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`/api/post/${postId}`);
            // Update the posts state to remove the deleted post
            setPosts(posts.filter(post => post._id !== postId));
            setFlaggedPosts(flaggedPosts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

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

                                {loading ? (
                                    <>
                                        <Container>
                                            <Postload />
                                        </Container>
                                    </>
                                ) : (
                                    <>
                                        <Container>
                                            <h5 className='m-2' style={{ fontWeight: "400" }}>{postAmount} Posts</h5>
                                            {flaggedPosts.map(post => (
                                                <>
                                                    <Card key={post._id} post={post} onDelete={handleDelete} setPosts={setPosts} setFlaggedPosts={setFlaggedPosts} />
                                                </>
                                            ))}
                                        </Container>
                                        <div style={{ height: "50px" }}></div>
                                    </>
                                )}

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

export default ProfileFlaggedPosts;


