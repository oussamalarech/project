import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/admin" className="text-xl font-semibold text-stone-800">
            Admin Panel
          </Link>
          <Link
            to="/"
            className="text-stone-600 hover:text-stone-900 text-sm"
          >
            Back to Store
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="flex gap-6 mb-8 border-b border-stone-200 pb-4">
          <Link
            to="/admin"
            end
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/admin/orders"
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            Orders
          </Link>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
