// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FiSend, FiX } from 'react-icons/fi';

// // A recursive component to render comments and their replies
// const Comment = ({ comment, postId, currentUser, onCommentDeleted }) => {
//   const handleDelete = async () => {
//     if (!window.confirm("Delete this comment and all its replies?")) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`/api/community/posts/${postId}/comments/${comment._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       onCommentDeleted(); // Trigger a refetch in the parent
//     } catch (error) {
//       console.error("Failed to delete comment:", error);
//       alert("Failed to delete comment.");
//     }
//   };

//   return (
//     <div className="flex items-start space-x-3 mt-3">
//       <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full"></div>
//       <div className="flex-1">
//         <p className="text-sm bg-gray-700/50 rounded-lg p-2">
//           <span className="font-bold mr-2">{comment.user.name}</span>
//           {comment.text}
//         </p>
//         <div className="text-xs text-gray-400 mt-1 flex items-center gap-4 pl-2">
//           {comment.user._id === currentUser.id && (
//             <button onClick={handleDelete} className="hover:text-red-500 font-semibold">Delete</button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ExpandedComments = ({ post, currentUser, onClose }) => {
//     const [comments, setComments] = useState([]);
//     const [commentText, setCommentText] = useState('');
//     const [loading, setLoading] = useState(true);

//     const fetchComments = async () => {
//         if (!post) return;
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('token');
//             const { data } = await axios.get(`/api/community/posts/${post._id}/comments`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setComments(data);
//         } catch (error) {
//             console.error("Failed to fetch comments", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch comments when the selected post changes
//     useEffect(() => {
//         fetchComments();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [post]);

//     const handleAddComment = async (e) => {
//         e.preventDefault();
//         if (!commentText.trim()) return;
//         try {
//             const token = localStorage.getItem('token');
//             await axios.post(`/api/community/posts/${post._id}/comments`, { text: commentText }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setCommentText('');
//             fetchComments(); // Refetch comments to show the new one
//         } catch (error) {
//            console.error("Failed to add comment", error);
//            alert('Failed to add comment.');
//         }
//     };

//     return (
//         <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl h-[85vh] flex flex-col">
//             <div className="p-4 border-b border-white/10 flex justify-between items-center">
//                 <h3 className="font-bold text-lg">Comments</h3>
//                 <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
//                     <FiX size={20} />
//                 </button>
//             </div>
            
//             {/* Comments List */}
//             <div className="flex-grow p-4 overflow-y-auto">
//                 {loading ? (
//                      <p className="text-gray-400">Loading comments...</p>
//                 ) : comments.length > 0 ? (
//                     comments.map(c => <Comment key={c._id} comment={c} postId={post._id} currentUser={currentUser} onCommentDeleted={fetchComments} />)
//                 ) : (
//                     <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
//                 )}
//             </div>

//             {/* Add Comment Form */}
//             <div className="p-4 border-t border-white/10">
//                 <form onSubmit={handleAddComment} className="flex gap-2">
//                     <input 
//                         type="text" 
//                         value={commentText}
//                         onChange={(e) => setCommentText(e.target.value)}
//                         placeholder="Add a comment..." 
//                         className="flex-grow bg-gray-700/50 border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
//                     />
//                     <button type="submit" className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors">
//                         <FiSend size={18}/>
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ExpandedComments;