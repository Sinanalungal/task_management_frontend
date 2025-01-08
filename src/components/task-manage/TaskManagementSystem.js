"use client"
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MessageSquare, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import ProjectSkeleton from '@/components/task-manage/ProjectSkeleton';
import ProjectView from '@/components/task-manage/ProjectView';
const mockProjects = [
  {
    id: 1,
    name: 'Design System',
    members: [
      { id: 1, avatar: '/api/placeholder/32/32', name: 'Alex Smith' },
      { id: 2, avatar: '/api/placeholder/32/32', name: 'Sarah Johnson' }
    ],
    tasks: [
      { 
        id: 1, 
        type: 'Figma',
        title: 'Update color system',
        status: 'in-progress',
        dueDate: '2024-01-15',
        assignees: [1, 2],
        attachments: ['design.fig', 'colors.jpg']
      },
      {
        id: 2,
        type: 'Development',
        title: 'Implement new components',
        status: 'todo',
        dueDate: '2024-01-20',
        assignees: [2],
        attachments: ['specs.docs']
      }
    ]
  },
  {
    id: 2,
    name: 'Marketing Website',
    members: [
      { id: 3, avatar: '/api/placeholder/32/32', name: 'Mike Brown' },
      { id: 4, avatar: '/api/placeholder/32/32', name: 'Emma Wilson' }
    ],
    tasks: [
      {
        id: 3,
        type: 'Content',
        title: 'Write homepage copy',
        status: 'completed',
        dueDate: '2024-01-10',
        assignees: [3],
        attachments: ['content.docx']
      }
    ]
  }
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};
const TaskManagementSystem = () => {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex h-screen font-roboto bg-[#F8FAFC]"
    >
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm"
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="flex items-center space-x-1"
      >
        {/* Replace the gradient div with an image */}
        <img 
          src="/taskifylogo.png" 
          alt="Taskify Logo" 
          className="w-10 h-10 rounded-xl"
        />
        <span className="font-bold font-poppins text-2xl">Taskify</span>
      </motion.div>
    </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {['Projects', 'My Tasks', 'Calendar', 'Messages'].map((item, index) => (
              <motion.button
                key={item}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 
                  ${activeView === item.toLowerCase() ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveView(item.toLowerCase())}
              >
                <span className="font-medium">{item}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Projects List */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-500">Recent Projects</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <Plus size={16} />
              </motion.button>
            </div>
            <AnimatePresence>
              {mockProjects.map((project, index) => (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-2
                    ${selectedProject?.id === project.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-50'}`}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm"
        >
          <div className="flex items-center flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks, projects, or team members..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-xl relative"
            >
              <MessageSquare size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
                  <Image
                    src="/api/placeholder/32/32"
                    alt="Profile"
                    width={32}
                    height={32}
                  />
                </div>
                <ChevronDown size={16} className="text-gray-600" />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                  >
                    {[
                      { icon: User, label: 'Profile' },
                      { icon: Settings, label: 'Settings' },
                      { icon: LogOut, label: 'Log Out' }
                    ].map((item, index) => (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 5 }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <item.icon size={16} />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <ProjectSkeleton />
          ) : selectedProject ? (
            <ProjectView project={selectedProject} />
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-500 mt-20"
            >
              Select a project or create a new one to get started
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskManagementSystem;
