import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import styles from './style.home.module.scss';
import axios from 'axios';
import TopNavbar from '../../components/TopNavBar/TopNavBar';
import RecentPosts from '../../components/RecentPosts/recentposts';
import Card from '../../components/PostCards/cards';
import LeftNavBar from '../../components/LeftNavBar/LeftNavBar';
import NewPostModal from '../../components/NewPostModel/newpostmodal';
import Postload from '../../components/PostLoad/postload'
import Linkscard from '../../components/LinksCard/linkscard';
import { useLocation } from 'react-router-dom';


function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [sortBy, setSortBy] = useState('top'); // Default sorting by 'top'

  const [postAmount, setPostAmount] = useState(0);

  const location = useLocation();
  const token = location.state && location.state.token;

  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
    setSortBy('New');
  }

  useEffect(() => {

    if (!token) {
      // Handle the case where the token is missing or undefined
      // You can redirect or show an error message
      console.log('token is missing or undefined')
    }

    // Now, you have the token, and you can store it in local storage if needed
    localStorage.setItem('token2', token);

    setLoading(true);

    // Fetch posts data from the server when the component mounts
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/posts`);
        const fetchedPosts = response.data; // Store the fetched posts in a variable
        setPosts(fetchedPosts); // Set the posts

        let testArray = fetchedPosts;
        setPostAmount(testArray.length);

        // Sort them based on the selected criteria
        const sortedPosts = await sortPosts(fetchedPosts, sortBy); // Sort the fetched posts

        setSortedPosts(sortedPosts);

        setLoading(false); // Set loading to false once data is fetched

      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchPosts();
  }, [sortBy]);

  const sortPosts = async (posts, sortBy) => {
    const sortedPosts = posts.slice(); // Create a copy of the posts array

    if (sortBy === 'newest') {
      sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'hottest') {
      // Fetch comments count for each post and use Promise.all to wait for all requests to complete
      const promises = sortedPosts.map(async (post) => {
        const response = await fetch(`/api/comments/count/${post._id}`);
        const { commentsCount } = await response.json();
        post.commentsCount = commentsCount;
      });

      await Promise.all(promises);

      sortedPosts.sort((a, b) => b.commentsCount - a.commentsCount);
    } else {
      sortedPosts.sort((a, b) => b.upRating - b.downRating - (a.upRating - a.downRating));
    }

    return sortedPosts;
  };

  return (
    <div className="container-fluid p-0">

      <div className="row m-0">
        <div className="col-md-2 p-0">
          <LeftNavBar />
        </div>

        <div className="col-md-10 p-0">

          <TopNavbar setSortBy={setSortBy} setAddNewPost={addNewPost} /> {/* Pass the sorting callback function */}

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
                      {sortedPosts.map(post => (
                        <Card key={post._id} post={post} />
                      ))}
                    </Container>
                    <div style={{ height: "50px" }}></div>
                  </>
                )}

              </div>

              <div className="col-md-4">

                <RecentPosts />
                <Linkscard />


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
