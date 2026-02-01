import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
}

export default App;
