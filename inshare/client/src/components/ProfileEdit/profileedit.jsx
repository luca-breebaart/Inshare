import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import logo from '../../images/LOGO.svg';
import styles from './style.profileedit.module.scss';
import { useNavigate } from 'react-router-dom';

// ... other imports
import ImageUploader from '../../components/imageupload/ImageUploader';

function EditProfileModal() {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');

    const [imageURL, setImageURL] = useState(user.profileImage || ''); // Initialize imageURL with the current profile image URL

    const [showErrorModal, setShowErrorModal] = useState(false); // Add error modal state

    const navigate = useNavigate();

    const handleImageUpload = (url) => {
        setImageURL(url);
    };

    const fetchData = async () => {
        try {
            // Retrieve the JSON string from localStorage
            const storedUserData = localStorage.getItem('userLoggedIn');

            if (storedUserData) {
                // Parse the JSON string back to an object
                const parsedUserData = JSON.parse(storedUserData);

                // Now, parsedUserData contains the object
                console.log(parsedUserData);

                // Make the GET request only when parsedUserData is available
                const response = await axios.get(`/api/user/${parsedUserData._id}`);
                setUser(response.data);
                console.log(user);
            } else {
                console.log('No data found in localStorage.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClose = () => {
        setShow(false);
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            // Create a new object with updated user data
            const updatedUser = { ...user };

            // Include the updated profile image URL if available
            if (imageURL) {
                updatedUser.profileImage = imageURL;
            }

            const response = await axios.put(`/api/user/${user._id}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setIsEditing(false);
                window.location.reload();
            } else {
                console.error('Request failed with status code', response.status);
                console.error('Response data:', response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };



    const handleCancel = () => {
        setIsEditing(false);
        fetchData(); // Reset the form with original data
    };

    const handleShow = () => {
        setShow(true);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e, field) => {
        setUser({ ...user, [field]: e.target.value });
    };

    const handleDeleteProfile = async () => {
        setShowConfirmationModal(false);
        setShowPasswordModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // Retrieve the JSON string from localStorage
            const storedUserData = localStorage.getItem('userLoggedIn');
            // Parse the JSON string back to an object
            const parsedUserData = JSON.parse(storedUserData);
            // Now, parsedUserData contains the object
            console.log(parsedUserData);

            const token = localStorage.getItem("token"); // Retrieve the authentication token from where you stored it
            console.log('token from localStorage', token)

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            console.log('Authorization header:', config.headers.Authorization);

            // const response = await axios.post(`/api/post/upvote/${post._id}`, parsedUserData, config);

            // Verify the entered password
            const response = await axios.post(`/api/auth`, { email: parsedUserData.email, password }, config);
            // const response = await axios.post(`/api/auth`, parsedUserData, config);

            if (response.status === 200) {
                // Password is correct; proceed with profile deletion
                await axios.delete(`/api/user/${parsedUserData._id}`);

                localStorage.setItem("token", "");
                localStorage.setItem("userLoggedIn", "");
                navigate(`/Home`);

                // Handle user deletion success, e.g., logout the user
                // remove token & user from local storage

            } else {
                // Password is incorrect; show error modal
                setShowPasswordModal(false); // Close the password modal
                setShowErrorModal(true); // Show the error modal
                console.error('Incorrect password.');
            }
        } catch (error) {
            setShowErrorModal(true); // Show the error modal
            console.error(error);
        }

        // Reset the password input field
        setPassword('');
        setShowPasswordModal(false);
    };

    const handleHideErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <>

            <Button title="Edit Profile" className={styles.btnEditProfile} onClick={handleShow}>
                Edit Profile
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <div className="text-center">
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className={styles.profile}
                        />
                        {isEditing && (
                            <div className={styles.profileImage}>
                                <ImageUploader onImageUpload={handleImageUpload} />
                            </div>
                        )}
                    </div>

                    <div className={styles.info}>
                        <div className={styles.infoheading}>
                            <h6 className={styles.headingtext}>Name:</h6>
                            {isEditing ? (
                                <div className={styles.infotext}>
                                    <input
                                        type="text"
                                        value={user.name}
                                        onChange={(e) => handleInputChange(e, 'name')}
                                        className="form-control"
                                    />
                                </div>
                            ) : (
                                <div className={styles.infotext}>
                                    <h6>{user.name}</h6>
                                </div>
                            )}
                        </div>

                        <div className={styles.infoheading}>
                            <h6 className={styles.headingtext}>Surname:</h6>
                            {isEditing ? (
                                <div className={styles.infotext}>
                                    <input
                                        type="text"
                                        value={user.surname}
                                        onChange={(e) => handleInputChange(e, 'surname')}
                                        className="form-control"
                                    />
                                </div>
                            ) : (
                                <div className={styles.infotext}>
                                    <h6>{user.surname}</h6>
                                </div>
                            )}
                        </div>

                        <div className={styles.infoheading}>
                            <h6 className={styles.headingtext}>Username:</h6>
                            {isEditing ? (
                                <div className={styles.infotext}>
                                    <input
                                        type="text"
                                        value={user.username}
                                        onChange={(e) => handleInputChange(e, 'username')}
                                        className="form-control"
                                    />
                                </div>
                            ) : (
                                <div className={styles.infotext}>
                                    <h6>{user.username}</h6>
                                </div>
                            )}
                        </div>

                        <div className={styles.infoheading}>
                            <h6 className={styles.headingtext}>Email:</h6>
                            {isEditing ? (
                                <div className={styles.infotext}>
                                    <input
                                        type="text"
                                        value={user.email}
                                        onChange={(e) => handleInputChange(e, 'email')}
                                        className="form-control"
                                    />
                                </div>
                            ) : (
                                <div className={styles.infotext}>
                                    <h6>{user.email}</h6>
                                </div>
                            )}
                        </div>

                        <div className={styles.infoheading}>
                            <h6 className={styles.headingtext}>About:</h6>
                            {isEditing ? (
                                <div className={styles.infotext}>
                                    <textarea
                                        value={user.about}
                                        onChange={(e) => handleInputChange(e, 'about')}
                                        className="form-control"
                                    />
                                </div>
                            ) : (
                                <div className={styles.infotext}>
                                    <h6>{user.about}</h6>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className={styles.buttons}>
                    <div className={styles.buttonRow}>
                        {isEditing ? (
                            <>
                                <Button variant="danger">Reset Password</Button>

                                <Button variant="danger" onClick={() => setShowConfirmationModal(true)}>
                                    Delete Profile
                                </Button>

                                <Button variant="secondary" onClick={handleCancel} className={styles.btnClose}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleSave} className={styles.btnEdit}>
                                    Save
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={handleClose} className={styles.btnClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleEditClick} className={styles.btnEdit}>
                                    Edit
                                </Button>
                            </>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>



            {/* Confirmation Modal */}
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete your profile?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteProfile}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Password Input Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter your password"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete Profile
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Error Modal for Incorrect Password */}
            <Modal show={showErrorModal} onHide={handleHideErrorModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Incorrect password. Please try again.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHideErrorModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default EditProfileModal;
