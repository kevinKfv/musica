import React, { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { AppLayout } from './components/layout/AppLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MfaVerificationPage from './pages/auth/MfaVerificationPage';

// Home & Profile
import { DashboardPage } from './pages/home/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';

// Modules
import CalendarPage from './pages/agenda/CalendarPage';
import LibraryPage from './pages/library/LibraryPage';
import { MarketplaceHome } from './pages/marketplace/MarketplaceHome';
import { PublishService } from './pages/marketplace/PublishService';
import { ServiceDetails } from './pages/marketplace/ServiceDetails';
import { EventsHome } from './pages/events/EventsHome';
import { CreateEvent } from './pages/events/CreateEvent';
import { EventDetails } from './pages/events/EventDetails';
import { EventCheckIn } from './pages/events/EventCheckIn';
import { AcademyHome } from './pages/academy/AcademyHome';
import { CreateCourse } from './pages/academy/CreateCourse';
import { CourseDetails } from './pages/academy/CourseDetails';
import { CourseLearning } from './pages/academy/CourseLearning';
import { ChatHome } from './pages/chat/ChatHome';
import SocialFeed from './pages/social/SocialFeed';
import PostDetailPage from './pages/social/PostDetailPage';
import { CollabHome } from './pages/collab/CollabHome';
import { VirtualStudio } from './pages/collab/VirtualStudio';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MapPage } from './pages/places/MapPage';

function RequireAuth({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore(state => state.accessToken);
  if (!accessToken) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public ── */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/mfa" element={<MfaVerificationPage />} />

        {/* ── Protected — wrapped in AppLayout ── */}
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index                          element={<DashboardPage />} />
          <Route path="profile"                 element={<ProfilePage />} />
          <Route path="agenda"                  element={<CalendarPage />} />

          <Route path="library"                 element={<LibraryPage />} />

          <Route path="marketplace"             element={<MarketplaceHome />} />
          <Route path="marketplace/publish"     element={<PublishService />} />
          <Route path="marketplace/service/:id" element={<ServiceDetails />} />

          <Route path="events"                  element={<EventsHome />} />
          <Route path="events/create"           element={<CreateEvent />} />
          <Route path="events/checkin"          element={<EventCheckIn />} />
          <Route path="events/:id"              element={<EventDetails />} />

          <Route path="academy"                 element={<AcademyHome />} />
          <Route path="academy/create"          element={<CreateCourse />} />
          <Route path="academy/:id"             element={<CourseDetails />} />
          <Route path="academy/:id/learn"       element={<CourseLearning />} />

          <Route path="chat"                    element={<ChatHome />} />

          <Route path="social"                  element={<SocialFeed />} />
          <Route path="social/:postId"          element={<PostDetailPage />} />

          <Route path="collab"                  element={<CollabHome />} />
          <Route path="collab/:id"              element={<VirtualStudio />} />

          <Route path="admin"                   element={<AdminDashboard />} />
          <Route path="places"                  element={<MapPage />} />
        </Route>

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
