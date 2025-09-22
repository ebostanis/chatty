import { Cancel, LogoutRounded, Person4TwoTone, Send, CheckCircle, Error, Close } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { updateProfile, deleteAccount } from '../api/userApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';
import { fetchMessages, fetchChats, sendMessage, createChat } from '../api/chatApi';

// Custom Notification Component
const CustomNotification = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`custom-notification ${type}`}>
      <div className="notification-content">
        {type === 'success' && <CheckCircle className="notification-icon" />}
        {type === 'error' && <Error className="notification-icon" />}
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>
          <Close fontSize="small" />
        </button>
      </div>
    </div>
  );
};

// Profile Modal Component
const ProfileModal = ({ open, onClose }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false });
  const { user } = useAuth();

  const showNotification = (message, type) => {
    setNotification({ message, type, isVisible: true });
  };

  const hideNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  const deleteUserAccount = async () => {
    try {
      await deleteAccount();
      localStorage.removeItem('token');
      showNotification('Account deleted successfully', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Error deleting account:', error);
      showNotification('Failed to delete account. Please try again.', 'error');
    }
  };

  const updateUserPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      await updateProfile({
        email: user.email,
        password: passwordData.newPassword,
        subscription: user.subscription
      });
      
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');
      showNotification('Password updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setPasswordError('');
  };

  if (!open) return null;

  return (
    <>
      <CustomNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Profile Settings</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <button 
              className="modal-option change-password-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
            <button 
              className="modal-option delete-account-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Change Password</h3>
              <button className="close-btn" onClick={() => {
                setShowPasswordModal(false);
                setPasswordError('');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}>×</button>
            </div>
            <div className="modal-body">
              {passwordError && (
                <div className="error-message">
                  {passwordError}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input 
                  className="form-input" 
                  type="password" 
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input 
                  className="form-input" 
                  type="password" 
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input 
                  className="form-input" 
                  type="password" 
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                />
              </div>
              <button 
                className="modal-option change-password-btn update-btn"
                onClick={updateUserPassword}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Delete Account</h3>
              <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="warning-text">
                Are you sure you want to delete your account? This action cannot be undone and all your chats will be permanently lost.
              </p>
              <div className="confirm-buttons">
                <button 
                  className="confirm-btn confirm-no"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-btn confirm-yes"
                  onClick={deleteUserAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const LogoutConfirmationModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Confirm Logout</h3>
          <button className="close-btn" onClick={onClose}><Cancel/></button>
        </div>
        <div className="modal-body">
          <p className="confirmation-text">
            Are you sure you want to logout?
          </p>
          <div className="confirm-buttons">
            <button 
              className="confirm-btn confirm-no"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="confirm-btn confirm-yes"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Chat Home Component
export default function HomePage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutConfirmationModal, setLogoutConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  // Handle chatId changes from URL
  useEffect(() => {
    if (chatId && chatId !== 'new') {
      const chat = chats.find(c => c.id.toString() === chatId);
      if (chat) {
        setCurrentChat(chat);
        loadMessages(chatId);
      }
    } else if (chatId === 'new' || !chatId) {
      setCurrentChat(null);
      setMessages([]);
    }
  }, [chatId, chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadChats = async () => {
    try {
      const response = await fetchChats();
      const fetchedChats = response.data || [];
      setChats(fetchedChats);

      if (!chatId && fetchedChats.length > 0) {
        navigate(`/chats/${fetchedChats[0].id}`);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      setLoading(true);
      const response = await fetchMessages(chatId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      if (!currentChat || chatId === 'new') {
        const response = await createChat({ content: messageContent });
        const newChat = response.data;
        
        navigate(`/chats/${newChat.id}`, { replace: true });
        
        await loadChats();
        setCurrentChat(newChat);
        
        if (newChat.messages) {
          setMessages(newChat.messages);
        } else {
          await loadMessages(newChat.id);
        }
      } else {
        const response = await sendMessage(currentChat.id, { content: messageContent });
        
        if (response.data && Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          await loadMessages(currentChat.id);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setInputMessage(messageContent);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    navigate('/chats/new');
  };

  const handleChatSelect = (chat) => {
    navigate(`/chats/${chat.id}`);
  };

  const logout = () => {
    handleLogout();
    navigate('/');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-home">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Chatty</h2>
          <button className="new-chat-btn" onClick={handleNewChat}>
            + New Chat
          </button>
        </div>

        <div className="chats-container">
          {chats.length === 0 ? (
            <div className="no-chats">
              <div className="no-chats-icon">💭</div>
              <p>No chats yet</p>
              <p className="no-chats-subtitle">
                Start a conversation to see your chats here
              </p>
            </div>
          ) : (
            chats.map((chat, index) => (
              <div 
                key={chat.id} 
                className={`chat-item ${chatId === chat.id.toString() ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="chat-title">{chat.title || 'Untitled Chat'}</div>
                <div className="chat-preview">
                  {chat.messages && chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1].content.substring(0, 50) + '...'
                    : 'No messages yet'
                  }
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <button className="footer-btn profile-btn" onClick={() => setProfileModalOpen(true)}>
            <Person4TwoTone/> 
            Profile
          </button>
          <button className="footer-btn logout-btn" onClick={() => setLogoutConfirmationModal(true)}>
            <LogoutRounded />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {currentChat && (
          <div className="chat-header">
            <h3 className="chat-header-title">{currentChat.title || 'Chat'}</h3>
          </div>
        )}

        <div className="chat-area">
          {!currentChat || chatId === 'new' ? (
            <div className="welcome-screen">
              <div className="welcome-icon">🤖</div>
              <h1 className="welcome-title">Welcome to Chatty!</h1>
              <p className="welcome-subtitle">
                Start a conversation with your AI companion. Ask questions, get help, or just chat about anything you'd like to know!
              </p>
            </div>
          ) : (
            <div className="messages-container">
              {loading ? (
                <div className="loading-messages">
                  Loading messages...
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div>{message.content}</div>
                    <div className="message-time">
                      {message.createdAt 
                        ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''
                      }
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              className="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              onKeyPress={handleKeyPress}
              rows={1}
              disabled={isTyping}
            />
            <button 
              className="send-btn" 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
            >
              {isTyping ? '⏳' : <Send />}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        open={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal 
        open={logoutConfirmationModal} 
        onClose={() => setLogoutConfirmationModal(false)} 
        onConfirm={logout}
      />
    </div>
  );
}