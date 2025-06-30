import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchWithAuth } from '../api';
import { API_BASE_URL } from '../api';
import { useNotifications } from '../hooks/useNotifications';
import { normalizeShopDomain } from '../utils/normalizeShopDomain';
import { 
  Button, 
  TextField, 
  Typography, 
  Box, 
  Container, 
  Alert,
  Card,
  CardContent,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Fade,
  Stack,
  Grid
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  CloudSync as CloudSyncIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon,
  Storefront as StorefrontIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';


const features = [
  { icon: <TrendingUpIcon />, text: 'Track up to 10 competitors with intelligent monitoring' },
  { icon: <NotificationsIcon />, text: 'Real-time price monitoring with intelligent alerts' },
  { icon: <AnalyticsIcon />, text: '7 advanced chart types (Area, Bar, Candlestick, etc.)' },
  { icon: <SecurityIcon />, text: 'Multi-session concurrent access from any device' },
  { icon: <CloudSyncIcon />, text: 'Session-based notification system with privacy controls' },
  { icon: <BusinessIcon />, text: 'Automated alerts via Email & SMS with smart delivery' },
  { icon: <SpeedIcon />, text: 'Advanced analytics dashboard with intelligent caching' },
  { icon: <CheckCircleIcon />, text: 'AI-powered market intelligence and discovery tools' },
];

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(12, 2),
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.primary.contrastText,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 2),
  },
}));

const FeatureGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing(4),
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const ConnectForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
}));

const HomePage = () => {
  const [shopDomain, setShopDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  
  const { isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useNotifications();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // OAuth flow and error handling
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const shopFromUrl = urlParams.get('shop');
    const errorFromUrl = urlParams.get('error');
    const errorMsgFromUrl = urlParams.get('error_message');

    if (shopFromUrl && !authLoading) {
      // AuthContext will handle the redirect, just wait.
      return;
    }

    if (errorFromUrl && errorMsgFromUrl) {
      setErrorCode(errorFromUrl);
      const decodedError = decodeURIComponent(errorMsgFromUrl);
      setErrorMessage(decodedError);
      notifications.showError(decodedError, { persistent: true, category: 'Connection' });
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location.search, authLoading, notifications]);
  
  // Navigation after authentication
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const urlParams = new URLSearchParams(location.search);
      const redirectPath = urlParams.get('redirect');
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, authLoading, navigate, location.search]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = normalizeShopDomain(shopDomain);
    if (!cleanDomain) {
      notifications.showError('Please enter a valid Shopify store URL or name.', { category: 'Validation' });
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const returnUrl = encodeURIComponent(`${window.location.origin}/dashboard?connected=true`);
      notifications.showInfo('Connecting to Shopify...', { duration: 2000 });
      window.location.href = `${API_BASE_URL}/api/auth/shopify/login?shop=${encodeURIComponent(cleanDomain)}&return_url=${returnUrl}`;
    } catch (error) {
      console.error('Login failed:', error);
      notifications.showError('Failed to connect to Shopify. Please try again.', { persistent: true });
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Fade in={true} timeout={1000}>
            <Typography variant={isMobile ? 'h3' : 'h1'} component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Enterprise Analytics for Shopify
            </Typography>
          </Fade>
          <Fade in={true} timeout={1500}>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ mb: 4 }}>
              Unlock real-time insights, multi-session support, and automated market intelligence.
            </Typography>
          </Fade>
          
          <ConnectForm onSubmit={handleLogin}>
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 1 }}>
              Connect Your Store
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              label="Enter your .myshopify.com domain"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <StorefrontIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />

            {errorMessage && (
              <Alert severity="error" onClose={() => setErrorMessage('')}>
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              fullWidth
              endIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <ArrowForwardIcon />}
            >
              {isLoading ? 'Connecting...' : 'Connect with Shopify'}
            </Button>
             <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Chip label="$19.99/month after 3-day free trial" color="secondary" />
            </Box>
          </ConnectForm>
        </Container>
      </HeroSection>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Why ShopGauge?
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ maxWidth: '700px', margin: '0 auto', mb: 4 }}>
            Go beyond standard analytics. ShopGauge provides enterprise-level tools to give you a competitive edge.
          </Typography>
          <FeatureGrid>
            {features.map(({ icon, text }, index) => (
              <Fade in={true} timeout={500 * (index + 1)} key={text}>
                <FeatureCard>
                  <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                    {icon}
                  </Avatar>
                  <Typography variant="body1">{text}</Typography>
                </FeatureCard>
              </Fade>
            ))}
          </FeatureGrid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
