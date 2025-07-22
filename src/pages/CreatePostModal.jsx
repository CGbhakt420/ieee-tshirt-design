import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle } from 'react-icons/fi';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [selectedDesignUrl, setSelectedDesignUrl] = useState('');

  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoadingDesigns(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/designs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedDesigns(response.data);
      } catch (err) {
        setError('Failed to load your saved designs.');
        console.error(err);
      } finally {
        setLoadingDesigns(false);
      }
    };
    fetchDesigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDesignUrl) {
      setError('You must select a design to post.');
      return;
    }
    if (!title) {
      setError('A title is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const postData = {
        title,
        description,
        designUrl: selectedDesignUrl,
      };
      const response = await axios.post('/api/community/posts', postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onPostCreated(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl m-4 relative shadow-2xl flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create New Post</h2>

        
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-200 mb-3">1. Select a Design</label>
          {loadingDesigns ? (
            <p className="text-gray-400">Loading your designs...</p>
          ) : savedDesigns.length === 0 ? (
            <p className="text-gray-400 bg-gray-700/50 p-4 rounded-lg">You have no saved designs to post.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-2 bg-gray-900/50 rounded-lg">
              {savedDesigns.map(design => (
                <div key={design._id} className="relative cursor-pointer group" onClick={() => setSelectedDesignUrl(design.designUrl)}>
                  <img
                    src={design.designUrl}
                    alt="Saved Design"
                    className={`w-full h-32 object-cover rounded-md border-4 transition-all ${selectedDesignUrl === design.designUrl ? 'border-purple-500' : 'border-transparent group-hover:border-gray-600'}`}
                  />
                  {selectedDesignUrl === design.designUrl && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <FiCheckCircle className="text-purple-400 text-4xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-lg font-medium text-gray-200">2. Add Details</label>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description (Optional)</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          </div>

          {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}

          <button type="submit" disabled={isSubmitting || !selectedDesignUrl} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300">
            {isSubmitting ? 'Posting...' : 'Post to Community'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;