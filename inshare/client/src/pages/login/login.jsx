import React, { useState } from 'react';
import styles from './style.login.module.scss';
import image1 from '../../images/LoginImage1.svg';
import image2 from '../../images/LoginImage2.svg';
import logo from '../../images/LOGO.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import { Modal, Button, Form } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Login Logic Here
    console.log('Logging in with:', email, password);

    const userInfo = {
      email: email,
      password: password
    }

    try {
      const url = `/api/auth/`;
      axios.post(url, userInfo)
        .then((res) => {

          console.log('Response from server:', res);
          console.log('Token from server:', res.data.data);
          localStorage.setItem("token", res.data.data);
          console.log('Token in localStorage:', localStorage.getItem("token"));

          const url2 = `/api/userEmail/` + userInfo.email;
          axios.get(url2)
            .then((res) => {

              // Convert the object to a JSON string
              const jsonUserData = JSON.stringify(res.data);
              // Store the JSON string in localStorage
              localStorage.setItem('userLoggedIn', jsonUserData);

              // Retrieve the JSON string from localStorage
              const storedUserData = localStorage.getItem('userLoggedIn');

              if (storedUserData) {
                // Parse the JSON string back to an object
                const parsedUserData = JSON.parse(storedUserData);

                // Now, parsedData contains the object
                console.log(parsedUserData);
              } else {
                console.log('No data found in localStorage.');
              }

              window.location = "/Home?token=" + res.data.data;

              // window.location = "/Home";

            })
            .catch((err) => {
              console.log(err);
              setError(err);
            });

          navigate("/Home", { state: { token: res.data.data } });

          // navigate("/Home");

        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            setError('No Email or Password Entered');
          } else {
            console.log('Server error:', err);
            setError('Server error occurred');
          }
          // console.log(JSON.stringify(error));
        });

    } catch (error) {
      console.log('Client-side error:', error);
      // if (
      //   error.response &&
      //   error.response.status >= 400 &&
      //   error.response.status <= 500
      // ) {
      //   setError(error.response.data.message);
      // }
    }

    // window.location = '/';
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
            <h3 className={styles.heading}>Login</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  className="form-control" style={{ paddingLeft: '10px' }}
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              {error && <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>}

              <div className="mb-4">
                <a href="#">Forgot your password?</a>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  style={{ width: '50%' }}
                  className={styles.formbtn}
                  onClick={handleLogin}
                >
                  <Link to="" className={styles.linkText}>
                    Login
                  </Link>
                </button>

              </div>
              <div className="mt-4 text-center">
                Don't have an account? <a href="/Signup">Sign up for InShare</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

