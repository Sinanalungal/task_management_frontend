"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MessageSquare, Plus, Search, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

// Navigation items configuration
const navigationItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/dashboard/projects', label: 'Projects' },
  { path: '/dashboard/my-tasks', label: 'My Tasks' },
  { path: '/dashboard/calendar', label: 'Calendar' },
  { path: '/dashboard/messages', label: 'Messages' }
];

const mockProjects = [
  {
    id: 1,
    name: 'Design System',
    status: 'active',
    members: [
      { id: 1, avatar: '/api/placeholder/32/32', name: 'Alex Smith' },
      { id: 2, avatar: '/api/placeholder/32/32', name: 'Sarah Johnson' }
    ]
  },
  {
    id: 2,
    name: 'Marketing Website',
    status: 'pending',
    members: [
      { id: 3, avatar: '/api/placeholder/32/32', name: 'Mike Brown' },
      { id: 4, avatar: '/api/placeholder/32/32', name: 'Emma Wilson' }
    ]
  }
];

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Memoize current active route
  const activeRoute = useMemo(() => {
    return navigationItems.find(item => pathname.startsWith(item.path))?.path || '/dashboard';
  }, [pathname]);

  // Handle navigation
  const handleNavigation = useCallback((path) => {
    router.push(path);
    if (isMobile) setIsSidebarOpen(false);
  }, [router, isMobile]);

  // Handle project selection
  const handleProjectSelect = useCallback((project) => {
    setSelectedProject(project);
    router.push(`/dashboard/projects/${project.id}`);
    if (isMobile) setIsSidebarOpen(false);
  }, [router, isMobile]);

  // Window size effect
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const Sidebar = () => (
    <motion.div
      initial={isMobile ? { x: -300 } : { x: 0 }}
      animate={{ x: 0 }}
      exit={isMobile ? { x: -300 } : { x: 0 }}
      className={`${
        isMobile 
          ? 'fixed top-0 left-0 h-full z-50 bg-white shadow-lg w-72'
          : 'w-64 bg-white border-r border-gray-100'
      } flex flex-col`}
    >
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>
      )}

      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-1"
          onClick={() => handleNavigation('/dashboard')}
        >
          <img
            src="/taskifylogo.png"
            alt="Taskify Logo"
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl cursor-pointer"
          />
          <span className="font-bold font-poppins text-xl lg:text-2xl">Taskify</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <motion.div variants={containerVariants}  animate="visible">
        {navigationItems.map((item) => (
          <motion.button
            key={item.path}
            variants={itemVariants}
            whileHover={{ x: 5 }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 text-sm lg:text-base
              ${pathname === item.path ? 'bg-blue-50 text-blue-600' : pathname.startsWith(item.path) && item.path !== '/dashboard' ? 'hover:bg-gray-50' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}

        </motion.div>

        {/* Projects List */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-xs lg:text-sm font-semibold text-gray-500">Recent Projects</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 hover:bg-gray-100 rounded-lg"
              onClick={() => handleNavigation('/dashboard/projects/new')}
            >
              <Plus size={16} />
            </motion.button>
          </div>
          <AnimatePresence>
            {mockProjects.map((project) => (
              <motion.button
                key={project.id}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => handleProjectSelect(project)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-2
                  ${pathname === `/dashboard/projects/${project.id}` 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    project.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span className="font-medium">{project.name}</span>
                </div>
                <div className="flex -space-x-2">
                  {project.members.slice(0, 2).map(member => (
                    <div key={member.id} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={24}
                        height={24}
                      />
                    </div>
                  ))}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </nav>
    </motion.div>
  );

  const Header = useMemo(() => (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shadow-sm"
    >
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg mr-2"
        >
          <Menu size={20} />
        </button>
      )}

      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-[300px] lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm lg:text-base rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 rounded-xl relative"
        >
          <MessageSquare size={isMobile ? 18 : 20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2"
          >
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
              <Image
                src="/api/placeholder/32/32"
                alt="Profile"
                width={32}
                height={32}
              />
            </div>
            <ChevronDown size={16} className="text-gray-600 hidden lg:block" />
          </motion.button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
              >
                {[
                  { label: 'Profile', path: '/dashboard/profile' },
                  { label: 'Settings', path: '/dashboard/settings' },
                  { label: 'Log Out', path: '/logout' }
                ].map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      handleNavigation(item.path);
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm lg:text-base text-gray-700 hover:bg-gray-50"
                  >
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  ), [isMobile, searchQuery, userMenuOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen font-roboto bg-[#F8FAFC]"
    >
      <AnimatePresence>
        {isSidebarOpen && <Sidebar />}
      </AnimatePresence>

      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        {Header}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardLayout;