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
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
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
  Dashboard as DashboardIcon,
  SwapHoriz as SwapHorizIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  Group as GroupIcon,
  Shield as ShieldIcon,
  Psychology as IntelligenceIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const detailedFeatures = [
  'Track up to 10 competitors with intelligent monitoring',
  'Real-time price monitoring with intelligent alerts',
  '7 advanced chart types (Area, Bar, Candlestick, Waterfall, etc.)',
  'Multi-session concurrent access from any device',
  'Session-based notification system with privacy controls',
  'Automated alerts via Email & SMS with smart delivery',
  'Advanced analytics dashboard with intelligent caching',
  'AI-powered market intelligence and discovery tools',
  'Comprehensive admin dashboard with audit logging',
  'Enhanced security with session isolation',
  'Full Shopify integration with real-time sync',
  'Data export capabilities with GDPR/CCPA compliance',
  'Priority support with dedicated assistance',
  'Enterprise-grade session management',
  'Advanced debugging and monitoring tools',
  'Debounced refresh controls for optimal performance'
];

const featureCategories = [
  {
    icon: <AnalyticsIcon />,
    title: 'Advanced Analytics',
    color: 'primary' as const,
    features: [
      '7 chart types (Area, Bar, Candlestick, Waterfall)',
      'Real-time data with intelligent caching',
      'Revenue trend analysis & forecasting',
      'Performance metrics dashboard'
    ]
  },
  {
    icon: <GroupIcon />,
    title: 'Multi-Session Support',
    color: 'success' as const,
    features: [
      'Concurrent access from multiple devices',
      'Session-based notification privacy',
      'Team collaboration without conflicts',
      'Secure session isolation & management'
    ]
  },
  {
    icon: <IntelligenceIcon />,
    title: 'Market Intelligence',
    color: 'warning' as const,
    features: [
      'AI-powered market discovery & analysis',
      'Real-time price monitoring & alerts',
      'Strategic positioning insights',
      'Track up to 10 competitors per store'
    ]
  },
  {
    icon: <ShieldIcon />,
    title: 'Enterprise Security',
    color: 'secondary' as const,
    features: [
      'Comprehensive audit logging',
      'GDPR/CCPA compliance built-in',
      'Admin dashboard with full control',
      'Advanced debugging & monitoring'
    ]
  }
];

const testimonials = [
  {
    text: "ShopGauge's multi-session support lets my team work simultaneously from different locations. The advanced charts show trends we never saw before!",
    author: "Alex, DTC Brand Owner",
    metric: "Revenue increased 25% in 3 months",
    color: 'primary' as const
  },
  {
    text: "The session-based notifications are brilliant! No more mixed alerts between team members. The waterfall charts reveal our growth patterns perfectly.",
    author: "Priya, Shopify Merchant",
    metric: "Improved team efficiency by 40%",
    color: 'success' as const
  },
  {
    text: "The admin dashboard with audit logging gives us complete visibility. GDPR compliance made easy with comprehensive session management.",
    author: "Marcus, E-commerce Director",
    metric: "Enterprise-grade security & compliance",
    color: 'secondary' as const
  }
];

const faqs = [
  {
    question: 'How does the 3-day free trial work?',
    answer: 'Start with our 3-day free trial to explore all features including multi-session support, advanced charts, and notification system. No credit card required. Full access to enterprise-grade features.'
  },
  {
    question: 'What makes your analytics different?',
    answer: 'We offer 7 advanced chart types (Area, Bar, Candlestick, Waterfall, etc.) with intelligent caching, real-time updates, and session-based data isolation for team collaboration.'
  },
  {
    question: 'How does multi-session support work?',
    answer: 'Multiple team members can access your shop simultaneously from different devices/browsers. Each session is isolated with private notifications and secure session management.'
  },
  {
    question: 'Is my data secure and compliant?',
    answer: 'Yes! We provide enterprise-grade security with audit logging, GDPR/CCPA compliance, session isolation, and comprehensive admin controls for complete data protection.'
  },
  {
    question: 'What happens after my free trial?',
    answer: "After your 3-day free trial, you'll be automatically enrolled in our Pro plan at $19.99/month. You can cancel anytime with no commitment. All your data, sessions, and configurations are preserved."
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and enterprise billing options. All transactions are processed securely with industry-standard encryption and audit trails.'
  }
];

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

const PricingBanner = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  margin: theme.spacing(4, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  }
}));

const FeatureGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
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
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[4],
}));

const ConnectedBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 4),
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[4],
}));

const HomePage = () => {
  const [shopDomain, setShopDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [showConnectForm, setShowConnectForm] = useState(false);
  
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
      console.log('HomePage: Detected OAuth callback, shop will be processed by AuthContext');
      return;
    }
    
    if (errorFromUrl && errorMsgFromUrl) {
      setErrorCode(errorFromUrl);
      const decodedError = decodeURIComponent(errorMsgFromUrl);
      setErrorMessage(decodedError);
      notifications.showError(decodedError, { persistent: true, category: 'Connection', duration: 8000 });
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      setShowConnectForm(false);
    }
  }, [location.search, authLoading, notifications]);

  // Navigation after authentication
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('HomePage: User authenticated, checking for redirect navigation');
      
      const urlParams = new URLSearchParams(location.search);
      const redirectPath = urlParams.get('redirect');
      const forceHome = urlParams.get('force') === 'true' || urlParams.get('view') === 'home';
      
      if (redirectPath) {
        console.log('HomePage: Found redirect parameter, navigating to:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else if (!forceHome) {
        console.log('HomePage: No redirect parameter and not forced to stay, navigating to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('HomePage: Forced to stay on home page, not redirecting');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('force');
        newUrl.searchParams.delete('view');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, [isAuthenticated, authLoading, navigate, location.pathname, location.search]);

  const clearAllDashboardCache = () => {
    sessionStorage.removeItem('dashboard_cache_v1.1');
    sessionStorage.removeItem('dashboard_cache_v2');
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.includes('dashboard_cache')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
    console.log('HomePage: Cleared all dashboard cache keys');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = normalizeShopDomain(shopDomain);
    if (!cleanDomain) {
      notifications.showError('Please enter a valid Shopify store URL or name', { category: 'Validation' });
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      clearAllDashboardCache();
      
      const baseUrl = `${window.location.origin}/dashboard`;
      const returnUrl = encodeURIComponent(`${baseUrl}?connected=true&skip_loading=true`);
      
      notifications.showInfo('Connecting to Shopify...', { category: 'Store Connection', duration: 2000 });
      
      window.location.href = `${API_BASE_URL}/api/auth/shopify/login?shop=${encodeURIComponent(cleanDomain)}&return_url=${returnUrl}`;
    } catch (error) {
      console.error('Login failed:', error);
      notifications.showError('Failed to connect to Shopify. Please try again.', { persistent: true, category: 'Connection' });
      setIsLoading(false);
    }
  };

  const handleSwitchStore = () => {
    setShowConnectForm(true);
    setShopDomain('');
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1, color: 'primary.main' }}>Connecting to Shopify...</Typography>
          <Typography color="text.secondary">Please wait while we redirect you to Shopify for authentication.</Typography>
        </Box>
      </Box>
    );
  }

  const showAuthConnected = isAuthenticated && !authLoading;

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="md">
          <Fade in={true} timeout={1000}>
            <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              ShopGauge
            </Typography>
          </Fade>
          <Fade in={true} timeout={1500}>
            <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
              Enterprise-grade analytics platform with multi-session support, 7 advanced chart types, and intelligent notifications.
              Empower your team with concurrent access, comprehensive audit logging, and GDPR-compliant data management.
              Transform your Shopify store with real-time insights and automated market intelligence.
            </Typography>
          </Fade>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        {/* Error Display */}
        {errorMessage && (
          <Alert 
            severity="error" 
            onClose={() => setErrorMessage('')}
            sx={{ mt: 4, mb: 2 }}
          >
            <Typography variant="h6" gutterBottom>
              {errorCode === 'code_used' ? 'Authorization Link Expired' : 'Connection Error'}
            </Typography>
            {errorMessage}
          </Alert>
        )}

        {/* Pricing Banner */}
        <PricingBanner elevation={8}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            🚀 Limited Time Offer
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Start your 3-day free trial today and unlock enterprise-grade analytics!
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              $19.99/month
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              after 3-day free trial
            </Typography>
          </Box>

          {/* Connection Section */}
          {showAuthConnected ? (
            showConnectForm ? (
              <ConnectForm onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Enter your store name or full URL"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: <StorefrontIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading || !normalizeShopDomain(shopDomain)}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <StorefrontIcon />}
                >
                  {isLoading ? 'Connecting...' : 'Connect Store'}
                </Button>
              </ConnectForm>
            ) : (
              <Box>
                <ConnectedBadge>
                  <CheckCircleIcon />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Successfully Connected!</Typography>
                    <Typography variant="body2">Your store is ready for analytics</Typography>
                  </Box>
                </ConnectedBadge>
                <Stack direction={isMobile ? 'column' : 'row'} spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/dashboard')}
                    startIcon={<DashboardIcon />}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'primary.main', '&:hover': { bgcolor: 'white' } }}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleSwitchStore}
                    startIcon={<SwapHorizIcon />}
                    sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    Switch Store
                  </Button>
                </Stack>
              </Box>
            )
          ) : (
            showConnectForm ? (
              <ConnectForm onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Enter your store name or full URL"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: <StorefrontIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading || !normalizeShopDomain(shopDomain)}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <StorefrontIcon />}
                >
                  {isLoading ? 'Connecting...' : 'Connect Store'}
                </Button>
              </ConnectForm>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowConnectForm(true)}
                startIcon={<StorefrontIcon />}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.9)', 
                  color: 'primary.main', 
                  px: 4, 
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': { 
                    bgcolor: 'white',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Connect Store
              </Button>
            )
          )}
          
          <Typography variant="body2" sx={{ mt: 3, opacity: 0.9 }}>
            No credit card required • Cancel anytime
          </Typography>
        </PricingBanner>

        {/* Feature Categories */}
        <Box sx={{ my: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Enterprise-Grade Analytics Platform
          </Typography>
          <FeatureGrid>
            {featureCategories.map((category, index) => (
              <Fade in={true} timeout={500 * (index + 1)} key={category.title}>
                <CategoryCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${category.color}.main`, mr: 2 }}>
                      {category.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {category.title}
                    </Typography>
                  </Box>
                  <List dense>
                    {category.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon color={category.color} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CategoryCard>
              </Fade>
            ))}
          </FeatureGrid>
        </Box>

        {/* Complete Feature List */}
        <Paper sx={{ p: 4, mb: 8 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Complete Feature Set
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
            mt: 4
          }}>
            {detailedFeatures.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', p: 1 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1, mt: 0.5, flexShrink: 0 }} />
                <Typography variant="body2">{feature}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Testimonials */}
        <Box sx={{ my: 8 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            What Merchants Say
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mt: 4
          }}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} sx={{ height: '100%', borderLeft: 4, borderColor: `${testimonial.color}.main` }}>
                <CardContent>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                    "{testimonial.text}"
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    — {testimonial.author}
                  </Typography>
                  <Chip 
                    label={testimonial.metric} 
                    size="small" 
                    color={testimonial.color}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ my: 8 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 4 }}>
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
