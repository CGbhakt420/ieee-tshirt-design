import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FiHeart, FiMessageCircle, FiTrash2, FiSend, FiChevronLeft, FiChevronRight, FiCornerUpRight, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

// A reusable Modal component for confirmations and alerts
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};


// A recursive component to render comments and their replies
const Comment = ({ comment, postId, currentUser, onCommentAdded, depth }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(true); // Show replies by default
    const [replyText, setReplyText] = useState('');
    
    // State for modal notifications within each comment
    const [modal, setModal] = useState({ isOpen: false, title: '', content: null });

    const getToken = () => localStorage.getItem('token');

    const showModal = (title, content) => setModal({ isOpen: true, title, content });
    const closeModal = () => setModal({ isOpen: false, title: '', content: null });

    const handleDelete = async () => {
        const performDelete = async () => {
            try {
                await axios.delete(`/api/community/posts/${postId}/comments/${comment._id}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                closeModal();
                onCommentAdded(); // Re-fetch comments after deletion
            } catch (error) {
                console.error("Failed to delete comment:", error);
                showModal('Error', <p className="text-gray-300">Failed to delete comment. Please try again.</p>);
            }
        };

        showModal('Confirm Deletion', (
            <div>
                <p className="text-gray-300">Are you sure you want to delete this comment and all its replies?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                    <button onClick={performDelete} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-semibold text-white">Delete</button>
                </div>
            </div>
        ));
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            await axios.post(`/api/community/posts/${postId}/comments`,
                { text: replyText, parentComment: comment._id },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setReplyText('');
            setShowReplyForm(false);
            onCommentAdded(); // Re-fetch all comments to show the new reply
        } catch (error) {
            console.error("Failed to add reply:", error);
            showModal('Error', <p className="text-gray-300">Failed to add reply. Please try again.</p>);
        }
    };

    return (
        <>
            <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
                {modal.content}
            </Modal>
            <div className="flex flex-col mt-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                        <div className="bg-gray-700/50 rounded-lg p-3">
                            <span className="font-bold mr-2 text-sm text-white">{comment.user.name}</span>
                            <p className="text-sm text-gray-200">{comment.text}</p>
                        </div>
                        <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-4 pl-2">
                            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                            {depth < 2 && ( // Allow replying to replies one level deep
                                <button onClick={() => setShowReplyForm(!showReplyForm)} className="hover:text-white font-semibold">Reply</button>
                            )}
                            {currentUser?.id === comment.user._id && (
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
                            className="flex-grow bg-gray-900/50 border border-gray-600 rounded-full py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            autoFocus
                        />
                        <button type="submit" className="p-2 text-white hover:text-purple-400">
                            <FiSend size={18} />
                        </button>
                    </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-5 pl-6 border-l-2 border-gray-700">
                        <button onClick={() => setShowReplies(!showReplies)} className="text-xs font-semibold text-gray-400 hover:text-white mt-3 flex items-center gap-1">
                            {showReplies ? 'Hide Replies' : `View ${comment.replies.length} Replies`}
                            {showReplies ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        </button>
                        {showReplies && comment.replies.map(reply => (
                            <Comment key={reply._id} comment={reply} postId={postId} currentUser={currentUser} onCommentAdded={onCommentAdded} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};


const PostCard = ({ post, currentUser, onPostDeleted }) => {
    const [localPost, setLocalPost] = useState(post);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const isLiked = localPost.likes.includes(currentUser?.id);

    // State for modal notifications
    const [modal, setModal] = useState({ isOpen: false, title: '', content: null });

    const getToken = () => localStorage.getItem('token');
    
    const showModal = (title, content) => setModal({ isOpen: true, title, content });
    const closeModal = () => setModal({ isOpen: false, title: '', content: null });

    const handleLikeToggle = async () => {
        const originalLikes = localPost.likes;
        const newLikes = isLiked
            ? originalLikes.filter(id => id !== currentUser.id)
            : [...originalLikes, currentUser.id];
        setLocalPost({ ...localPost, likes: newLikes });

        try {
            await axios.post(`/api/community/posts/${localPost._id}/like`, {}, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
        } catch (err) {
            setLocalPost({ ...localPost, likes: originalLikes }); // Revert on error
            showModal('Error', <p className="text-gray-300">Failed to update like. Please try again.</p>);
        }
    };

    const fetchComments = useCallback(async () => {
        setLoadingComments(true);
        try {
            const { data } = await axios.get(`/api/community/posts/${localPost._id}/comments`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
            showModal('Error', <p className="text-gray-300">Could not load comments.</p>);
        } finally {
            setLoadingComments(false);
        }
    }, [localPost._id]);

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
            await axios.post(`/api/community/posts/${localPost._id}/comments`, { text: commentText }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setCommentText('');
            fetchComments(); // Refresh comments list
        } catch (error) {
            console.error("Failed to add comment", error);
            showModal('Error', <p className="text-gray-300">Failed to add comment. Please try again.</p>);
        }
    };

    const handleDeletePost = async () => {
        const performDelete = async () => {
            try {
                await axios.delete(`/api/community/posts/${localPost._id}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                closeModal();
                onPostDeleted();
            } catch (error) {
                console.error("Failed to delete post", error);
                showModal('Error', <p className="text-gray-300">Failed to delete post. Please try again.</p>);
            }
        };

        showModal('Confirm Deletion', (
             <div>
                <p className="text-gray-300">Are you sure you want to delete this post?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                    <button onClick={performDelete} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-semibold text-white">Delete</button>
                </div>
            </div>
        ));
    };

    return (
        <>
            <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
                {modal.content}
            </Modal>
            {/* FIX: Re-introduced a fixed height to constrain the card's size.
                This allows for independent scrolling within the post and comment sections. */}
            <div className="flex flex-row bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-md overflow-hidden h-[630px]">
                <div className="w-full max-w-xl flex flex-col">
                    <div className="p-4 flex justify-between items-center border-b border-white/10 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <span className="font-bold text-white">{localPost.user.name}</span>
                        </div>
                        {currentUser?.id === localPost.user._id && (
                            <button onClick={handleDeletePost} className="p-2 text-gray-400 hover:text-white hover:bg-red-500/50 rounded-full">
                                <FiTrash2 size={20} />
                            </button>
                        )}
                    </div>

                    {/* FIX: This content area is now scrollable if the image/description is too tall.
                        This keeps the post header and footer visible at all times. */}
                    <div className="flex-grow overflow-y-auto">
                        <img src={localPost.designUrl} alt={localPost.title} className="w-full h-auto object-cover bg-black/20" />
                        <div className="p-4">
                            <div className="flex gap-4">
                                <button onClick={handleLikeToggle} className="flex items-center gap-2 hover:text-red-500 transition-colors">
                                    <FiHeart size={24} className={`transition-colors ${isLiked ? 'fill-current text-red-500' : 'text-white'}`} />
                                </button>
                                <button onClick={handleToggleComments} className="flex items-center gap-2 hover:text-blue-400 text-white">
                                    <FiMessageCircle size={24} />
                                </button>
                            </div>

                            <p className="font-bold mt-3 text-white">{localPost.likes.length} likes</p>
                            <p className="mt-1">
                                <span className="font-bold mr-2 text-white">{localPost.user.name}</span>
                                <span className="text-gray-200">{localPost.title}</span>
                            </p>
                            <p className="text-gray-300 text-sm mt-1">{localPost.description}</p>
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/10 flex-shrink-0">
                        <button onClick={handleToggleComments} className="text-gray-400 text-sm flex items-center gap-1 hover:text-white">
                            {showComments ? 'Hide comments' : `View comments`}
                            {showComments ? <FiChevronLeft /> : <FiChevronRight />}
                        </button>
                    </div>
                </div>

                {/* The comments panel is also constrained by the card's height, so its internal scroll works correctly. */}
                <div className={`transition-all duration-500 ease-in-out bg-black/20 ${showComments ? 'w-96 border-l' : 'w-0'} border-white/10 flex flex-col`}>
                    <div className="flex-shrink-0">
                        <h3 className="font-bold p-4 text-lg border-b border-white/10 text-white">Comments</h3>
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
                                className="flex-grow bg-gray-700/50 border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                            />
                            <button type="submit" className="p-2 text-white hover:text-purple-400">
                                <FiSend size={22} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCard;