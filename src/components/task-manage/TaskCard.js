import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Paperclip, MoreVertical } from 'lucide-react';

const TaskCard = ({ task, members }) => {
  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100/50 text-blue-600">
          {task.type}
        </span>
        <motion.button 
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 hover:text-gray-600"
        >
          <MoreVertical size={16} />
        </motion.button>
      </div>
      <h3 className="font-medium mb-3 text-gray-800">{task.title}</h3>
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {task.assignees.map(assigneeId => {
            const member = members.find(m => m.id === assigneeId);
            return (
              <motion.div 
                key={assigneeId}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-sm"
              >
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center space-x-3 text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          {task.attachments.length > 0 && (
            <div className="flex items-center space-x-1">
              <Paperclip size={14} />
              <span className="text-xs">{task.attachments.length}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
