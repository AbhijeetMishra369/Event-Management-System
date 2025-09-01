import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Protected Pages
import Dashboard from './pages/Dashboard';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import MyTickets from './pages/MyTickets';
import TicketValidation from './pages/TicketValidation';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import OrganizerSales from './pages/OrganizerSales';
import OrganizerAttendees from './pages/OrganizerAttendees';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Layout>
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/create-event" element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/my-tickets" element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              } />
              <Route path="/validate-tickets" element={
                <ProtectedRoute>
                  <TicketValidation />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/organizer/sales" element={
                <ProtectedRoute>
                  <OrganizerSales />
                </ProtectedRoute>
              } />
              <Route path="/organizer/attendees" element={
                <ProtectedRoute>
                  <OrganizerAttendees />
                </ProtectedRoute>
              } />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;