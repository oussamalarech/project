import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header className="bg-white sticky top-0 z-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-stone-800">
            Phone Store
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-stone-600 hover:text-stone-900 transition-colors"
            >
              Store
            </Link>
            <Link
              to="/cart"
              className="text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              Cart
              {totalItems > 0 && (
                <span className="bg-stone-800 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Admin
                  </Link> 
                )}
                <span className="text-stone-500 text-sm">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-stone-600 hover:text-stone-900 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-stone-500 text-sm">
          Phone Store &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
