import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Menu, X, Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ExpenseTracker
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Dashboard</Link>
            <Link to="/reports" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Reports</Link>
            <Link to="/budget" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Budget</Link>
            <div className="flex items-center space-x-2 ml-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <Button onClick={handleLogout} variant="secondary" size="sm" className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMobileOpen(false)}>
                Dashboard
              </Link>
              <Link to="/reports" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMobileOpen(false)}>
                Reports
              </Link>
              <Link to="/budget" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50" onClick={() => setIsMobileOpen(false)}>
                Budget
              </Link>
              <Button onClick={handleLogout} variant="danger" size="sm" className="w-full mt-2 flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
