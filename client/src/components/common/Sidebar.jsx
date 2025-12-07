import Button from '../ui/Button';
import { Home, BarChart3, Filter, Calendar, Settings, DollarSign, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Filter, label: 'Categories', href: '/categories' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: DollarSign, label: 'Budget', href: '/budget' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 bg-white shadow-2xl w-64`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
        </div>
        <button onClick={onClose} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        {menuItems.map((item, index) => (
          <Button key={index} variant="ghost" size="lg" className="w-full justify-start text-left h-14 px-4 rounded-xl hover:bg-primary-50 hover:text-primary-700 font-medium transition-all duration-200">
            <item.icon className="w-5 h-5 mr-3 shrink-0" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
          <p className="text-sm text-gray-600 mb-2">Upgrade to Pro</p>
          <Button size="sm" className="w-full">Get Pro</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
