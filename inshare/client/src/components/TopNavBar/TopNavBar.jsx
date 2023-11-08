import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
// import bootstrap styling
import "bootstrap/dist/css/bootstrap.min.css";
// import css
import "./TopNavBar.scss";
import { FaSearch, FaArrowUp, FaStar, FaFire, FaFileAlt, FaComments, FaFlag } from 'react-icons/fa';
import NewPostModal from "../NewPostModel/newpostmodal";
import { useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

//import TopNavBar from "../../components/TopNavBar/";

const TopNavBar = ({ setSortBy, setSelectedCategory, setRandomizePosts, setAddNewPost }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategoryLocal] = useState(''); // Use a different state variable name
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [query, setQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  let token = localStorage.getItem("token"); // Retrieve the authentication token from where you stored it
  const navigate = useNavigate(); // Use useNavigate to programmatically navigate
  const location = useLocation(); // Use useLocation to get the current location

  const handleLogout = () => {
    // Show the logout confirmation modal
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Perform the log-out action here
    localStorage.setItem('token', '');
    localStorage.setItem('userLoggedIn', '');
    token = localStorage.getItem("token");
    if (!token) {
      if (location.pathname !== "/" && location.pathname !== "/Signup") {
        navigate("/");
      }
    }
    // Close the modal after logging out
    setShowLogoutModal(false);
  };

  const closeModal = () => {
    // Close the modal without logging out
    setShowLogoutModal(false);
  };

  // Get the current path from window.location.pathname
  const currentPath = window.location.pathname.toLowerCase();

  // Define the condition for rendering the element
  const homeRenderElement = currentPath === '/home';
  const tagsRenderElement = currentPath === '/tags';
  const exploreRenderElement = currentPath === '/explore';
  const profileRenderElement = currentPath === '/profile';
  const profileRenderElement2 = currentPath === '/profilepastposts';
  const profileRenderElement3 = currentPath === '/profilepastcomments';
  const profileRenderElement4 = currentPath === '/profileflaggedposts';

  useEffect(() => {

    token = localStorage.getItem("token");

    if (!token) {
      // Check if the user is not already on the "/" page
      if (location.pathname !== "/" && location.pathname !== "/Signup") {
        navigate("/");
      }
    }

    // Fetch categories when the component mounts
    axios.get(`/api/categories`)
      .then(response => {
        // Sort response.data based on the category.category property
        const sortedCategories = response.data.sort((a, b) => a.category.localeCompare(b.category));
        setCategories(sortedCategories);
        // setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    // // Retrieve the JSON string from localStorage
    // const storedUserData = localStorage.getItem('userLoggedIn');
    // // Parse the JSON string back to an object
    // const parsedUserData = JSON.parse(storedUserData);

    // if (parsedUserData.isAdmin === true) {
    //   setIsAdmin(true);
    // }

    if (profileRenderElement || profileRenderElement2 || profileRenderElement3 || profileRenderElement4) {
      // Retrieve the JSON string from localStorage
      const storedUserData = localStorage.getItem('userLoggedIn');
      // Parse the JSON string back to an object
      const parsedUserData = JSON.parse(storedUserData);

      if (parsedUserData.isAdmin === true) {
        setIsAdmin(true);
      }
    }

  }, [token]);

  const [activeButton, setActiveButton] = useState('top');

  const changeSelectOption = localStorage.getItem('selectedCategory') === '';

  let searchRenderElement = false;
  // Get the current location
  const llocation = useLocation();
  const ccurrentPath = llocation.pathname;
  // Define a variable to store the search term if the path starts with "/Search"
  let searchTerm = '';
  if (ccurrentPath.startsWith('/Search/')) {
    // Extract the search term from the path
    searchTerm = ccurrentPath.replace('/Search/', '');
    searchTerm = searchTerm.replace(/%20/g, ' ');
    searchRenderElement = true;
  } else {
    searchRenderElement = false;
  }

  let epandedPostRenderElement = false;
  let expandedPostId = '';
  if (ccurrentPath.startsWith('/Expandedpost/')) {
    expandedPostId = ccurrentPath.replace('/Expandedpost/', '');
    // expandedPostId = expandedPostId.replace(/%20/g, ' ');
    epandedPostRenderElement = true;
  } else {
    epandedPostRenderElement = false;
  }

  function handleSearch() {
    navigate(`/Search/${query.toString()}`);
  }

  return (
    <div className="NavbarContainer">


      <div className="navbarInnerTop d-flex align-items-center">

        <div className="navbarInnerTopLeft">

          <div className="input-group mb-0">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control search-input formSearch"
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  handleSearch(query);
                }
              }}
            />
          </div>

        </div>
        <div className="navbarInnerTopRight d-flex">

          {!token &&
            <>
              <Button variant="secondary" className="btnSignUp">
                Sign Up
              </Button>
              <Button variant="secondary" className="btnLogin">
                Login
              </Button>
            </>
          }

          {token &&
            <>
              <Button title="Log Out" variant="secondary" className="btnLogin" onClick={handleLogout}>
                Log out
              </Button>
            </>
          }

        </div>

      </div>

      <div className="navbarInnerBottom d-flex align-items-end">

        <div className="Sidebar"></div>

        <div className="navbarInnerBottomLeft">

          {homeRenderElement && (
            <div className="d-flex">

              <div title="Decending Posts based on Vote Count" className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'top' ? 'activeHeading' : ''}`} onClick={() => { setSortBy('top'); setActiveButton('top'); }}>
                <FaArrowUp className={`headerIcon ${activeButton === 'top' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="#">Top</a>
              </div>

              <div title="Decending Posts based on Post Date" className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'newest' ? 'activeHeading' : ''}`} onClick={() => { setSortBy('newest'); setActiveButton('newest'); }}>
                <FaStar className={`headerIcon ${activeButton === 'newest' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="#">Newest</a>
              </div>

              <div title="Decending Posts based on Comment Count" className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'hottest' ? 'activeHeading' : ''}`} onClick={() => { setSortBy('hottest'); setActiveButton('hottest'); }}>
                <FaFire className={`headerIcon ${activeButton === 'hottest' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="#">Hottest</a>
              </div>

            </div>
          )}

          {tagsRenderElement && (
            <select
              className="tagsSelect m-3"
              value={selectedCategory}
              // onChange={(e) => setSelectedCategory(e.target.value)}
              onChange={(e) => {
                console.log('Selected category:', e.target.value); // Log the selected category
                setSelectedCategoryLocal(e.target.value);
                setSortBy('top');
                setSelectedCategory(e.target.value);
              }}
            >
              {changeSelectOption ? (
                <option value="">Select Category</option>
              ) : (
                <option value={selectedCategory}>{selectedCategory}</option>
              )}
              {/* <option value="">Select Category</option> */}
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
          )}

          {exploreRenderElement && (
            <Button
              variant="secondary"
              className="btnRandom m-3"
              onClick={() => {
                // Call the setRandomizePosts function to trigger randomization
                setRandomizePosts(true);
              }}
            >
              Randomize
            </Button>
          )}

          {searchRenderElement && (
            <h4 className="m-4">You searched for: "<span style={{ color: "#F16236" }}>{searchTerm}</span>"</h4>
          )}

          {profileRenderElement && (
            <div className="d-flex">
              {/* <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'pastPosts' ? 'activeHeading' : ''}`} onClick={() => { setSortBy('pastPosts'); setActiveButton('pastPosts'); }} href="/Home">
                <FaFileAlt className={`headerIcon ${activeButton === 'pastPosts' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="#">Past Posts</a>
              </div> */}

              <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'pastPosts' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('pastPosts'); }}>
                <FaFileAlt className={`headerIcon ${activeButton === 'pastPosts' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="/profilePastPosts">Past Posts</a>
              </div>

              <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'pastComments' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('pastComments'); }}>
                <FaComments className={`headerIcon ${activeButton === 'pastComments' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="/ProfilePastComments">Past Comments</a>
              </div>

              {isAdmin === true && (
                <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'flaggedPosts' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('flaggedPosts'); }}>
                  <FaFlag className={`headerIcon ${activeButton === 'flaggedPosts' ? 'activeIcon' : ''}`} />
                  <a className="navlink" href="/ProfileFlaggedPosts">Flagged Posts</a>
                </div>
              )}

            </div>
          )}

          {profileRenderElement2 && (
            <div className="d-flex">

              <div className={`navbarPostRankHeadings d-flex align-items-center activeHeading ${activeButton === 'pastPosts' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('pastPosts'); }}>
                <FaFileAlt className={`headerIcon activeIcon ${activeButton === 'pastPosts' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="/profilePastPosts">Past Posts</a>
              </div>

              <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'pastComments' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('pastComments'); }}>
                <FaComments className={`headerIcon ${activeButton === 'pastComments' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="/ProfilePastComments">Past Comments</a>
              </div>

              {isAdmin === true && (
                <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'flaggedPosts' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('flaggedPosts'); }}>
                  <FaFlag className={`headerIcon ${activeButton === 'flaggedPosts' ? 'activeIcon' : ''}`} />
                  <a className="navlink" href="/ProfileFlaggedPosts">Flagged Posts</a>
                </div>
              )}

            </div>
          )}

          {profileRenderElement3 && (
            <div className="d-flex">

              <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'pastPosts' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('pastPosts'); }}>
                <FaFileAlt className={`headerIcon ${activeButton === 'pastPosts' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="/profilePastPosts">Past Posts</a>
              </div>

              <div className={`navbarPostRankHeadings d-flex align-items-center activeHeading ${activeButton === 'pastComments' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('pastComments'); }}>
                <FaComments className={`headerIcon activeIcon ${activeButton === 'pastComments' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="/ProfilePastComments">Past Comments</a>
              </div>

              {isAdmin === true && (
                <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'flaggedPosts' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('flaggedPosts'); }}>
                  <FaFlag className={`headerIcon ${activeButton === 'flaggedPosts' ? 'activeIcon' : ''}`} />
                  <a className="navlink" href="/ProfileFlaggedPosts">Flagged Posts</a>
                </div>
              )}

            </div>
          )}

          {profileRenderElement4 && (
            <div className="d-flex">

              <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'pastPosts' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('pastPosts'); }}>
                <FaFileAlt className={`headerIcon ${activeButton === 'pastPosts' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="/profilePastPosts">Past Posts</a>
              </div>

              <div className={`navbarPostRankHeadings d-flex align-items-center ${activeButton === 'pastComments' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('pastComments'); }}>
                <FaComments className={`headerIcon ${activeButton === 'pastComments' ? 'activeIcon' : ''}`} />
                <a className="navlink" href="/ProfilePastComments">Past Comments</a>
              </div>

              {isAdmin === true && (
                <div className={`navbarPostRankHeadings d-flex align-items-center activeHeading ${activeButton === 'flaggedPosts' ? 'activeHeading' : ''}`} onClick={() => { setActiveButton('flaggedPosts'); }}>
                  <FaFlag className={`headerIcon activeIcon ${activeButton === 'flaggedPosts' ? 'activeIcon' : ''}`} />
                  <a className="navlink" href="/ProfileFlaggedPosts">Flagged Posts</a>
                </div>
              )}

            </div>
          )}

          {epandedPostRenderElement && (
            <h2 className="m-3" style={{ color: "#F16236" }}>Post Details Page</h2>
          )}

        </div>

        <div className="navbarInnerBottomRight d-flex">

          <NewPostModal onPostSuccess={setAddNewPost} />

        </div>


      </div>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log Out Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to log out?
        </Modal.Body>
        <Modal.Footer className="cardfooter">
          <Button variant="secondary" onClick={closeModal} className="cancelButton">
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmLogout} className="postButton">
            Log Out
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default TopNavBar;
