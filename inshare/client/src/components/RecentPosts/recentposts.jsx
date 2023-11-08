import React, { useState, useEffect } from 'react';
import styles from '../../components/RecentPosts/style.recentposts.module.scss';
import { useNavigate } from 'react-router-dom';
import HoverableElement from '../HoverableElement/HoverableElement';
import PostLoad from '../PostLoad/postload';

// Create a function to format the date
const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Create a new functional component for each clickable post
const ClickablePost = ({ post, author }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    // Handle the click action for the post (e.g., navigate to the post's page)
    console.log(`Clicked on post: ${post.heading}`);

    navigate(`/Expandedpost/${post._id}`);

  };

  return (
    <div className={styles.post}>

      <HoverableElement>
        <h3 title="Click to view Posts and Comments" style={{ cursor: "pointer", fontWeight: '600' }} onClick={handleClick}>{post.heading}</h3>
      </HoverableElement>

      <div className={styles.postname}>
        <p>By <span style={{ color: "#F16236" }}>{author}</span></p>
        <p>• {formatDate(post.date)}</p>
      </div>

    </div>
  );
};

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the most recent posts from your API
    fetch(`/api/posts`) // Assuming your API endpoint is /api/posts
      .then((response) => response.json())
      .then((data) => {
        // Sort the posts by date in descending order (newest to oldest)
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Take the first 4 posts
        const mostRecentPosts = data.slice(0, 4);
        setRecentPosts(mostRecentPosts);

        // Fetch authors for each post
        mostRecentPosts.forEach((post) => {
          fetchAuthor(post.userID);
        });

        setLoading(false);

      })
      .catch((error) => {
        console.error('Error fetching recent posts:', error);
        setLoading(false);
      });
  }, []);

  const fetchAuthor = async (userId) => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      const userData = await response.json();
      setAuthors((prevAuthors) => ({
        ...prevAuthors,
        [userId]: `${userData.username}`,
      }));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <>

      <div className={styles.recentpostscard}>
        <h2 style={{ fontWeight: '600' }}>Recent Posts</h2>

        {loading ? (
          // <h1 className="loading-message">Loading...</h1>
          <PostLoad />
        ) : (
          <div className={styles.recentpostscontainer}>
            {recentPosts.map((post) => (
              <ClickablePost key={post._id} post={post} author={authors[post.userID]} />
            ))}
          </div>
        )}

      </div>

    </>
  );
};

export default RecentPosts;
