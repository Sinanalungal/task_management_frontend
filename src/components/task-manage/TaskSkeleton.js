import { motion } from 'framer-motion';

const TaskSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="h-5 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {[1, 2].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskSkeleton;
