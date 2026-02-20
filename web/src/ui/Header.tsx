import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuth } from '../state/useAuth';
import SearchBar from './SearchBar';
import { useState, useEffect } from 'react';

function Header() {
  const { user, token, logout, setFavorites } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm transition group-hover:scale-105">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900">Micro Marketplace</span>
        </Link>

        {token && <SearchBar token={token} setFavorites={setFavorites} />}

        <div className="ml-auto flex items-center gap-3">
          {token ? (
            <>
              <span className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-slate-600 sm:inline-flex">
                <User className="h-3.5 w-3.5" />
                {user?.name}
              </span>
              <div className="flex items-center gap-1.5" title={isOnline ? 'Online' : 'Offline'}>
                <span className="relative flex h-2.5 w-2.5">
                  {isOnline && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></span>
                </span>
                <span className="text-xs font-medium text-slate-600">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-stone-400 hover:text-slate-900"
                >
                  Login
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link
                  to="/register"
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      </header>
    </>
  );
}

export default Header;
