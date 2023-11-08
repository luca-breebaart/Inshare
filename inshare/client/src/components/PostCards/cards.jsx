import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaFlag, FaComment } from 'react-icons/fa';
import styles from './style.cards.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import HoverableElement from '../HoverableElement/HoverableElement';
import DeletePostModal from '../DeletePostModal/DeletePostModal';

const Card = ({ post, onDelete, setPosts, setFlaggedPosts }) => {
  const [isFlagged, setIsFlagged] = useState(false);
  const [votedUp, setVotedUp] = useState(false);
  const [votedDown, setVotedDown] = useState(false);
  const [alreadyVotedUp, setAlreadyVotedUp] = useState(false);
  const [alreadyVotedDown, setAlreadyVotedDown] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [author, setAuthor] = useState('');
  const [authorCheck, setAuthorCheck] = useState('');
  const [commentsCount, setCommentsCount] = useState(0);
  const [formattedDate, setFormattedDate] = useState('');
  // const [hasImage, setHasImage] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [userLoggedInID, setUserLoggedInID] = useState('');

  // Update the voteCount state to reflect the initial vote count
  // const [voteCount, setVoteCount] = useState(post.upRating - post.downRating);
  const [voteCount, setVoteCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (post) {

      const finalRating = post.upRating - post.downRating;
      setVoteCount(finalRating);

      setIsFlagged(post.isFlagged);

      // Fetch category information based on the category _id
      fetchCategoryName(post.category);

      // Fetch post author
      fetchAuthor(post.userID);

      // Fetch comments count for the post
      fetchCommentsCount(post._id);

      // Create a Date object from the given string
      const dateObject = new Date(post.date);

      // Define arrays for day and month names
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Get day, month, and year
      const day = dateObject.getDate();
      const month = dateObject.getMonth();
      const year = dateObject.getFullYear();

      // Format the date as "Wed, Oct 25, 2023"
      const dayOfWeek = days[dateObject.getDay()];
      const monthName = months[month];

      setFormattedDate(`${dayOfWeek}, ${monthName} ${day}, ${year}`);

      // Retrieve the JSON string from localStorage
      const storedUserData = localStorage.getItem('userLoggedIn');
      // Parse the JSON string back to an object
      const parsedUserData = JSON.parse(storedUserData);

      if (parsedUserData.isAdmin === true) {
        setIsAdmin(true);
      }

      setUserLoggedInID(parsedUserData._id);

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

  const handleCategoryClick = (categoryId) => {
    // Navigate to the Tags page with the selected category ID as a query parameter
    navigate(`/Tags?category=${categoryId}`);

    // Store the selected category ID in local storage
    localStorage.setItem('selectedCategory', categoryId);
  };

  const hasImage = image !== '';

  const handleHeadingClick = () => {
    navigate(`/Expandedpost/${post._id}`);
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

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/post/${post._id}`);
      // Update the posts state to remove the deleted post
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
      setFlaggedPosts((prevFlaggedPosts) => prevFlaggedPosts.filter((p) => p._id !== post._id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setPostToDelete(null);
    setShowDeleteModal(false);
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
          <div className={styles.cardheader}>

            <HoverableElement>
              <h2
                onClick={handleHeadingClick}
                className={styles.headingHover}
                style={{ cursor: 'pointer' }}
                title="Click to View Post and Comments"
              >
                {heading}
              </h2>
            </HoverableElement>

            <div className={styles.deleteFlag}>

              <span title="Report Post" className={styles.flagIcon} onClick={handleFlagClick}>
                {isFlagged &&
                  <FaFlag className='flagHover' style={{ cursor: "pointer", color: "red" }} />
                }
                {!isFlagged &&
                  <FaFlag className='flagHover' style={{ cursor: "pointer" }} />
                }
              </span>

              {isAdmin === true && (
                <Button className={styles.dltbtn} title="Delete Post" variant="danger" onClick={() => openDeleteModal(post)}>
                  Delete
                </Button>
              )}

            </div>

          </div>

          {!hasImage && (
            <div>
              {/* <p className={styles.cardbody}>{content}</p> */}
              <div dangerouslySetInnerHTML={renderPostContent()} />
            </div>
          )}

          {hasImage && (
            <div className={styles.cardbodyWithImage}>
              <div>
                <img src={image} className={styles.postImage}></img>
              </div>
              {/* <p className={styles.cardbody}>{content}</p> */}
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

          <div className={styles.cardfooter}>
            <div className={styles.userinfo}>
              {/* Posted by &nbsp; */}
              <span className={styles.author} style={{ color: "#F16236" }}>
                {authorCheck === undefined &&
                  (
                    <b style={{ color: "red" }}>[deleted]</b>
                  )
                }
                {authorCheck !== undefined &&
                  (
                    <b><u>{author}</u></b>
                  )
                }
              </span>
              <span className={styles.postedTime}>•&nbsp; Posted on {formattedDate}</span>
            </div>

            <HoverableElement>
              <div title="Click to view Comments" className={styles.commentscount} onClick={handleHeadingClick} style={{ cursor: 'pointer' }}>
                <span className={styles.commentsIcon}>
                  <FaComment />
                </span>
                <span>
                  {commentsCount} comments
                </span>
              </div>
            </HoverableElement>

          </div>
        </div>

        <DeletePostModal
          post={postToDelete}
          onDelete={handleDelete}
          onClose={closeDeleteModal}
        />

      </div>

    </>

  );
};

export default Card;
