import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import styles from './style.tags.module.scss';
import axios from 'axios';
import TopNavbar from '../../components/TopNavBar/TopNavBar';
import RecentPosts from '../../components/RecentPosts/recentposts';
import Card from '../../components/PostCards/cards';
import LeftNavBar from '../../components/LeftNavBar/LeftNavBar';
import NewPostModal from '../../components/NewPostModel/newpostmodal';
import EditProfileModal from '../../components/ProfileEdit/profileedit';
import PostLoader from '../../images/Post Loader.png';
import { useLocation } from 'react-router-dom';
import Postload from '../../components/PostLoad/postload'
import Linkscard from '../../components/LinksCard/linkscard';

function Tags() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [postAmount, setPostAmount] = useState(0);

  const [sortedPosts, setSortedPosts] = useState([]);
  const [sortBy, setSortBy] = useState('top'); // Default sorting by 'top'

  const [categories, setCategories] = useState([]); // Store the categories fetched from the server

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectedCategoryId = searchParams.get('category');

    // Check if there's a selected category in local storage and use it if available otherwise 
    //Update the selectedCategory state with the category ID from the URL
    const localStorageCategory = localStorage.getItem('selectedCategory');
    setSelectedCategory(localStorageCategory || selectedCategoryId || '');
    localStorage.setItem('selectedCategory', '');
  }, [location.search]);

  useEffect(() => {

    setLoading(true);

    console.log("useEffect is running with selectedCategory:", selectedCategory);

    // Fetch categories when the component mounts
    axios.get(`/api/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    // Fetch posts data from the server when the component mounts
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/posts`);
        const fetchedPosts = response.data; // Store the fetched posts in a variable
        setPosts(fetchedPosts); // Set the posts

        // Sort them based on the selected criteria
        const sortedPosts = sortPosts(fetchedPosts, sortBy); // Sort the fetched posts

        console.log("Selected Category:", selectedCategory);
        console.log("Posts Before Filtering:", sortedPosts);

        // Filter posts by category name
        const filteredPosts = sortedPosts.filter(post => post.category === selectedCategory);

        console.log("Filtered Posts:", filteredPosts);

        setFilteredPosts(filteredPosts);

        let testArray = filteredPosts;
        setPostAmount(testArray.length);

        setLoading(false); // Set loading to false once data is fetched

      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchPosts();
  }, [sortBy, selectedCategory]);

  const sortPosts = (posts, sortBy) => {
    switch (sortBy) {
      case 'newest':
        return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'hottest':
        return posts.slice().sort((a, b) => b.upRating - b.downRating - (a.upRating - a.downRating));
      case 'top':
      default:
        return posts.slice().sort((a, b) => b.upRating - b.downRating - (a.upRating - a.downRating));
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        <div className="col-md-2 p-0">
          <LeftNavBar />
        </div>

        <div className="col-md-10 p-0">

          <TopNavbar setSortBy={setSortBy} setSelectedCategory={setSelectedCategory} categories={categories} />

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

                      {selectedCategory === '' ? (
                        <>
                        </>
                      ) : filteredPosts.length === 0 ? (
                        <>
                        </>
                      ) : (
                        <h5 className='m-2' style={{ fontWeight: "400" }}>{postAmount} Results Found</h5>
                      )}

                      {selectedCategory === '' ? (
                        <h3 className={styles.NothingSelectedText}>^ No Category Selected</h3>
                      ) : filteredPosts.length === 0 ? (
                        <h3 className={styles.NoPostsMatching}>^ No Posts Matching Selected Category</h3>
                      ) : (
                        filteredPosts.map(post => (
                          <Card key={post._id} post={post} />
                        ))
                      )}

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

export default Tags;
