import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ProjectView = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
          >
            {project.name}
          </motion.h1>
          <div className="flex items-center mt-3 space-x-3">
            <div className="flex -space-x-2">
              {project.members.map(member => (
                <motion.div 
                  key={member.id}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm"
                >
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </motion.div>
              ))}
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Member
            </motion.button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center space-x-2 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {['Todo', 'In Progress', 'Completed'].map(status => (
          <motion.div 
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-6"
          >
            <h2 className="font-semibold mb-4 text-gray-700">{status}</h2>
            <div className="space-y-4">
              {project.tasks
                .filter(task => {
                  const taskStatus = task.status.replace('-', ' ');
                  return taskStatus.toLowerCase() === status.toLowerCase();
                })
                .map(task => (
                  <TaskCard key={task.id} task={task} members={project.members} />
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectView;
