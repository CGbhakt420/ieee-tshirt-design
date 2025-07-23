import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import { jwtDecode } from 'jwt-decode';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert('Please log in to view the community feed.');
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setCurrentUser({ id: decoded.id, name: decoded.name });
    } catch (e) {
      console.error("Invalid token:", e);
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get('/api/community/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // Optimistically update the UI without needing a full refetch
    const postWithOwner = {
      ...newPost,
      user: { _id: currentUser.id, name: currentUser.name || 'You' }
    };
    setPosts([postWithOwner, ...posts]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-10 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-800 opacity-20 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-800 opacity-20 blur-3xl rounded-full -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)} // Navigates to the previous page
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-xl">
              Community Feed
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300"
          >
            Create Post
          </button>
        </div>

        {loading && <p className="text-center text-gray-400 text-lg">Loading feed...</p>}
        {error && <p className="text-center text-red-400 text-lg">{error}</p>}

        {!loading && posts.length === 0 ? (
          <div className="text-center text-gray-400 text-lg mt-20">
            <p>No posts in the feed yet.</p>
            <p>Why not create the first one? ✨</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                onPostDeleted={() => setPosts(posts.filter((p) => p._id !== post._id))}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreatePostModal
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default CommunityPage;
