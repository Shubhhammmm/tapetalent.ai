import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weather Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Real-time weather insights</p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user.name}
                </span>
              </div>
            )}
            <button
              onClick={onOpenSettings}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={signOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
