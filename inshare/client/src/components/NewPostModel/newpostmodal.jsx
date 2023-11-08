import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import styles from './style.newpostmodal.module.scss';
import ImageUploader from '../imageupload/ImageUploader';
import { usePosts } from '../PostsContext/PostsContext';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt } from 'react-icons/fa';
import TextEditor from '../quill/quillTextEditor';


const NewPostModal = ({ onPostSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [postHeading, setPostHeading] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageURL, setImageURL] = useState('');

  const navigate = useNavigate();


  useEffect(() => {
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
  }, []);

  const { updatePosts } = usePosts();

  const handlePost = () => {
    if (!postHeading || !postContent || !selectedCategory) {
      return;
    }

    // Retrieve the JSON string from localStorage
    const storedUserData = localStorage.getItem('userLoggedIn');
    // Parse the JSON string back to an object
    const parsedUserData = JSON.parse(storedUserData);
    // Now, parsedUserData contains the object
    // console.log(parsedUserData);

    const newPost = {
      heading: postHeading,
      content: postContent,
      category: selectedCategory,
      image: imageURL, // Replace with the actual image URL or handle the upload
      upRating: 0,
      downRating: 0,
      upvotes: [],
      downvotes: [],
      date: new Date(),
      userID: parsedUserData._id, // Replace with the actual user ID or get it dynamically
    };

    axios.post(`/api/post`, newPost)
      .then(response => {
        console.log('Post created successfully:', response.data);

        const newPostData = response.data;

        // Call the onPostSuccess callback to update the posts in the Home component
        // onPostSuccess(newPostData);

        setShowModal(false);
        setCategories([]);
        setPostHeading('');
        setPostContent('');
        setSelectedCategory('');
        setImageURL('');

        navigate(`/Expandedpost/${response.data._id}`);

        // window.location.reload();
      })
      .catch(error => {
        console.error('Error creating post:', error);
      });
    // window.location.reload();
  };

  const handleImageUpload = (url) => {
    setImageURL(url);
  };

  const handleTextEditorChange = (content) => {
    setPostContent(content);
  };

  return (

    <>
      <Button title="Make a Post" variant="secondary" onClick={() => setShowModal(true)} className="btnCreatePost">
        + Create New Post
      </Button>

      <Modal className='modal-lg' show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.PostCard}>
            <input
              className={styles.postheading}
              type="text"
              placeholder="Post Heading"
              value={postHeading}
              onChange={(e) => setPostHeading(e.target.value)}
            />
            <div className={styles.flexContainer1}>

              <div className={styles.textBlock}>

                <TextEditor className={styles.txtEditor} onContentChange={handleTextEditorChange} />

                {/* <textarea
                  placeholder="Enter your post text here"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                /> */}


              </div>
              <div className={styles.imageUpload}>
                <div className={styles.uploadContainer}>
                  <FaCloudUploadAlt className={styles.uploadIcon} />
                  <ImageUploader onImageUpload={handleImageUpload} />
                  <p className={styles.uploadText}>Upload Image</p>
                </div>
              </div>

            </div>

            <div className={styles.flexContainer2}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>

              <div className={styles.cardfooter}>
                <Button variant="secondary" onClick={() => setShowModal(false)} className={styles.cancelButton}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handlePost} className={styles.postButton}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>


  );
};

export default NewPostModal;
