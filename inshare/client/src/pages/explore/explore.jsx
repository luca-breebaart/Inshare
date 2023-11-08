import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import styles from './style.explore.module.scss';
import axios from 'axios';
import TopNavbar from '../../components/TopNavBar/TopNavBar';
import RecentPosts from '../../components/RecentPosts/recentposts';
import Card from '../../components/PostCards/cards';
import LeftNavBar from '../../components/LeftNavBar/LeftNavBar';
import PostLoader from '../../images/Post Loader.png';
import Postload from '../../components/PostLoad/postload'
import Linkscard from '../../components/LinksCard/linkscard';

function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomizePosts, setRandomizePosts] = useState(true); // Initialize to true to randomize on page load

  useEffect(() => {

    setLoading(true);

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/posts`);
        const fetchedPosts = response.data;

        if (randomizePosts) {
          // Shuffle the fetched posts randomly when randomizePosts is true
          const shuffledPosts = shuffleArray(fetchedPosts);
          setPosts(shuffledPosts);
          setRandomizePosts(false);
          setLoading(false);
        } else {
          // setPosts(fetchedPosts);
          setRandomizePosts(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [randomizePosts]);

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        <div className="col-md-2 p-0">
          <LeftNavBar />
        </div>

        <div className="col-md-10 p-0">

          <TopNavbar setRandomizePosts={setRandomizePosts} /> {/* Pass setRandomizePosts to TopNavbar */}

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
                      {posts.map(post => (
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

export default Explore;
