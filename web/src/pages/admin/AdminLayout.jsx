import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
//   { name: 'Categories', href: '/admin/categories', icon: TagIcon },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Inquiries', href: '/admin/inquiries', icon: ChatBubbleLeftRightIcon },
  { name: 'Reviews', href: '/admin/reviews', icon: StarIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#ebe9e1]">
      {/* Sidebar for mobile */}
      <div className={classNames(
        sidebarOpen ? 'fixed inset-0 z-40 md:hidden' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4">
            <img
              src="/models/RH_logo-removebg-preview.png"
              alt="Logo"
              className="h-10 w-10 rounded-full border-2 border-[#e43d12]"
            />
            <h1 className="ml-3 text-xl font-bold text-[#e43d12]">Admin Panel</h1>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href));
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-[#e43d12] text-white'
                        : 'text-gray-600 hover:bg-[#ebe9e1] hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-4 flex-shrink-0 h-6 w-6'
                      )}
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
              <img
                src="/models/RH_logo-removebg-preview.png"
                alt="Logo"
                className="h-10 w-10 rounded-full border-2 border-[#e43d12]"
              />
              <h1 className="ml-3 text-xl font-bold text-[#e43d12]">Admin Panel</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-white">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href !== '/admin' && location.pathname.startsWith(item.href));
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-[#e43d12] text-white'
                          : 'text-gray-600 hover:bg-[#ebe9e1] hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                      />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#e43d12] md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex items-center">
              <h2 className="text-2xl font-semibold text-[#e43d12]">
                Admin Dashboard
              </h2>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-[#e43d12] transition-colors font-medium"
              >
                Back to Store
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
                  <div className="h-10 w-10 rounded-full bg-[#e43d12] flex items-center justify-center border-2 border-[#ebe9e1]">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#ebe9e1] transition flex items-center gap-2"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-[#ebe9e1]">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
