import { 
  Heart, 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  User, 
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar= ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const { user, logout } = useAuth();
  
  const doctorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const patientMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'book-appointment', label: 'Book Appointment', icon: Plus },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
  ];

  const menuItems = user?.role === 'doctor' ? doctorMenuItems : patientMenuItems;
  const themeColors = user?.role === 'doctor' 
    ? 'from-blue-600 to-green-600' 
    : 'from-purple-600 to-orange-600';

  return (
    <div className={`bg-white shadow-lg border-r  border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className={`bg-gradient-to-r ${themeColors} p-2 rounded-xl`}>
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Clinix Sphere</h1>
                <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${themeColors} rounded-full flex items-center justify-center`}>
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              {user?.role === 'doctor' && user?.specialization && (
                <p className="text-xs text-blue-600 truncate">{user.specialization}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const activeColors = user?.role === 'doctor' 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-purple-50 text-purple-700 border-purple-200';
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 border ${
                    isActive
                      ? activeColors
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;