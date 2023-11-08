import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FaThumbsUp, FaThumbsDown, FaFlag, FaComment } from 'react-icons/fa';
import styles from './style.comments.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Postload from '../../components/PostLoad/postload'
import ProfileImage from '../ProfileImage/ProfileImage';

const Comments = ({ postID }) => {

    const [commentIsFlagged, setCommentIsFlagged] = useState([]);
    const [votedUp, setVotedUp] = useState([]);
    const [votedDown, setVotedDown] = useState([]);
    const [alreadyVotedUp, setAlreadyVotedUp] = useState([]);
    const [alreadyVotedDown, setAlreadyVotedDown] = useState([]);
    const [voteCount, setVoteCount] = useState([]);
    const [comments, setComments] = useState([]); // State variable to store comments
    const [authorCheck, setAuthorCheck] = useState([]);
    const [userImages, setUserImages] = useState([]);
    const [bestAnswerIndex, setBestAnswerIndex] = useState(null);

    const [commentsAmount, setCommentsAmount] = useState(0);

    const [commentsLoading, setCommentsLoading] = useState(true);

    const [userLoggedInID, setUserLoggedInID] = useState('');

    useEffect(() => {
        setCommentsLoading(true);

        // Fetch comments when the component mounts
        fetchComments();
    }, []);

    const fetchComments = () => {
        fetch(`/api/comments/${postID}`)
            .then((response) => response.json())
            .then((data) => {

                // Retrieve the JSON string from localStorage
                const storedUserData = localStorage.getItem('userLoggedIn');
                // Parse the JSON string back to an object
                const parsedUserData = JSON.parse(storedUserData);

                setUserLoggedInID(parsedUserData._id);

                // Initialize commentIsFlagged array based on the comments
                const initialCommentIsFlagged = data.map(comment => comment.isFlagged);
                setCommentIsFlagged(initialCommentIsFlagged);

                // let testArray = filteredPosts;
                setCommentsAmount(data.length);

                for (let i = 0; i < data.length; i++) {
                    if (data[i].upvotes.includes(parsedUserData._id)) {
                        votedUp.push(true);
                        alreadyVotedUp.push(true);
                    } else {
                        votedUp.push(false);
                        alreadyVotedUp.push(false);
                    }
                }

                for (let i = 0; i < data.length; i++) {
                    if (data[i].downvotes.includes(parsedUserData._id)) {
                        votedDown.push(true);
                        alreadyVotedDown.push(true);
                    } else {
                        votedDown.push(false);
                        alreadyVotedDown.push(false);
                    }
                }

                for (let i = 0; i < data.length; i++) {
                    voteCount[i] = data[i].upRating - data[i].downRating;
                }

                // Fetch user data for each comment's userId
                Promise.all(data.map(comment => fetchUserData(comment.userID)))
                    .then(users => {
                        // Combine the comments and user data
                        const commentsWithUsernames = data.map((comment, index) => ({
                            ...comment,
                            username: users[index].username, // Adjust this based on your user schema
                        }));
                        setComments(commentsWithUsernames);
                        setCommentsLoading(false);

                        // Update authorCheck by extracting usernames
                        const usernames = users.map(user => user.username);
                        setAuthorCheck(usernames);

                        setUserImages(users.map(user => user.profileImage));

                    });

                // Find the index of the comment with the highest vote count
                const highestVoteIndex = voteCount.indexOf(Math.max(...voteCount));
                setBestAnswerIndex(highestVoteIndex);
            })
            .catch((error) => {
                console.error('Error fetching comments:', error);
                setCommentsLoading(false);
            });
    };

    const fetchUserData = (userId) => {
        return fetch(`/api/user/${userId}`)
            .then((response) => response.json())
            .then((userData) => {
                return userData;
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                return {}; // Return an empty object in case of an error
            });
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleString('en-US', options);
    };

    const handleThumbsUpClick = async (commentID, index) => {
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
                const response = await axios.post(`/api/comment/upvote/${commentID}`, parsedUserData, config);

                if (response.status === 200) {

                    if (votedUp[index]) {
                        const newArrayVoteCount = [...voteCount];
                        newArrayVoteCount[index] = voteCount[index] - 1;
                        setVoteCount(newArrayVoteCount);

                        const newArrayvotedUp = [...votedUp];
                        newArrayvotedUp[index] = false;
                        setVotedUp(newArrayvotedUp);

                        const newArrayalreadyVotedUp = [...alreadyVotedUp];
                        newArrayalreadyVotedUp[index] = false;
                        setAlreadyVotedUp(newArrayalreadyVotedUp);

                    } else {
                        // Successfully upvoted the comment
                        const newArrayVoteCount = [...voteCount];
                        newArrayVoteCount[index] = voteCount[index] + 1;
                        setVoteCount(newArrayVoteCount);

                        const newArrayvotedUp = [...votedUp];
                        newArrayvotedUp[index] = true;
                        setVotedUp(newArrayvotedUp);

                        const newArrayalreadyVotedUp = [...alreadyVotedUp];
                        newArrayalreadyVotedUp[index] = true;
                        setAlreadyVotedUp(newArrayalreadyVotedUp);

                        if (alreadyVotedDown[index]) {
                            const newArrayVoteCount = [...voteCount];
                            newArrayVoteCount[index] = voteCount[index] + 2;
                            setVoteCount(newArrayVoteCount);

                            const newArrayvotedDown = [...votedDown];
                            newArrayvotedDown[index] = false;
                            setVotedDown(newArrayvotedDown);

                            const newArrayalreadyVotedDown = [...alreadyVotedDown];
                            newArrayalreadyVotedDown[index] = false;
                            setAlreadyVotedDown(newArrayalreadyVotedDown);
                        }
                    }

                } else {
                    // Handle the error, e.g., show an error message
                    console.error('Error upvoting the comment');
                }
            }
        } catch (error) {
            console.error('Error upvoting the comment:', error);
        }
    };

    const handleThumbsDownClick = async (commentID, index) => {
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
                const response = await axios.post(`/api/comment/downvote/${commentID}`, parsedUserData, config);

                if (response.status === 200) {
                    if (votedDown[index]) {
                        const newArrayVoteCount = [...voteCount];
                        newArrayVoteCount[index] = voteCount[index] + 1;
                        setVoteCount(newArrayVoteCount);

                        const newArrayvotedDown = [...votedDown];
                        newArrayvotedDown[index] = false;
                        setVotedDown(newArrayvotedDown);

                        const newArrayalreadyVotedDown = [...alreadyVotedDown];
                        newArrayalreadyVotedDown[index] = false;
                        setAlreadyVotedDown(newArrayalreadyVotedDown);

                    } else {
                        // Successfully downvoted the comment
                        const newArrayVoteCount = [...voteCount];
                        newArrayVoteCount[index] = voteCount[index] - 1;
                        setVoteCount(newArrayVoteCount);

                        const newArrayvotedDown = [...votedDown];
                        newArrayvotedDown[index] = true;
                        setVotedDown(newArrayvotedDown);

                        const newArrayalreadyVotedDown = [...alreadyVotedDown];
                        newArrayalreadyVotedDown[index] = true;
                        setAlreadyVotedDown(newArrayalreadyVotedDown);

                        if (alreadyVotedUp[index]) {
                            const newArrayVoteCount = [...voteCount];
                            newArrayVoteCount[index] = voteCount[index] - 2;
                            setVoteCount(newArrayVoteCount);

                            const newArrayvotedUp = [...votedUp];
                            newArrayvotedUp[index] = false;
                            setVotedUp(newArrayvotedUp);

                            const newArrayalreadyVotedUp = [...alreadyVotedUp];
                            newArrayalreadyVotedUp[index] = false;
                            setAlreadyVotedUp(newArrayalreadyVotedUp);
                        }
                    }

                } else {
                    // Handle the error, e.g., show an error message
                    console.error('Error downvoting the comment');
                }
            }
        } catch (error) {
            console.error('Error downvoting the comment:', error);
        }
    };

    const handleFlagClick = async (commentID, index) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the authentication token

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.put(`/api/comment/flag/${commentID}`, null, config);

            if (response.status === 200) {
                const newCommentIsFlagged = [...commentIsFlagged]; // Create a copy of the array
                newCommentIsFlagged[index] = true; // Set the flag for the specific comment
                setCommentIsFlagged(newCommentIsFlagged);
            } else {
                console.error('Error flagging the comment');
            }
        } catch (error) {
            console.error('Error flagging the comment:', error);
        }
    };

    function renderPostContent(content) {
        return { __html: content };
    }

    return (
        <div>
            {/* {renderComments()} */}

            {commentsLoading ? (
                <>
                    <Container>
                        <Postload />
                    </Container>
                </>
            ) : (
                <>
                    <h4 className='m-2 pb-3' style={{ fontWeight: "600", color: "#F16236" }}>{commentsAmount} Answers</h4>

                    {comments
                        .map((comment, index) => ({ comment, index })) // Create an array of objects containing comment and index
                        .sort((a, b) => voteCount[b.index] - voteCount[a.index]) // Sort based on voteCount
                        .map(({ comment, index }) => (

                            <div key={comment._id} className={styles.comments}>

                                <div className={styles.voteicons}>

                                    {userLoggedInID !== comment.userID && (
                                        <span title="Upvote Comment" onClick={() => handleThumbsUpClick(comment._id, index)}>

                                            {!votedUp[index] && !alreadyVotedUp[index] && (
                                                <FaThumbsUp className={styles.thumbsup} style={{ curso: "pointer" }} />
                                            )}

                                            {votedUp[index] || alreadyVotedUp[index] && (
                                                <FaThumbsUp style={{ color: "#F16236", cursor: "pointer" }} />
                                            )}

                                            {alreadyVotedUp[index] && (
                                                <FaThumbsUp style={{ color: "#F16236", cursor: "pointer" }} />
                                            )}

                                        </span>
                                    )}

                                    {userLoggedInID === comment.userID && (
                                        <span>
                                            <FaThumbsUp className={styles.disabledButton} title="You can't upvote your own comment" />
                                        </span>
                                    )}

                                    {/* <span className={styles.votecount}>{comment.upRating - comment.downRating}</span> */}
                                    <span title="Vote Count" className={styles.voteCountContainer}>{voteCount[index]}</span>

                                    {userLoggedInID !== comment.userID && (
                                        <span title="Downvote Comment" onClick={() => handleThumbsDownClick(comment._id, index)}>

                                            {!votedDown[index] && !alreadyVotedDown[index] && (
                                                <FaThumbsDown className={styles.thumbsdown} style={{ cursor: "pointer" }} />
                                            )}

                                            {votedDown[index] || alreadyVotedDown[index] && (
                                                <FaThumbsDown style={{ color: "#F16236", cursor: "pointer" }} />
                                            )}

                                            {alreadyVotedDown[index] && (
                                                <FaThumbsDown style={{ color: "#F16236", cursor: "pointer" }} />
                                            )}

                                        </span>
                                    )}

                                    {userLoggedInID === comment.userID && (
                                        <span>
                                            <FaThumbsDown className={styles.disabledButton} title="You can't downvote your own comment" />
                                        </span>
                                    )}

                                </div>

                                <div className={styles.commentscontainer}>
                                    <div className={styles.userheading}>


                                        <div className={styles.userinfo}>

                                            {userImages[index] === undefined && (
                                                <ProfileImage imageUrl={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} />
                                            )}

                                            {userImages[index] !== undefined && (
                                                <ProfileImage imageUrl={userImages[index]} />
                                            )}

                                            <span className={styles.author}>
                                                {authorCheck[index] === undefined &&
                                                    (
                                                        <>
                                                            <b className='LatoFont' style={{ color: "red" }}>[deleted]</b> &bull;
                                                        </>
                                                    )
                                                }
                                                {authorCheck[index] !== undefined &&
                                                    (
                                                        <>
                                                            <b style={{ fontWeight: '700' }}>{comment.username}</b> &nbsp; &bull; &nbsp;
                                                            {/* <b><u>{comment.username}</u></b> &bull; */}
                                                        </>
                                                    )
                                                }
                                                {/* <u>{comment.username}</u> • */}

                                            </span>

                                            <span
                                                className={styles.postedTime}
                                                style={{ opacity: 0.5 }}
                                            > {formatDate(comment.date)}
                                                &nbsp; &nbsp;

                                                {/* {index === 1 && (
                                                    <h4 className={styles.bestAnswer}>Best Answer</h4>
                                                )} */}



                                            </span>




                                        </div>

                                        <span title="Flag Comment" className={styles.flagIcon} onClick={() => handleFlagClick(comment._id, index)}>
                                            {commentIsFlagged[index] ? (
                                                <FaFlag className='flagHover' style={{ cursor: "pointer", color: "red" }} />
                                            ) : (
                                                <FaFlag className='flagHover' style={{ cursor: "pointer" }} />
                                            )}
                                        </span>

                                    </div>
                                    <div className={styles.commentstext}>
                                        {index === bestAnswerIndex && (
                                            <h5 className={styles.bestAnswer}>Best Answer</h5>
                                        )}
                                        <p className='LatoFont' style={{ fontWeight: "400" }}>
                                            {/* {comment.content} */}
                                            <div dangerouslySetInnerHTML={renderPostContent(comment.content)} />

                                        </p>
                                    </div>
                                </div>

                            </div>

                        ))}

                </>
            )}

        </div>
    );
};

export default Comments;

