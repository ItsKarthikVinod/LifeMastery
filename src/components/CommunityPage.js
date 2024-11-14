import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase'; // Ensure you import auth from Firebase
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { FaThumbsUp, FaComment, FaTrash, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const adminEmail = 'karthivinu1122@gmail.com'; // Admin email for privileges

  useEffect(() => {
    fetchPosts();
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  const addPost = async () => {
    if (!newPostTitle || !newPostContent) return;

    try {
      const postsRef = collection(db, 'posts');
      await addDoc(postsRef, {
        title: newPostTitle,
        content: newPostContent,
        timestamp: new Date(),
        likes: 0,
        comments: [],
        likedBy: [],
        user: user?.displayName || 'Anonymous User', // Show display name or 'Anonymous User'
      });
      setNewPostTitle('');
      setNewPostContent('');
      fetchPosts();
      setModalIsOpen(false); // Close modal after posting
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  const addComment = async (postId) => {
    if (!newComment) return;

    const postRef = doc(db, 'posts', postId);
    const post = posts.find((p) => p.id === postId);
    const updatedComments = [
      ...post.comments,
      { user: user?.displayName || 'Anonymous User', content: newComment, timestamp: new Date() },
    ];

    try {
      await updateDoc(postRef, { comments: updatedComments });
      setNewComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const toggleLike = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    const post = posts.find((p) => p.id === postId);
    const userId = user?.email; // Use the email as a unique identifier for the user
    const likedBy = post.likedBy || [];

    if (likedBy.includes(userId)) {
      // If the user already liked, remove the like
      const updatedLikedBy = likedBy.filter((id) => id !== userId);
      const updatedLikes = post.likes - 1;

      try {
        await updateDoc(postRef, { likedBy: updatedLikedBy, likes: updatedLikes });
        fetchPosts();
      } catch (error) {
        console.error('Error unliking post: ', error);
      }
    } else {
      // If the user hasn't liked yet, add the like
      const updatedLikedBy = [...likedBy, userId];
      const updatedLikes = post.likes + 1;

      try {
        await updateDoc(postRef, { likedBy: updatedLikedBy, likes: updatedLikes });
        fetchPosts();
      } catch (error) {
        console.error('Error liking post: ', error);
      }
    }
  };

  const deletePost = async (postId, postUser) => {
    // Allow admin (me) to delete any post, even if it is not theirs
    if (user?.email !== postUser && user?.email !== adminEmail) {
      alert("You can only delete your own posts.");
      return;
    }

    const postRef = doc(db, 'posts', postId);
    try {
      await deleteDoc(postRef);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  };

  const deleteComment = async (postId, commentIndex) => {
    // Allow admin to delete any comment
    if (user?.email !== adminEmail) {
      alert("Only the admin can delete comments.");
      return;
    }

    const postRef = doc(db, 'posts', postId);
    const post = posts.find((p) => p.id === postId);
    const updatedComments = post.comments.filter((_, index) => index !== commentIndex);

    try {
      await updateDoc(postRef, { comments: updatedComments });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting comment: ', error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const toggleComments = (postId) => {
    setSelectedPostId(selectedPostId === postId ? null : postId);
  };

  const isAdmin = (userEmail) => userEmail === adminEmail;

  return (
    <div className=" bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen  mx-auto p-8 mt-15 p-24">
      <h2 className="text-4xl font-bold mb-8 mt-24 text-center text-white-600">Community Forum</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={openModal}
          className="bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600 shadow-lg"
        >
          New Post
        </button>
      </div>

      {/* Posts list */}
      <div className="posts-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`post-card bg-white shadow-lg rounded-lg p-6 ${isAdmin(post.user) ? 'border-2 border-teal-500 bg-teal-50' : ''}`}
          >
            <h3 className="text-2xl font-semibold text-teal-700 mb-4">
              {post.title}
              {isAdmin(post.user) && <span className="text-teal-500 ml-2">(Admin)</span>}
            </h3>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <p className="text-gray-500 text-sm mb-4">Posted by: {post.user}{isAdmin(post.user) && ' (Admin)'}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="text-teal-500 flex items-center"
                >
                  <FaThumbsUp className="mr-1" />
                  {post.likes} Likes
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="text-teal-500 flex items-center"
                >
                  <FaComment className="mr-1" />
                  {post.comments.length} Comments
                </button>
              </div>
              <button
                onClick={() => deletePost(post.id, post.user)}
                className={`text-red-500 ${user?.email === adminEmail ? 'visible' : 'hidden'}`}
              >
                <FaTrash />
              </button>
            </div>

            {selectedPostId === post.id && (
              <div className="comments-section mt-6">
                <button
                  onClick={() => setSelectedPostId(null)}
                  className="text-red-500 mb-4 flex items-center"
                >
                  <FaTimes className="mr-1" /> Close Comments
                </button>
                <div className="comments">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="comment mb-4 p-4 border-b border-gray-300">
                      <strong>{comment.user}{isAdmin(comment.user) && ' (Admin)'}</strong> <span className="text-gray-500 text-xs">{comment.timestamp.toDate().toLocaleString()}</span>
                      <p className="text-gray-700 mt-2">{comment.content}</p>
                      {user?.email === adminEmail && (
                        <button
                          onClick={() => deleteComment(post.id, index)}
                          className="text-red-500 text-sm mt-2"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="add-comment mt-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-md mb-4"
                    placeholder="Add a comment..."
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    className="bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for new post */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="lg:m-24 lg:p-20 m-12 my-20 p-12 modal-container bg-white z-10">
        <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
        <input
          type="text"
          placeholder="Post Title"
          className="w-full p-4 mb-4 border border-gray-300 rounded-md"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Post Content"
          className="w-full p-4 mb-4 border border-gray-300 rounded-md"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <div className="flex justify-between">
          <button
            onClick={addPost}
            className="bg-teal-500 text-white px-6 py-3 rounded-full hover:bg-teal-600"
          >
            Post
          </button>
          <button
            onClick={closeModal}
            className="text-gray-500 px-6 py-3"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityPage;
