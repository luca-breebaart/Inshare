import React, { useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PostsProvider } from './components/PostsContext/PostsContext';

import { Fragment } from 'react';
import ScrollButton from './pages/ScrollButton/ScrollButton';
import { Content, Heading } from './pages/ScrollButton/Styles';

import Login from './pages/login/login';
import Home from './pages/home/home';
import Tags from './pages/tags/tags';
import Explore from './pages/explore/explore';
import Profile from './pages/profile/profile';
import Expandedpost from './pages/expandedpost/expandedpost';
import SignUp from './pages/signup/signup';
import Search from './pages/search/search';
import ProfilePastPosts from './pages/profilePastPosts/profilePastPosts';
import ProfilePastComments from './pages/profilePastComments/profilePastComments';
import ProfileFlaggedPosts from './pages/profileFlaggedPosts/profileFlaggedPosts';

function App() {

  let token = localStorage.getItem("token"); // Retrieve the authentication token from where you stored it
  const navigate = useNavigate(); // Use useNavigate to programmatically navigate
  const location = useLocation(); // Use useLocation to get the current location

  useEffect(() => {
    token = localStorage.getItem("token");
    if (!token) {
      // Check if the user is not already on the "/" or "/Signup" page
      if (location.pathname !== "/" && location.pathname !== "/Signup") {
        navigate("/");
      }
    }
  }, [])

  return (
    <div className="App" >

      <ScrollButton />

      <PostsProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Signup' element={<SignUp />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/Tags' element={<Tags />} />
          <Route path='/Explore' element={<Explore />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/ProfilePastPosts' element={<ProfilePastPosts />} />
          <Route path='/ProfilePastComments' element={<ProfilePastComments />} />
          <Route path='/ProfileFlaggedPosts' element={<ProfileFlaggedPosts />} />
          <Route path='/Expandedpost/:post' element={<Expandedpost />} />
          <Route path="/Search/:query" element={<Search />} />
          <Route path="/Search/" element={<Search />} />
        </Routes>
      </PostsProvider>

    </div>
  );
}

export default App;
