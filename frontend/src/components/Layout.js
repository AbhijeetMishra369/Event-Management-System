import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Event as EventIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ConfirmationNumber as TicketIcon,
  QrCodeScanner as ScannerIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleUserMenuClose();
    setMobileDrawerOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Events', path: '/events', icon: <EventIcon /> },
    { label: 'Dashboard', path: '/dashboard', protected: true, icon: <DashboardIcon /> },
    { label: 'Create Event', path: '/create-event', protected: true, icon: <AddIcon /> },
    { label: 'My Tickets', path: '/my-tickets', protected: true, icon: <TicketIcon /> },
    { label: 'Validate Tickets', path: '/validate-tickets', protected: true, icon: <ScannerIcon /> },
    { label: 'Sales', path: '/organizer/sales', protected: true, icon: <DashboardIcon /> },
    { label: 'Attendees', path: '/organizer/attendees', protected: true, icon: <DashboardIcon /> },
  ];

  const renderNavItems = () => {
    return navItems.map((item) => {
      if (item.protected && !isAuthenticated) return null;
      return (
        <Button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          startIcon={item.icon}
          sx={{
            color: isActive(item.path) ? 'primary.main' : 'text.primary',
            fontWeight: isActive(item.path) ? 600 : 400,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          {item.label}
        </Button>
      );
    });
  };

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            EventHub
          </Typography>
        </Box>
        
        {isAuthenticated && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <List>
          {navItems.map((item) => {
            if (item.protected && !isAuthenticated) return null;
            return (
              <ListItem
                key={item.path}
                button
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            );
          })}
        </List>

        {isAuthenticated && (
          <>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem button onClick={() => { handleNavigation('/profile'); setMobileDrawerOpen(false); }}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={() => { handleNavigation('/settings'); setMobileDrawerOpen(false); }}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          backgroundColor: 'white', 
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open mobile menu"
                onClick={() => setMobileDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                mr: 4,
              }}
              onClick={() => navigate('/')}
            >
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                EventHub
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                {renderNavItems()}
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search Button */}
              <Tooltip title="Search Events">
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/events')}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              {isAuthenticated && (
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Account">
                    <IconButton onClick={handleUserMenuOpen}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {user?.firstName?.charAt(0) || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    color="inherit"
                    onClick={() => navigate('/login')}
                    sx={{ textTransform: 'none' }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{ textTransform: 'none' }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      {renderMobileDrawer()}

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <MenuItem onClick={() => { handleNavigation('/profile'); handleUserMenuClose(); }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleNavigation('/settings'); handleUserMenuClose(); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          mt: 'auto',
          backgroundColor: 'grey.50',
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                EventHub
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              © 2024 EventHub. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;