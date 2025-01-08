import TaskSkeleton from './TaskSkeleton';
import { motion } from 'framer-motion';

const ProjectSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {['Todo', 'In Progress', 'Completed'].map((status) => (
        <motion.div 
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-6"
        >
          <div className="h-6 w-24 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectSkeleton;
