import React, { useState } from 'react';
import styles from './style.signup.module.scss';
import image1 from '../../images/LoginImage1.svg';
import image2 from '../../images/LoginImage2.svg';
import logo from '../../images/LOGO.svg';
import { Link } from 'react-router-dom';
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';

function SignUp() {

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');

  const handleShowPassword = () => {
    console.log('handleShowPassword called');
    setShowPassword(!showPassword);
  };

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    console.log('Signing up with:', email, username, password, name, surname, profileImage);

    const userInfo = {
      name: name,
      surname: surname,
      email: email,
      username: username,
      password: password,
      profileImage: profileImage,
      isAdmin: false
    }

    try {
      const url = `/api/registerUser/`;
      const { userInfo: res } = await axios.post(url, userInfo);

      console.log(res.message);

      // window.location = "/";

      // Navigate to "/" only if registration was successful
      if (res.success) {
        navigate("/");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      } else {
        setError(error)
      }
    }

    // navigate("/");

  };

  return (
    <div className={styles.container}>
      <div className="row">
        <div className="col-md-6">
          <div className={styles.imagecontainer}>
            <img className={styles.login_image2} src={image2} alt="" />
            <img className={styles.login_image1} src={image1} alt="" />
          </div>
        </div>
        <div className="col-md-4">
          <div className={styles.formcontainer}>
            <div className="text-center">
              <img className={styles.logo} src={logo} alt="Logo" />
            </div>
            <h3 className={styles.heading}>Sign Up</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  className="form-control" style={{ paddingLeft: '10px' }}
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="surname" className="form-label">
                  Surname
                </label>
                <input
                  type="text"
                  className="form-control" style={{ paddingLeft: '10px' }}
                  id="surname"
                  name="surname"
                  placeholder="Enter your surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  className="form-control" style={{ paddingLeft: '10px' }}
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  className="form-control" style={{ paddingLeft: '10px' }}
                  id="username"
                  placeholder="Enter your username"
                  type="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control" style={{ paddingLeft: '10px' }}
                  id="password"
                  placeholder="Enter your password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPassword"
                  checked={showPassword}
                  onChange={handleShowPassword}
                />
                <label className="form-check-label" htmlFor="showPassword">
                  Show Password
                </label>
              </div>
              {error && <div>{error}</div>}
              <div className="text-center">
                <button style={{ width: '50%' }} className={styles.formbtn} onClick={handleSignUp}>
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              Already have an account? <Link to="/">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
