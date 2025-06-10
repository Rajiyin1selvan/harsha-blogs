import React, { useState } from 'react';
import { Heart, Share2, User, Calendar, Clock, Edit3, Trash2, Eye, X } from 'lucide-react';

// --- Custom Alert Modal Component ---
const AlertModal = ({ message, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content text-center relative">
      <h3 className="modal-title">Notification</h3>
      <p className="modal-message">{message}</p>
      <button
        onClick={onClose}
        className="modal-button primary-button"
      >
        OK
      </button>
      <button
        onClick={onClose}
        className="modal-close-button"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  </div>
);

// --- Custom Confirm Modal Component ---
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content text-center relative">
      <h3 className="modal-title">Confirm Action</h3>
      <p className="modal-message">{message}</p>
      <div className="flex-center-gap">
        <button
          onClick={onConfirm}
          className="modal-button danger-button"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="modal-button default-button"
        >
          Cancel
        </button>
      </div>
      <button
        onClick={onCancel}
        className="modal-close-button"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  </div>
);

const BlogWebsite = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Building a Full-Stack E-commerce Platform",
      content: "This project involved creating a comprehensive e-commerce solution using React, Node.js, and MongoDB. The platform includes user authentication, product management, shopping cart functionality, and payment integration. One of the biggest challenges was implementing real-time inventory management and ensuring secure payment processing. The project taught me valuable lessons about scalable architecture and user experience design.",
      imageUrl: "https://placehold.co/600x400/A7F3D0/10B981?text=E-commerce+Platform",
      author: "Admin",
      date: "2024-06-01",
      readTime: "5 min read",
      likes: 24,
      views: 156,
      tags: ["React", "Node.js", "MongoDB", "E-commerce"]
    },
    {
      id: 2,
      title: "AI-Powered Task Management System",
      content: "Developed an intelligent task management application that uses machine learning to predict task completion times and suggest optimal scheduling. The system analyzes user behavior patterns and provides personalized productivity insights. Built with Python, Flask, and TensorFlow, this project demonstrated the practical applications of AI in everyday productivity tools.",
      imageUrl: "https://placehold.co/600x400/FECACA/EF4444?text=AI+Task+Manager",
      author: "Admin",
      date: "2024-05-15",
      readTime: "7 min read",
      likes: 31,
      views: 203,
      tags: ["Python", "AI", "Machine Learning", "Flask"]
    },
    {
      id: 3,
      title: "Real-time Chat Application with WebSocket",
      content: "Created a modern chat application featuring real-time messaging, file sharing, and group conversations. The application uses WebSocket for instant communication and includes features like message encryption, user presence indicators, and message history. This project helped me understand real-time communication protocols and socket programming.",
      imageUrl: "https://placehold.co/600x400/DBEAFE/3B82F6?text=Chat+App",
      author: "Admin",
      date: "2024-04-20",
      readTime: "4 min read",
      likes: 18,
      views: 98,
      tags: ["WebSocket", "Real-time", "JavaScript", "Communication"]
    }
  ]);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    readTime: '',
    tags: '',
    imageUrl: ''
  });
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const [likedBlogs, setLikedBlogs] = useState(new Set());
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Admin login
  const handleLogin = () => {
    if (adminPassword === 'harshaodablogs') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      setAlertMessage('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowNewBlogForm(false);
  };

  // Like/unlike
  const handleLike = (blogId) => {
    setBlogs(blogs.map(blog =>
      blog.id === blogId
        ? { ...blog, likes: likedBlogs.has(blogId) ? blog.likes - 1 : blog.likes + 1 }
        : blog
    ));

    setLikedBlogs(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(blogId)) {
        newLiked.delete(blogId);
      } else {
        newLiked.add(blogId);
      }
      return newLiked;
    });
  };

  // Share
  const handleShare = (blog) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.content.substring(0, 100) + '...',
        url: window.location.href
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      const shareText = `${blog.title}\n\n${blog.content.substring(0, 100)}...\n\nRead more at: ${window.location.href}`;
      try {
        navigator.clipboard.writeText(shareText).then(() => {
          setAlertMessage('Blog content copied to clipboard!');
        }).catch(err => {
          const el = document.createElement('textarea');
          el.value = shareText;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          setAlertMessage('Blog content copied to clipboard (fallback)!');
        });
      } catch (err) {
        const el = document.createElement('textarea');
        el.value = shareText;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setAlertMessage('Blog content copied to clipboard (fallback)!');
      }
    }
  };

  // Add blog
  const handleAddBlog = () => {
    if (newBlog.title && newBlog.content) {
      const blog = {
        id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
        title: newBlog.title,
        content: newBlog.content,
        imageUrl: newBlog.imageUrl || '',
        author: "Admin",
        date: new Date().toISOString().split('T')[0],
        readTime: newBlog.readTime || "5 min read",
        likes: 0,
        views: 0,
        tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      setBlogs([blog, ...blogs]);
      setNewBlog({ title: '', content: '', readTime: '', tags: '', imageUrl: '' });
      setShowNewBlogForm(false);
      setAlertMessage('Blog post published successfully!');
    } else {
      setAlertMessage('Please fill in both title and content.');
    }
  };

  // Delete blog
  const handleDeleteBlog = (blogId) => {
    setConfirmAction({
      message: 'Are you sure you want to delete this blog?',
      onConfirm: () => {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        if (selectedBlog && selectedBlog.id === blogId) {
          setSelectedBlog(null);
        }
        setConfirmAction(null);
        setAlertMessage('Blog post deleted.');
      },
      onCancel: () => setConfirmAction(null)
    });
  };

  // Increment views
  const incrementViews = (blogId) => {
    setBlogs(blogs.map(blog =>
      blog.id === blogId
        ? { ...blog, views: blog.views + 1 }
        : blog
    ));
  };

  // Open blog detail
  const openBlog = (blog) => {
    setSelectedBlog(blog);
    incrementViews(blog.id);
  };

  // Responsive and main styles
  const style = `
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .app-container {
      min-height: 100vh;
      background: linear-gradient(to bottom right, #f8fafc, #eff6ff);
      padding: 32px 16px;
      box-sizing: border-box;
    }
    @media (max-width: 600px) {
      .app-container { padding: 16px 4px; }
      .blog-list { grid-template-columns: 1fr; gap: 16px; }
      .blog-card { padding: 12px 8px; }
      .modal-content { width: 95vw; padding: 16px 4px; }
      h1, .text-4xl { font-size: 1.5rem; }
      .text-3xl { font-size: 1.125rem; }
      .blog-action-button, .btn-back-list { width: 100%; font-size: 0.95rem; padding: 10px 0; }
    }
    .blog-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }
    .blog-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 20px;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s;
    }
    .blog-card-image, .blog-detail-image {
      width: 100%;
      height: auto;
      max-height: 300px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #e5e7eb;
    }
    .blog-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    .blog-tag {
      background-color: #dbeafe;
      color: #2563eb;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .blog-meta {
      display: flex;
      gap: 16px;
      align-items: center;
      color: #4b5563;
      font-size: 0.95rem;
      margin-bottom: 8px;
    }
    .blog-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .blog-content {
      color: #1f2937;
      margin-bottom: 8px;
      font-size: 1rem;
      line-height: 1.5;
    }
    .blog-actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .blog-action-button {
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.125rem;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      outline: none;
      border: none;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .blog-like-button {
      background-color: #e5e7eb;
      color: #374151;
    }
    .blog-like-button:hover { background-color: #d1d5db; }
    .blog-like-button.liked { background-color: #ef4444; color: white; }
    .blog-like-button.liked:hover { background-color: #dc2626; }
    .blog-share-button { background-color: #3b82f6; color: white; }
    .blog-share-button:hover { background-color: #2563eb; }
    .blog-edit-button { background-color: #fbbf24; color: #78350f; }
    .blog-edit-button:hover { background-color: #f59e42; }
    .blog-delete-button { background-color: #ef4444; color: white; }
    .blog-delete-button:hover { background-color: #dc2626; }
    .btn-back-list {
      color: #2563eb;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      padding: 8px 12px;
      background: none;
      border: none;
      cursor: pointer;
      margin-bottom: 16px;
    }
    .btn-back-list:hover {
      color: #1e40af;
      background-color: #eff6ff;
    }
    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.3);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: #fff;
      border-radius: 12px;
      padding: 24px 16px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      position: relative;
    }
    .modal-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; }
    .modal-message { margin-bottom: 16px; }
    .modal-button {
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 600;
      margin: 0 4px;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    .primary-button { background: #3b82f6; color: white; }
    .danger-button { background: #ef4444; color: white; }
    .default-button { background: #e5e7eb; color: #374151; }
    .modal-close-button {
      position: absolute;
      top: 12px; right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
      padding: 2px;
    }
    /* New Blog Form */
    .new-blog-form label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
    }
    .new-blog-form input, .new-blog-form textarea {
      width: 100%;
      padding: 8px 10px;
      margin-bottom: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      box-sizing: border-box;
    }
    .new-blog-form textarea { min-height: 80px; }
    .new-blog-form .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 8px;
    }
    /* Utility classes */
    .flex-center-gap {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 12px;
    }
  `;

  // Blog detail view
  if (selectedBlog) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{style}</style>
        <div className="app-container">
          <button className="btn-back-list" onClick={() => setSelectedBlog(null)}>
            <X size={18} /> Back to Blogs
          </button>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
            {selectedBlog.imageUrl && (
              <img src={selectedBlog.imageUrl} alt="Blog visual" className="blog-detail-image" />
            )}
            <div className="blog-title text-3xl mb-3">{selectedBlog.title}</div>
            <div className="blog-meta">
              <User size={18} /> {selectedBlog.author}
              <Calendar size={18} /> {selectedBlog.date}
              <Clock size={18} /> {selectedBlog.readTime}
              <Eye size={18} /> {selectedBlog.views} views
            </div>
            <div className="blog-tags">
              {selectedBlog.tags.map((tag, idx) => (
                <span className="blog-tag" key={idx}>{tag}</span>
              ))}
            </div>
            <div className="blog-content mt-4">{selectedBlog.content}</div>
            <div className="blog-actions">
              <button
                className={`blog-action-button blog-like-button${likedBlogs.has(selectedBlog.id) ? ' liked' : ''}`}
                onClick={() => handleLike(selectedBlog.id)}
              >
                <Heart size={20} /> {selectedBlog.likes} Like
              </button>
              <button
                className="blog-action-button blog-share-button"
                onClick={() => handleShare(selectedBlog)}
              >
                <Share2 size={20} /> Share
              </button>
              {isAdmin && (
                <button
                  className="blog-action-button blog-delete-button"
                  onClick={() => handleDeleteBlog(selectedBlog.id)}
                >
                  <Trash2 size={20} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
        {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
        {confirmAction && (
          <ConfirmModal
            message={confirmAction.message}
            onConfirm={confirmAction.onConfirm}
            onCancel={confirmAction.onCancel}
          />
        )}
      </>
    );
  }

  // Blog list view
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{style}</style>
      <div className="app-container">
        <div className="max-w-6xl mx-auto">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <h1 className="text-4xl font-bold">Harsha Blogs</h1>
            <div>
              {isAdmin ? (
                <>
                  <button
                    className="blog-action-button blog-edit-button"
                    onClick={() => setShowNewBlogForm(true)}
                  >
                    <Edit3 size={20} /> New Blog
                  </button>
                  <button
                    className="blog-action-button blog-delete-button"
                    onClick={handleLogout}
                    style={{ marginLeft: 8 }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="blog-action-button blog-share-button"
                  onClick={() => setShowAdminLogin(true)}
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
          <div className="blog-list">
            {blogs.map(blog => (
              <div className="blog-card" key={blog.id}>
                {blog.imageUrl && (
                  <img src={blog.imageUrl} alt="Blog" className="blog-card-image" />
                )}
                <div className="blog-title">{blog.title}</div>
                <div className="blog-meta">
                  <User size={16} /> {blog.author}
                  <Calendar size={16} /> {blog.date}
                  <Clock size={16} /> {blog.readTime}
                  <Eye size={16} /> {blog.views} views
                </div>
                <div className="blog-tags">
                  {blog.tags.map((tag, idx) => (
                    <span className="blog-tag" key={idx}>{tag}</span>
                  ))}
                </div>
                <div className="blog-content" style={{ margin: "12px 0" }}>
                  {blog.content.length > 120
                    ? blog.content.substring(0, 120) + '...'
                    : blog.content}
                </div>
                <div className="blog-actions">
                  <button
                    className={`blog-action-button blog-like-button${likedBlogs.has(blog.id) ? ' liked' : ''}`}
                    onClick={() => handleLike(blog.id)}
                  >
                    <Heart size={18} /> {blog.likes}
                  </button>
                  <button
                    className="blog-action-button blog-share-button"
                    onClick={() => handleShare(blog)}
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    className="blog-action-button"
                    style={{ background: "#e0e7ff", color: "#3730a3" }}
                    onClick={() => openBlog(blog)}
                  >
                    Read More
                  </button>
                  {isAdmin && (
                    <button
                      className="blog-action-button blog-delete-button"
                      onClick={() => handleDeleteBlog(blog.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="modal-overlay">
          <div className="modal-content text-center">
            <h3 className="modal-title">Admin Login</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{ marginBottom: 12 }}
            />
            <div className="flex-center-gap">
              <button
                className="modal-button primary-button"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="modal-button default-button"
                onClick={() => setShowAdminLogin(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Blog Form Modal */}
      {showNewBlogForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">New Blog Post</h3>
            <form
              className="new-blog-form"
              onSubmit={e => { e.preventDefault(); handleAddBlog(); }}
            >
              <label>Title</label>
              <input
                type="text"
                value={newBlog.title}
                onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                required
              />
              <label>Content</label>
              <textarea
                value={newBlog.content}
                onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
                required
              />
              <label>Read Time</label>
              <input
                type="text"
                value={newBlog.readTime}
                onChange={e => setNewBlog({ ...newBlog, readTime: e.target.value })}
                placeholder="e.g. 5 min read"
              />
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={newBlog.tags}
                onChange={e => setNewBlog({ ...newBlog, tags: e.target.value })}
                placeholder="e.g. React, Node.js"
              />
              <label>Image URL</label>
              <input
                type="text"
                value={newBlog.imageUrl}
                onChange={e => setNewBlog({ ...newBlog, imageUrl: e.target.value })}
                placeholder="https://..."
              />
              <div className="form-actions">
                <button className="modal-button primary-button" type="submit">
                  Publish
                </button>
                <button
                  className="modal-button default-button"
                  type="button"
                  onClick={() => setShowNewBlogForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={confirmAction.onCancel}
        />
      )}
    </>
  );
};

export default BlogWebsite;
