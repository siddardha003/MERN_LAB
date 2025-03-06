import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [data, setData] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [updatePost, setUpdatePost] = useState({ id: '', title: '', body: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Fetch data (GET) - now triggered by button click
  const fetchPosts = () => {
    setIsLoading(true);
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setData(response.data);
        setShowTable(true);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  // Add data (POST)
  const handleAddPost = () => {
    axios.post('https://jsonplaceholder.typicode.com/posts', newPost)
      .then(response => {
        setData([...data, response.data]);
        setNewPost({ title: '', body: '' });
        toast.success('Post added successfully!');
      })
      .catch(error => toast.error('Error adding post!'));
  };
  
  const handleUpdatePost = () => {
    if (!updatePost.id || !updatePost.title || !updatePost.body) {
      toast.warn("Please fill in all fields.");
      return;
    }
  
    axios.put(`https://jsonplaceholder.typicode.com/posts/${updatePost.id}`, {
      title: updatePost.title,
      body: updatePost.body,
    })
      .then(response => {
        setData(data.map(post => 
          post.id === Number(updatePost.id) ? response.data : post
        ));
        setUpdatePost({ id: '', title: '', body: '' });
        toast.success('Post updated successfully!');
      })
      .catch(error => toast.error('Error updating post!'));
  };
  
  const handleDeletePost = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(() => {
        setData(data.filter(post => post.id !== id));
        toast.success('Post deleted successfully!');
      })
      .catch(error => toast.error('Error deleting post!'));
  };
  

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Banner Section */}
      <div className="banner">
        <img
          src="https://imgs.search.brave.com/CQbryDwdAyF7tzJAkmgUm2GiqjquFjxuCYJeDI9GRJI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG40/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvbG9nb3MtMy82/MDAvUmVhY3QuanNf/bG9nby01MTIucG5n"
          alt="CRUD Operations"
          className="banner-image"
        />
        <h1 className="banner-title">CRUD Operations with JSONPlaceholder API</h1>
      </div>

      {/* Explanation Section */}
      <div className="info-section">
        <h2 className="section-title">What are CRUD Operations?</h2>
        <p className="info-text">
          CRUD stands for Create, Read, Update, and Delete - the four basic operations for persistent storage:
        </p>
        <div className="info-grid">
          <div className="info-card">
            <h3 className="info-card-title">Create</h3>
            <p className="info-card-text">Add new data to the server using the POST method.</p>
          </div>
          <div className="info-card">
            <h3 className="info-card-title">Read</h3>
            <p className="info-card-text">Retrieve data from the server using the GET method.</p>
          </div>
          <div className="info-card">
            <h3 className="info-card-title">Update</h3>
            <p className="info-card-text">Modify existing data on the server using the PUT method.</p>
          </div>
          <div className="info-card">
            <h3 className="info-card-title">Delete</h3>
            <p className="info-card-text">Remove data from the server using the DELETE method.</p>
          </div>
        </div>
        <p className="info-text">
          This application demonstrates all four CRUD operations using the JSONPlaceholder API, a free fake API for testing and prototyping.
        </p>
      </div>

      {/* Get Posts Button */}
      <div className="action-container">
        <button
          className="button button-primary"
          onClick={fetchPosts}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Posts Now'}
        </button>
      </div>

      {/* Display Data */}
      {showTable && (
        <div className="table-container">
          <h2 className="section-title">Posts</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th>ID</th>
                  <th>Title</th>
                  <th>Body</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(post => (
                  <tr key={post.id} className="table-row">
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.body}</td>
                    <td>
                      <button
                        className="button button-delete"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forms Section - Side by Side */}
      <div className="forms-container">
        {/* Add Post */}
        <div className="form-section">
          <h2 className="section-title">Add New Post</h2>
          <div className="form-container">
            <input
              type="text"
              placeholder="Title"
              className="text-input"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              placeholder="Body"
              className="text-area"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <button
              className="button button-add"
              onClick={handleAddPost}
            >
              Add Post
            </button>
          </div>
        </div>

        {/* Update Post */}
        <div className="form-section">
          <h2 className="section-title">Update Post</h2>
          <div className="form-container">
            <input
              type="number"
              placeholder="Post ID"
              className="text-input"
              value={updatePost.id}
              onChange={(e) => setUpdatePost({ ...updatePost, id: Number(e.target.value) })}
            />
            <input
              type="text"
              placeholder="New Title"
              className="text-input"
              value={updatePost.title}
              onChange={(e) => setUpdatePost({ ...updatePost, title: e.target.value })}
            />
            <textarea
              placeholder="New Body"
              className="text-area"
              value={updatePost.body}
              onChange={(e) => setUpdatePost({ ...updatePost, body: e.target.value })}
            />
            <button
              className="button button-update"
              onClick={handleUpdatePost}
            >
              Update Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;