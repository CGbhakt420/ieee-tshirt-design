import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SavedDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesigns = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view saved designs.');
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('/api/designs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDesigns(response.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to fetch designs.');
      }
    };
    fetchDesigns();
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-10 px-4 text-white overflow-hidden">
      {/* Decorative blurry blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-800 opacity-20 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-800 opacity-20 blur-3xl rounded-full -z-10"></div>

      {/* Go Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-6 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-xl shadow-md backdrop-blur transition duration-300"
      >
        ← Go Back
      </button>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-white drop-shadow-xl">
        Your Saved Designs
      </h1>

      {designs.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No saved designs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {designs.map((design) => (
            <div
              key={design._id}
              onClick={()=>navigate(`/customizer/${design._id}`)}// navigate to the saved design
              className="cursor-pointer bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={design.designUrl}
                alt="Saved Design"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-sm text-gray-300">
                <p>Saved on: {new Date(design.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedDesigns;
