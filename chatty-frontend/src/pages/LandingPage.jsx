import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Modal, 
  Paper,
  TextField,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  IconButton,
  Fade,
  Slide,
  Backdrop
} from '@mui/material';
import { 
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
  Chat as ChatIcon,
  Rocket as RocketIcon,
  Person3Rounded,
  LogoutOutlined
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useAuth } from '../context/AuthContext';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(85, 108, 214, 0.3); }
  50% { box-shadow: 0 0 30px rgba(85, 108, 214, 0.6); }
`;

const slideInLeft = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-50px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const slideInRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(50px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 6 }, (_, i) => (
    <Box
      key={i}
      sx={{
        position: 'absolute',
        width: { xs: 8, md: 12 },
        height: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, #556cd6, #19857b)`,
        borderRadius: '50%',
        opacity: 0.6,
        animation: `${float} ${3 + i * 0.5}s ease-in-out infinite`,
        top: `${20 + i * 15}%`,
        right: `${10 + i * 8}%`,
        animationDelay: `${i * 0.2}s`
      }}
    />
  ));
  
  return <>{particles}</>;
};

const RedirectModal = ({ open }) => {
  const { user, han } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <Modal
      open={open}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        },
      }}
    >
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '80%', sm: 400 },
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            animation: `${glow} 2s ease-in-out infinite alternate`
          }}
        >
          <Person3Rounded sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            You are currently logged in as 
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}
            fontStyle="italic"
            >
            {user.email}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogout}
              sx={{
                py: 1,
                px: 3,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderColor: '#fff',
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: '#fff',
                  animation: `${pulse} 0.3s ease-in-out`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <LogoutOutlined sx={{ mr: 1 }} />
              Logout
            </Button>
            <Button
              variant="contained"
              color="secondary"
              href="/chats"
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1,
                px: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
                color: '#fff',
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff5252, #ffcc02)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(255, 107, 107, 0.6)',
                  animation: `${pulse} 0.3s ease-in-out`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <ChatIcon sx={{ mr: 1 }} />
              Go to Home Page
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

// Auth Modal Component
const AuthModal = ({ open, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { handleLogin, handleSignup } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (activeTab === 1 && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrors({});
    setLoading(true);

    const result = activeTab === 0
      ? await handleLogin(formData)
      : await handleSignup(formData);
    

    setLoading(false);
    
    if (!result.success) {
        setErrors({ general: result.message });
        return;
    }

    onClose();
    navigate('/chats');
    onSuccess(activeTab === 0 ? 'login' : 'signup');
  };

  return (
    <Modal
      className='auth-modal'
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        },
      }}
    >
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 450 },
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 0,
            animation: `${glow} 2s ease-in-out infinite alternate`
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            pb: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px 12px 0 0'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold" color="primary">
                {activeTab === 0 ? 'Welcome Back!' : 'Join Chatty'}
              </Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{ mt: 2 }}
              variant="fullWidth"
            >
              <Tab 
                icon={<LoginIcon />} 
                label="Login" 
                iconPosition="start"
              />
              <Tab 
                icon={<SignUpIcon />} 
                label="Sign Up" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Form */}
          <Box sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                variant="outlined"
                sx={{ mb: 2 }
                }
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                sx={{ mb: 3 }}
              />
                {errors.general && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.general}
                    </Alert>
                )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #556cd6, #19857b)',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4a5fc7, #167368)',
                    animation: `${pulse} 0.3s ease-in-out`
                  }
                }}
                
              >
                {loading ? 'Processing...' : (activeTab === 0 ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAuthSuccess = (type) => {
    const message = type === 'login' 
      ? '🎉 Welcome back! Login successful!' 
      : '🚀 Account created successfully! Welcome to Chatty!';
    
    setSnackbar({ 
      open: true, 
      message, 
      severity: 'success' 
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(85, 108, 214, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(25, 133, 123, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
          `,
        }}
      />
      
      <FloatingParticles />

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 6, md: 8 },
            py: { xs: 8, md: 12 }
          }}
        >
          {/* Left Content */}
          <Slide direction="right" in={isVisible} timeout={800}>
            <Box
              sx={{
                flex: 1,
                maxWidth: { xs: '100%', md: '600px' },
                animation: `${slideInLeft} 1s ease-out`,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  mb: 2,
                  lineHeight: 1.1
                }}
              >
                Welcome to
                <br />
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(45deg, #ffd54f, #ff8a65)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative'
                  }}
                >
                  CHATTY
                  <ChatIcon 
                    sx={{ 
                      fontSize: { xs: '2rem', md: '3rem' }, 
                      ml: 2,
                      color: '#ffd54f',
                      animation: `${float} 3s ease-in-out infinite`
                    }} 
                  />
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  lineHeight: 1.6,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                Your personal AI-powered chat companion. Connect, communicate, 
                and take your conversations to the next level with intelligent responses.
              </Typography>

              <div>
                { user ? (
                    
                    <RedirectModal open={true} />
                    
                ) : (
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        <Button
                        variant="contained"
                        size="large"
                        onClick={() => setModalOpen(true)}
                        endIcon={<RocketIcon />}
                        sx={{
                            py: 2,
                            px: 4,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
                            color: '#fff',
                            borderRadius: 3,
                            textTransform: 'none',
                            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
                            '&:hover': {
                            background: 'linear-gradient(45deg, #ff5252, #ffcc02)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(255, 107, 107, 0.6)',
                            animation: `${pulse} 0.3s ease-in-out`
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        >
                        Get Started
                        </Button>
                    </Box>
                )}
              </div>
            </Box>
          </Slide>

          {/* Right Illustration */}
          <Slide direction="left" in={isVisible} timeout={1000}>
            <Box
              sx={{
                flex: 1,
                maxWidth: { xs: '100%', md: '500px' },
                animation: `${slideInRight} 1s ease-out`,
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 400 },
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `${float} 4s ease-in-out infinite`
                }}
              >
                {/* Chat Bubbles Animation */}
                <Box sx={{ position: 'relative', width: '80%', height: '80%' }}>
                  {[1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        width: { xs: 60, md: 80 },
                        height: { xs: 40, md: 50 },
                        background: i % 2 === 0 
                          ? 'linear-gradient(45deg, #556cd6, #667eea)' 
                          : 'linear-gradient(45deg, #19857b, #4caf50)',
                        borderRadius: '20px 20px 20px 5px',
                        top: `${20 + i * 25}%`,
                        left: i % 2 === 0 ? '10%' : '50%',
                        animation: `${float} ${2 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                      }}
                    />
                  ))}
                  
                  <ChatIcon
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: { xs: '4rem', md: '6rem' },
                      color: 'rgba(255,255,255,0.3)',
                      animation: `${pulse} 2s ease-in-out infinite`
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Slide>
        </Box>
      </Container>

      {/* Auth Modal */}
      <AuthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            minWidth: 300,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
