import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { useAuthStore } from './store/useAuthStore';
import { LogOut, Calendar, Library, Briefcase, Ticket, BookOpen, MessageSquare, Globe } from 'lucide-react';
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
import { Link } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore(state => state.accessToken);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function Dashboard() {
  const { user, logout } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-neutral-800 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">BandHub</h1>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Hola, <span className="text-white font-medium">{user?.email}</span></span>
            <button 
              onClick={logout}
              className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg transition-colors text-neutral-300"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        <main>
          <div className="bg-neutral-800 border border-neutral-700/50 p-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">¡Bienvenido al Dashboard!</h2>
            <p className="text-neutral-400">Has iniciado sesión correctamente usando el sistema de seguridad Zero-Trust. Tu Access Token JWT está seguro en memoria.</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/agenda" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Calendar className="w-10 h-10 mb-2 text-purple-400" />
                <h3 className="font-semibold text-lg">Agenda y Calendario</h3>
                <p className="text-sm text-neutral-400 mt-1">Gestiona tus ensayos, conciertos y eventos.</p>
              </Link>
              
              <Link to="/library" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Library className="w-10 h-10 mb-2 text-pink-400" />
                <h3 className="font-semibold text-lg">Biblioteca Musical</h3>
                <p className="text-sm text-neutral-400 mt-1">Partituras, backing tracks y recursos.</p>
              </Link>
              
              <Link to="/marketplace" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Briefcase className="w-10 h-10 mb-2 text-emerald-400" />
                <h3 className="font-semibold text-lg">Marketplace</h3>
                <p className="text-sm text-neutral-400 mt-1">Contrata profesionales para tus proyectos.</p>
              </Link>
              
              <Link to="/events" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Ticket className="w-10 h-10 mb-2 text-orange-400" />
                <h3 className="font-semibold text-lg">Eventos & Tickets</h3>
                <p className="text-sm text-neutral-400 mt-1">Descubre conciertos y compra entradas.</p>
              </Link>
              
              <Link to="/academy" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <BookOpen className="w-10 h-10 mb-2 text-blue-400" />
                <h3 className="font-semibold text-lg">Academia Musical</h3>
                <p className="text-sm text-neutral-400 mt-1">Aprende con cursos y lecciones interactivos.</p>
              </Link>
              
              <Link to="/chat" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-10 h-10 mb-2 text-indigo-400" />
                <h3 className="font-semibold text-lg">Mensajes</h3>
                <p className="text-sm text-neutral-400 mt-1">Chatea en tiempo real con otros usuarios y tu banda.</p>
              </Link>
              
              <Link to="/social" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Globe className="w-10 h-10 mb-2 text-cyan-400" />
                <h3 className="font-semibold text-lg">Red Social</h3>
                <p className="text-sm text-neutral-400 mt-1">Feed de actividad, comparte y descubre músicos.</p>
              </Link>

              <Link to="/collab" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Globe className="w-10 h-10 mb-2 text-yellow-400" />
                <h3 className="font-semibold text-lg">Estudio Virtual</h3>
                <p className="text-sm text-neutral-400 mt-1">Colabora multipista con stems y timestamps.</p>
              </Link>
              
              <Link to="/places" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Globe className="w-10 h-10 mb-2 text-teal-400" />
                <h3 className="font-semibold text-lg">Mapa de Lugares</h3>
                <p className="text-sm text-neutral-400 mt-1">Encuentra bares para tocar, estudios y salas de ensayo.</p>
              </Link>
              
              <Link to="/admin" className="bg-neutral-700 hover:bg-neutral-600 transition p-6 rounded-xl flex flex-col items-center justify-center text-center col-span-1 md:col-span-2 border-2 border-red-500/20 hover:border-red-500/50">
                <Globe className="w-10 h-10 mb-2 text-red-500" />
                <h3 className="font-semibold text-lg text-red-500">Panel de Administración</h3>
                <p className="text-sm text-neutral-400 mt-1">Gestión de la plataforma y moderación.</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agenda" 
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/library" 
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute>
              <MarketplaceHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/marketplace/publish" 
          element={
            <ProtectedRoute>
              <PublishService />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/marketplace/service/:id" 
          element={
            <ProtectedRoute>
              <ServiceDetails />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/events" 
          element={
            <ProtectedRoute>
              <EventsHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/events/create" 
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/events/:id" 
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/events/checkin" 
          element={
            <ProtectedRoute>
              <EventCheckIn />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/academy" 
          element={
            <ProtectedRoute>
              <AcademyHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/academy/create" 
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/academy/:id" 
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/academy/:id/learn" 
          element={
            <ProtectedRoute>
              <CourseLearning />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/social" 
          element={
            <ProtectedRoute>
              <SocialFeed />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/social/:postId" 
          element={
            <ProtectedRoute>
              <PostDetailPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/collab" 
          element={
            <ProtectedRoute>
              <CollabHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/collab/:id" 
          element={
            <ProtectedRoute>
              <VirtualStudio />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/places" 
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
