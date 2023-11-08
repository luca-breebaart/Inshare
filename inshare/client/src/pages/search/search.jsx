import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import styles from './style.search.module.scss';
import axios from 'axios';
import TopNavbar from '../../components/TopNavBar/TopNavBar';
import RecentPosts from '../../components/RecentPosts/recentposts';
import Card from '../../components/PostCards/cards';
import LeftNavBar from '../../components/LeftNavBar/LeftNavBar';
import NewPostModal from '../../components/NewPostModel/newpostmodal';
import EditProfileModal from '../../components/ProfileEdit/profileedit';
import PostLoader from '../../images/Post Loader.png';
import Postload from '../../components/PostLoad/postload'
import { useLocation, useParams } from 'react-router-dom';

function Search() {

  const { query } = useParams(); // Access the 'query' parameter from the URL

  const queryString = query ? query.toString() : '';

  console.log("query", query);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoResults, setShowNoResults] = useState(false);
  const [resultsAmount, setResultsAmount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    // Fetch posts data from the server when the component mounts
    const fetchPosts = async () => {
      try {
        setShowNoResults(false)
        const response = await axios.get(`/api/posts/search?query=${query}`);
        const fetchedPosts = response.data; // Store the fetched posts in a variable
        setPosts(fetchedPosts); // Set the posts
        console.log(fetchedPosts)
        // setResultsAmount(posts.length);

        let testArray = fetchedPosts;

        if (testArray.length === 0) {
          setShowNoResults(true)
          console.log('length 0');
          setResultsAmount(testArray.length);
        } else {
          setShowNoResults(false)
          console.log('length > 0');
          setResultsAmount(testArray.length);
        }

        if (query === undefined || query === '') {
          setShowNoResults(true);
          console.log('length 0');
          setResultsAmount(0);
        }

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };
    fetchPosts();
  }, [query]);

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
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
                ) : showNoResults ? (
                  <>
                    <h2 className='m-2' style={{ color: "#F16236" }}>No Results Found</h2>
                  </>
                ) : (
                  <>
                    <Container>
                      <h5 className='m-2' style={{ fontWeight: "400" }}>{resultsAmount} Results Found</h5>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
