import React, { useState } from 'react';
import axios from 'axios';
import { FiHeart, FiMessageCircle, FiTrash2, FiSend, FiChevronLeft, FiChevronRight, FiCornerUpRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// A recursive component to render comments and their replies
const Comment = ({ comment, postId, currentUser, onCommentAdded, depth }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');

  const getToken = () => localStorage.getItem('token');

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment and all its replies?")) return;
    try {
      // FIX: Added 'Bearer ' prefix
      await axios.delete(`/api/community/posts/${postId}/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      onCommentAdded(); // Re-fetch comments after deletion
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment.");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      // FIX: Added 'Bearer ' prefix
      await axios.post(`/api/community/posts/${postId}/comments`, 
        { text: replyText, parentComment: comment._id }, 
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setReplyText('');
      setShowReplyForm(false);
      onCommentAdded(); // Re-fetch all comments to show the new reply
    } catch (error) {
      console.error("Failed to add reply:", error);
      alert('Failed to add reply.');
    }
  };

  return (
    <div className="flex flex-col mt-3">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="bg-gray-700/50 rounded-lg p-2">
            <span className="font-bold mr-2 text-sm">{comment.user.name}</span>
            <p className="text-sm">{comment.text}</p>
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-4 pl-2">
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            
            {depth === 0 && (
              <button onClick={() => setShowReplyForm(!showReplyForm)} className="hover:text-white font-semibold">Reply</button>
            )}
            {currentUser.id === comment.user._id && (
              <button onClick={handleDelete} className="hover:text-red-500 font-semibold">Delete</button>
            )}
          </div>
        </div>
      </div>
      
      
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="flex gap-2 ml-11 mt-2">
          <input 
            type="text" 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Replying to ${comment.user.name}...`}
            className="flex-grow bg-gray-900/50 border border-gray-600 rounded-full py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            autoFocus
          />
          <button type="submit" className="p-2 text-white hover:text-purple-400">
            <FiSend size={18}/>
          </button>
        </form>
      )}

      
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-5 pl-6 border-l-2 border-gray-700">
          <button onClick={() => setShowReplies(!showReplies)} className="text-xs font-semibold text-gray-400 hover:text-white mt-2 flex items-center gap-1">
            {showReplies ? 'Hide Replies' : `View ${comment.replies.length} Replies`}
            {showReplies ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
          {showReplies && comment.replies.map(reply => (
            
            <Comment key={reply._id} comment={reply} postId={postId} currentUser={currentUser} onCommentAdded={onCommentAdded} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};


const PostCard = ({ post, currentUser, onPostDeleted }) => {
  const [localPost, setLocalPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const isLiked = localPost.likes.includes(currentUser?.id);

  const getToken = () => localStorage.getItem('token');

  const handleLikeToggle = async () => {
    const originalLikes = localPost.likes;
    const newLikes = isLiked
      ? originalLikes.filter(id => id !== currentUser.id)
      : [...originalLikes, currentUser.id];
    setLocalPost({ ...localPost, likes: newLikes });

    try {
      // FIX: Added 'Bearer ' prefix
      await axios.post(`/api/community/posts/${localPost._id}/like`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (err) {
      setLocalPost({ ...localPost, likes: originalLikes });
      alert('Failed to update like.');
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      // FIX: Added 'Bearer ' prefix
      const { data } = await axios.get(`/api/community/posts/${localPost._id}/comments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
    setShowComments(!showComments);
  };
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      // FIX: Added 'Bearer ' prefix
      await axios.post(`/api/community/posts/${localPost._id}/comments`, { text: commentText }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setCommentText('');
      fetchComments();
    } catch (error) {
       console.error("Failed to add comment", error);
       alert('Failed to add comment.');
    }
  };

  const handleDeletePost = async () => {
     if (!window.confirm("Are you sure you want to delete this post?")) return;
     try {
       // FIX: Added 'Bearer ' prefix
       await axios.delete(`/api/community/posts/${localPost._id}`, {
         headers: { Authorization: `Bearer ${getToken()}` },
       });
       onPostDeleted();
     } catch (error) {
        console.error("Failed to delete post", error);
        alert('Failed to delete post.');
     }
  };

  return (
    <div className="flex flex-row bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-md overflow-hidden h-[62vh]">
      <div className="w-full max-w-xl flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="font-bold">{localPost.user.name}</span>
              </div>
              {currentUser?.id === localPost.user._id && (
                  <button onClick={handleDeletePost} className="p-2 text-gray-400 hover:text-white hover:bg-red-500/50 rounded-full">
                      <FiTrash2 size={20} />
                  </button>
              )}
          </div>
          
          <div className="flex-grow overflow-y-auto">
            <img src={localPost.designUrl} alt={localPost.title} className="w-full h-auto object-cover bg-black/20" />
            <div className="p-4">
                <div className="flex gap-4">
                    <button onClick={handleLikeToggle} className="flex items-center gap-2 hover:text-red-500">
                        <FiHeart size={24} className={`${isLiked ? 'fill-current text-red-500' : ''}`} />
                    </button>
                    <button onClick={handleToggleComments} className="flex items-center gap-2 hover:text-blue-400">
                        <FiMessageCircle size={24} />
                    </button>
                </div>

                <p className="font-bold mt-3">{localPost.likes.length} likes</p>
                <p className="mt-1">
                    <span className="font-bold mr-2">{localPost.user.name}</span>
                    <span className="text-gray-200">{localPost.title}</span>
                </p>
                <p className="text-gray-300 text-sm mt-1">{localPost.description}</p>
            </div>
          </div>
           
          <div className="p-4 border-t border-white/10">
            <button onClick={handleToggleComments} className="text-gray-400 text-sm flex items-center gap-1">
              {showComments ? 'Hide comments' : `View comments`} 
              {showComments ? <FiChevronRight/> : <FiChevronLeft />}
            </button>
          </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out bg-black/20 ${showComments ? 'w-96 border-l' : 'w-0'} border-white/10 flex flex-col`}>
          <div className="flex-shrink-0">
            <h3 className="font-bold p-4 text-lg border-b border-white/10">Comments</h3>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto">
              {loadingComments ? (
                  <p className="text-gray-400">Loading...</p>
              ) : comments.length > 0 ? (
                  comments.map(c => <Comment key={c._id} comment={c} postId={localPost._id} currentUser={currentUser} onCommentAdded={fetchComments} depth={0} />)
              ) : (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
          </div>

          <div className="flex-shrink-0">
            <form onSubmit={handleAddComment} className="flex gap-2 p-4 border-t border-white/10">
                <input 
                    type="text" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..." 
                    className="flex-grow bg-gray-700/50 border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="p-2 text-white hover:text-purple-400">
                    <FiSend size={22}/>
                </button>
            </form>
          </div>
      </div>
    </div>
  );
};

export default PostCard;
