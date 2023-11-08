import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import styles from './style.expandedpost.module.scss';
import axios from 'axios';
import TopNavbar from '../../components/TopNavBar/TopNavBar';
import RecentPosts from '../../components/RecentPosts/recentposts';
import LeftNavBar from '../../components/LeftNavBar/LeftNavBar';
import PostLoader from '../../images/Post Loader.png';
import ExpandedPostCard from '../../components/ExpandedPostCard/expandedpostcard';
import Postload from '../../components/PostLoad/postload'
import { useParams } from 'react-router-dom'; // Import useParams

function Expandedpost() {

    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get the post ID from the URL parameter
    const { post: postID } = useParams();

    useEffect(() => {
        // const postID = "652d00e18074e05a48fdb830";

        setLoading(true);

        // Fetch posts data from the server when the component mounts
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/post/${postID}`);
                const fetchedPosts = response.data; // Store the fetched posts in a variable
                setPost(fetchedPosts); // Set the posts
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false); // Set loading to false in case of an error
            }
        };
        fetchPosts();
    }, [postID]);

    return (
        <div className="container-fluid p-0">
            <div className="row m-0">
                <div className="col-md-2 p-0">
                    <LeftNavBar />
                </div>

                <div className="col-md-10 p-0">

                    <TopNavbar /> {/* Pass the sorting callback function */}

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
                                            <ExpandedPostCard key={post._id} post={post} />
                                        </Container>
                                        <div style={{ height: "50px" }}></div>
                                    </>
                                )}

                            </div>

                            <div className="col-md-4">
                                <RecentPosts />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Expandedpost;