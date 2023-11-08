import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaFlag, FaComment, FaClock } from 'react-icons/fa';
import styles from './style.expandedpostcard.module.scss';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Comments from '../Comments/comments';
import axios from 'axios';
import HoverableElement from '../HoverableElement/HoverableElement';
import TextEditor from '../quill/quillTextEditor';
import 'react-quill/dist/quill.bubble.css'
import './style.expandedpostcard.module.scss';


const ExpandedPostCard = ({ post }) => {
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

    const [userLoggedInID, setUserLoggedInID] = useState('');

    useEffect(() => {
        if (post) {

            // Retrieve the JSON string from localStorage
            const storedUserData = localStorage.getItem('userLoggedIn');
            // Parse the JSON string back to an object
            const parsedUserData = JSON.parse(storedUserData);
            setLoggedInUser(parsedUserData);

            setUserLoggedInID(parsedUserData._id);

            const finalRating = post.upRating - post.downRating;
            setVoteCount(finalRating);

            setIsFlagged(post.isFlagged);

            if (post.upvotes.includes(parsedUserData._id)) {
                setAlreadyVotedUp(true);
                setVotedUp(true);
            } else {
                setAlreadyVotedUp(false);
                setVotedUp(false);
            }

            if (post.downvotes.includes(parsedUserData._id)) {
                setAlreadyVotedDown(true);
                setVotedDown(true);
            } else {
                setAlreadyVotedDown(false);
                setVotedDown(false);
            }

            // Fetch category information based on the category _id
            fetchCategoryName(post.category);

            // Fetch post author
            fetchAuthor(post.userID);

            // Fetch comments count for the post
            fetchCommentsCount(post._id);

            // Create a Date object from the given string
            const dateObject = new Date(post.date);

            const dateObject2 = new Date(formattedDate2);
            const now2 = new Date();

            // Get day, month, and year
            const day = dateObject.getDate();
            const month = dateObject.getMonth() + 1; // Months are zero-based
            const year = dateObject.getFullYear();

            setFormattedDate2(`${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}-${year}`);

            const timeDifference = now2 - dateObject2;

            // Calculate time ago
            const secondsAgo = Math.floor(timeDifference / 1000);
            const minutesAgo = Math.floor(secondsAgo / 60);
            const hoursAgo = Math.floor(minutesAgo / 60);
            const daysAgo = Math.floor(hoursAgo / 24);

            let timeAgoString = '';
            if (daysAgo > 0) {
                timeAgoString = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
            } else if (hoursAgo > 0) {
                timeAgoString = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
            } else if (minutesAgo > 0) {
                timeAgoString = `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
            } else {
                timeAgoString = `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
            }

            setTimeAgo(timeAgoString);

            // Format the date as dd-mm-yyyy
            setFormattedDate(`${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`) // gives you '25-10-2023'

        }
    }, [post]);

    const fetchCategoryName = async (categoryId) => {
        try {
            const response = await fetch(`/api/category/${categoryId}`);
            const categoryData = await response.json();
            setCategoryName(categoryData.category);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    };

    const fetchAuthor = async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}`);
            const userData = await response.json();
            setAuthor(userData.username);
            setAuthorCheck(userData.username);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchCommentsCount = async (postId) => {
        try {
            const response = await fetch(`/api/comments/count/${postId}`);
            const { commentsCount } = await response.json();
            setCommentsCount(commentsCount);
        } catch (error) {
            console.error('Error fetching comments count:', error);
        }
    };

    const {
        content,
        heading,
        upRating,
        downRating,
        category,
        date,
        image,
        userID,
        // Add other fields as needed
    } = post;

    const handleThumbsUpClick = async () => {
        try {

            // Retrieve the JSON string from localStorage
            const storedUserData = localStorage.getItem('userLoggedIn');

            if (storedUserData) {
                // Parse the JSON string back to an object
                const parsedUserData = JSON.parse(storedUserData);

                // Now, parsedUserData contains the object
                console.log(parsedUserData);

                const token = localStorage.getItem("token"); // Retrieve the authentication token from where you stored it

                console.log("upvoted")

                console.log('token from localStorage', token)

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                };
                console.log('Authorization header:', config.headers.Authorization);

                // Use `config` in your Axios request
                const response = await axios.post(`/api/post/upvote/${post._id}`, parsedUserData, config);

                // // const response = await fetch(`/api/post/upvote/${post._id}`, {
                // const response = await axios.post(`/api/post/upvote/${post._id}`, {
                //   method: 'POST',
                //   headers: {
                //     'Content-Type': 'application/json',
                //     'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                //   },
                // });

                if (response.status === 200) {

                    if (votedUp) {
                        setVoteCount(voteCount - 1);
                        setVotedUp(false);
                        setAlreadyVotedUp(false);
                        // if (votedDown) {
                        //   setVotedDown(false);
                        //   setAlreadyVotedDown(false);
                        // }
                    } else {
                        // Successfully upvoted the post
                        setVoteCount(voteCount + 1);
                        setVotedUp(true);
                        setAlreadyVotedUp(true);
                        if (alreadyVotedDown) {
                            setVoteCount(voteCount + 2);
                            setVotedDown(false);
                            setAlreadyVotedDown(false);
                            // handleThumbsDownClick();
                        }
                    }

                } else {
                    // Handle the error, e.g., show an error message
                    console.error('Error upvoting the post');
                }
            }
        } catch (error) {
            console.error('Error upvoting the post:', error);
        }
    };

    const handleThumbsDownClick = async () => {
        try {

            // Retrieve the JSON string from localStorage
            const storedUserData = localStorage.getItem('userLoggedIn');

            if (storedUserData) {
                // Parse the JSON string back to an object
                const parsedUserData = JSON.parse(storedUserData);

                // Now, parsedUserData contains the object
                console.log(parsedUserData);

                const token = localStorage.getItem("token"); // Retrieve the authentication token from where you stored it

                console.log("downvoted")

                console.log('token from localStorage', token)

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                };
                console.log('Authorization header:', config.headers.Authorization);

                // Use `config` in your Axios request
                const response = await axios.post(`/api/post/downvote/${post._id}`, parsedUserData, config);

                if (response.status === 200) {
                    // Successfully downvoted the post
                    // setVoteCount(voteCount - 1);

                    if (votedDown) {
                        setVoteCount(voteCount + 1);
                        setVotedDown(false);
                        setAlreadyVotedDown(false);
                    } else {
                        // Successfully downvoted the post
                        setVoteCount(voteCount - 1);
                        setVotedDown(true);
                        setAlreadyVotedDown(true);
                        if (alreadyVotedUp) {
                            setVoteCount(voteCount - 2);
                            setVotedUp(false);
                            setAlreadyVotedUp(false);
                            // handleThumbsUpClick();
                        }
                    }

                } else {
                    // Handle the error, e.g., show an error message
                    console.error('Error downvoting the post');
                }
            }
        } catch (error) {
            console.error('Error downvoting the post:', error);
        }
    };

    const navigate = useNavigate();

    const handleCategoryClick = (categoryId) => {
        // Navigate to the Tags page with the selected category ID as a query parameter
        navigate(`/Tags?category=${categoryId}`);

        // Store the selected category ID in local storage
        localStorage.setItem('selectedCategory', categoryId);
    };

    const hasImage = image !== '';

    const handleCommentTextChange = (content) => {
        setCommentText(content);
    };

    const handleEnterKeyPress = (e) => {
        if (e.key === 'Enter') {
            // Call your function here
            // For example, you can call a submit function
            handlePostComment();
        }
    };

    const handlePostComment = async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the authentication token

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };

            const currentDate = new Date();
            const isoDateString = currentDate.toISOString();

            const newComment = {
                postID: post._id, // The ID of the post to which the comment is related
                content: commentText, // Comment text from the state
                userID: loggedInUser._id, // User's ID
                date: isoDateString,
            };

            // Send a POST request to create a new comment
            const response = await axios.post(`/api/comment`, newComment, config);

            if (response.status === 200) {
                // Comment posted successfully.
                console.log('Comment posted successfully');
                // Optionally, you can refresh the comments by fetching them again from the server.
                setCommentsKey(new Date().getTime());
                setCommentText('');
            } else {
                // Handle the error, e.g., show an error message
                console.error('Error posting the comment');
            }
        } catch (error) {
            console.error('Error posting the comment:', error);
        }
    };

    const handleFlagClick = async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the authentication token

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.put(`/api/post/flag/${post._id}`, null, config);

            if (response.status === 200) {
                // Update the post's "isFlagged" field in the local state
                // Note: This won't immediately re-render the component, but you can handle it as needed.
                post.isFlagged = true;
                setIsFlagged(true);
            } else {
                console.error('Error flagging the post');
            }
        } catch (error) {
            console.error('Error flagging the post:', error);
        }
    };

    function renderPostContent() {
        return { __html: content };
    }

    return (

        <>
            <div className={styles.card}>

                <div className={styles.voteicons}>

                    {userLoggedInID !== userID && (
                        <span title="Upvote Post" onClick={handleThumbsUpClick}>

                            {!votedUp && !alreadyVotedUp && (
                                <FaThumbsUp className={styles.thumbsup} style={{ curso: "pointer" }} />
                            )}

                            {votedUp || alreadyVotedUp && (
                                <FaThumbsUp style={{ color: "#F16236", cursor: "pointer" }} />
                            )}

                            {alreadyVotedUp && (
                                <FaThumbsUp style={{ color: "#F16236", cursor: "pointer" }} />
                            )}

                        </span>
                    )}

                    {userLoggedInID === userID && (
                        <span>
                            <FaThumbsUp className={styles.disabledButton} title="You can't upvote your own post" />
                        </span>
                    )}

                    <span title="Vote Count" className={styles.voteCountContainer}>{voteCount}</span>

                    {userLoggedInID !== userID && (
                        <span title="Downvote Post" onClick={handleThumbsDownClick}>

                            {!votedDown && !alreadyVotedDown && (
                                <FaThumbsDown className={styles.thumbsdown} style={{ cursor: "pointer" }} />
                            )}

                            {votedDown || alreadyVotedDown && (
                                <FaThumbsDown style={{ color: "#F16236", cursor: "pointer" }} />
                            )}

                            {alreadyVotedDown && (
                                <FaThumbsDown style={{ color: "#F16236", cursor: "pointer" }} />
                            )}

                        </span>
                    )}

                    {userLoggedInID === userID && (
                        <span>
                            <FaThumbsDown className={styles.disabledButton} title="You can't downvote your own post" />
                        </span>
                    )}

                </div>

                <div className={styles.cardcontent}>

                    <div>
                        <div className={styles.cardheader}>

                            <h2 className={styles.postHeader}>{heading}</h2>

                            <span title="Report Post" className={styles.flagIcon} onClick={handleFlagClick}>

                                {isFlagged &&
                                    <FaFlag className='flagHover' style={{ cursor: "pointer", color: "red" }} />
                                }
                                {!isFlagged &&
                                    <FaFlag className='flagHover' style={{ cursor: "pointer" }} />
                                }

                            </span>

                        </div>

                        <div className={styles.cardfooter}>
                            <div className={styles.userinfo}>

                                {authorCheck === undefined &&
                                    (
                                        <>
                                            <span className={styles.author} style={{ fontWeight: '450' }}>
                                                Posted by u/
                                                <b style={{ color: "red" }}>[deleted]</b>
                                                {/* {'\u0020'} is the Unicode escape sequence for a space */}
                                                {/* {'\u00A0'} Unicode escape for non-breaking space
                                                &nbsp; HTML entity for non-breaking space */}
                                            </span>
                                        </>
                                    )
                                }
                                {authorCheck !== undefined &&
                                    (
                                        <>
                                            <span className={styles.author} style={{ fontWeight: '450' }}>
                                                Posted by u/
                                                <u style={{ color: "#F16236" }}>{author}</u>
                                            </span>
                                        </>
                                    )
                                }

                                <span className={styles.postedTime} style={{ fontWeight: '450' }}><FaClock /> {formattedDate2}</span>
                                {/* <span className={styles.postedTime} style={{ fontWeight: '600' }}> {formattedDate}</span> */}

                            </div>

                            <div className={styles.commentscount} style={{ fontWeight: '500' }}>
                                <span className={styles.commentsIcon}>
                                    <FaComment />
                                </span>
                                {commentsCount} comments
                            </div>

                        </div>


                        {!hasImage && (
                            <div className={styles.cardbody}>
                                {/* <p>{content}</p> */}
                                <div dangerouslySetInnerHTML={renderPostContent()} />
                            </div>
                        )}

                        {hasImage && (
                            <div className={styles.cardbodyWithImage}>
                                <div>
                                    <img src={image} className={styles.postImage}></img>
                                </div>
                                {/* <p>{content}</p> */}
                                <div dangerouslySetInnerHTML={renderPostContent()} />
                            </div>
                        )}

                        <div className={styles.cardcategories}>
                            <span
                                title="Click to view Posts in this Category"
                                className={styles.category}
                                onClick={() => handleCategoryClick(post.category)}
                            >
                                {categoryName}
                            </span>
                        </div>

                        <div className={styles.commentpost}>
                            {/* <input
                                type="text"
                                value={commentText}
                                onChange={handleCommentTextChange}
                                onKeyPress={handleEnterKeyPress}
                                placeholder="Add a comment..."
                                className={styles.commentInputField}
                            />
 */}
                            <TextEditor className={styles.txtEditor} onContentChange={handleCommentTextChange} value={commentText} />

                            <Button title="Add Comment" onClick={handlePostComment} className={styles.postButton}>
                                Comment
                            </Button>

                        </div>


                        <Comments postID={post._id} key={commentsKey} />

                    </div>
                </div>

            </div>
        </>

    );
};

export default ExpandedPostCard;
