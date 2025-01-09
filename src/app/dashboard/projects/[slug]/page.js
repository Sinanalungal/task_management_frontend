"use client";
import React, { useState } from 'react';
import Breadcrumb from "@/components/breadcump";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Flag, MoreVertical, Plus, Edit, Trash2, Send, MessageSquare, UserCircle2 } from "lucide-react";

// Sample users data - in a real app, this would come from your backend
const USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Frontend Developer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Backend Developer" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Designer" },
];

const PRIORITY_LEVELS = {
  high: { label: "High", color: "text-red-500 bg-red-100" },
  medium: { label: "Medium", color: "text-yellow-500 bg-yellow-100" },
  low: { label: "Low", color: "text-green-500 bg-green-100" }
};

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard/' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Tasks' }
];

const SingleProject = () => {
  const params = useParams();
  const slug = params.slug;
  
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Design UI mockups", 
      status: "todo", 
      description: "Create initial designs",
      priority: "high",
      dueDate: new Date(2025, 0, 15),
      assignedTo: 3, // User ID
    },
  ]);
  
  const [comments, setComments] = useState([
    { id: 1, user: "John Doe", message: "Let's start with the homepage", timestamp: "2h ago" },
    { id: 2, user: "Jane Smith", message: "I've prepared the designs", timestamp: "1h ago" },
  ]);

  // Task state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  
  // Comment and task management state
  const [newComment, setNewComment] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const addTask = () => {
    if (newTaskTitle.trim() && newTaskAssignee) {
      setTasks([...tasks, {
        id: tasks.length + 1,
        title: newTaskTitle,
        description: newTaskDescription,
        status: "todo",
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        assignedTo: parseInt(newTaskAssignee),
      }]);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("medium");
      setNewTaskDueDate(new Date());
      setNewTaskAssignee("");
    }
  };

  const getAssignedUser = (userId) => {
    return USERS.find(user => user.id === userId);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    setTasks(tasks.filter(task => task.id !== taskToDelete.id));
    setShowDeleteAlert(false);
    setTaskToDelete(null);
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    setTaskToEdit(task);
    setStatusToUpdate(newStatus);
    setShowStatusAlert(true);
  };

  const confirmStatusUpdate = () => {
    setTasks(tasks.map(task =>
      task.id === taskToEdit.id ? { ...task, status: statusToUpdate } : task
    ));
    setShowStatusAlert(false);
    setTaskToEdit(null);
    setStatusToUpdate(null);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
    setNewTaskPriority(task.priority);
    setNewTaskDueDate(new Date(task.dueDate));
    // setNewTaskEstimatedTime(task.estimatedTime);
    setEditDialogOpen(true);
  };

  const confirmEdit = () => {
    setTasks(tasks.map(task =>
      task.id === taskToEdit.id
        ? {
            ...task,
            title: newTaskTitle,
            description: newTaskDescription,
            priority: newTaskPriority,
            dueDate: newTaskDueDate,
            // estimatedTime: newTaskEstimatedTime
          }
        : task
    ));
    setEditDialogOpen(false);
    setTaskToEdit(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
    setNewTaskDueDate(new Date());
    // setNewTaskEstimatedTime("");
  };

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        id: comments.length + 1,
        user: "Current User",
        message: newComment,
        timestamp: "Just now"
      }]);
      setNewComment("");
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };


  const TaskCard = ({ task }) => (
    <Card key={task.id} className={cn(
      "border-l-4",
      task.priority === "high" ? "border-l-red-500" : 
      task.priority === "medium" ? "border-l-yellow-500" : 
      "border-l-green-500"
    )}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm sm:text-base">{task.title}</h3>
              <Badge variant="outline" className={PRIORITY_LEVELS[task.priority].color}>
                {PRIORITY_LEVELS[task.priority].label}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">{task.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span className={cn(
                  isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-500" : ""
                )}>
                  {format(new Date(task.dueDate), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <UserCircle2 className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">
                  {getAssignedUser(task.assignedTo)?.name || "Unassigned"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={task.status}
              onValueChange={(value) => handleStatusUpdate(task.id, value)}
            >
              <SelectTrigger className="w-28 sm:w-32 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteTask(task)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CreateTaskDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="text-sm sm:text-base"
          />
          <Textarea
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="text-sm sm:text-base"
          />
          <Select
            value={newTaskPriority}
            onValueChange={setNewTaskPriority}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={newTaskAssignee}
            onValueChange={setNewTaskAssignee}
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign To" />
            </SelectTrigger>
            <SelectContent>
              {USERS.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://avatar.vercel.sh/${user.name}`} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-gray-500">{user.role}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !newTaskDueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTaskDueDate ? format(newTaskDueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newTaskDueDate}
                  onSelect={setNewTaskDueDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={addTask} className="w-full sm:w-auto">Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-xl sm:text-2xl font-bold">Project Tasks</h1>
              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Comments</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Comments</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 h-[calc(100vh-200px)] flex flex-col">
                      <ScrollArea className="flex-1">
                        <div className="space-y-4 pr-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2 sm:gap-3">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${comment.user}`} />
                                <AvatarFallback>{comment.user[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs sm:text-sm">{comment.user}</span>
                                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                </div>
                                <p className="text-xs sm:text-sm mt-1">{comment.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Input
                          placeholder="Type your comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addComment()}
                          className="text-xs sm:text-sm"
                        />
                        <Button size="icon" onClick={addComment}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <CreateTaskDialog />
              </div>
            </div>
          </div>

          <Tabs defaultValue="todo" className="w-full">
            <TabsList className="w-full mb-4 grid grid-cols-3">
              <TabsTrigger value="todo" className="text-xs sm:text-sm">To Do</TabsTrigger>
              <TabsTrigger value="in-progress" className="text-xs sm:text-sm">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
            </TabsList>

            {["todo", "in-progress", "completed"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="space-y-3">
                  {sortTasks(tasks)
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to the task details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Textarea
              placeholder="Task Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <Select
              value={newTaskPriority}
              onValueChange={setNewTaskPriority}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !newTaskDueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTaskDueDate ? format(newTaskDueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTaskDueDate}
                    onSelect={setNewTaskDueDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* <Input
              placeholder="Estimated Time (e.g., 2h, 30m)"
              value={newTaskEstimatedTime}
              onChange={(e) => setNewTaskEstimatedTime(e.target.value)}
            /> */}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Update Confirmation Dialog */}
      <AlertDialog open={showStatusAlert} onOpenChange={setShowStatusAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of this task to {statusToUpdate}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SingleProject;

// "use client";
// import { useState } from "react";
// import Breadcrumb from "@/components/breadcump";
// import { useParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { MoreVertical, Plus, Edit, Trash2, Send, MessageSquare } from "lucide-react";

// const breadcrumbItems = [
//   { label: 'Home', href: '/dashboard/' },
//   { label: 'Projects', href: '/dashboard/projects' },
//   { label: 'Tasks' }
// ];

// const SingleProject = () => {
//   const params = useParams();
//   const slug = params.slug;
  
//   const [tasks, setTasks] = useState([
//     { id: 1, title: "Design UI mockups", status: "todo", description: "Create initial designs" },
//     { id: 2, title: "Implement API", status: "in-progress", description: "Build REST endpoints" },
//     { id: 3, title: "Testing", status: "completed", description: "Run unit tests" },
//   ]);
  
//   const [comments, setComments] = useState([
//     { id: 1, user: "John Doe", message: "Let's start with the homepage", timestamp: "2h ago" },
//     { id: 2, user: "Jane Smith", message: "I've prepared the designs", timestamp: "1h ago" },
//   ]);

//   const [newTaskTitle, setNewTaskTitle] = useState("");
//   const [newTaskDescription, setNewTaskDescription] = useState("");
//   const [newComment, setNewComment] = useState("");
//   const [taskToDelete, setTaskToDelete] = useState(null);
//   const [taskToEdit, setTaskToEdit] = useState(null);
//   const [statusToUpdate, setStatusToUpdate] = useState(null);
//   const [showDeleteAlert, setShowDeleteAlert] = useState(false);
//   const [showStatusAlert, setShowStatusAlert] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);

//   const addTask = () => {
//     if (newTaskTitle.trim()) {
//       setTasks([...tasks, {
//         id: tasks.length + 1,
//         title: newTaskTitle,
//         description: newTaskDescription,
//         status: "todo"
//       }]);
//       setNewTaskTitle("");
//       setNewTaskDescription("");
//     }
//   };

//   const handleDeleteTask = (task) => {
//     setTaskToDelete(task);
//     setShowDeleteAlert(true);
//   };

//   const confirmDelete = () => {
//     setTasks(tasks.filter(task => task.id !== taskToDelete.id));
//     setShowDeleteAlert(false);
//     setTaskToDelete(null);
//   };

//   const handleStatusUpdate = (taskId, newStatus) => {
//     const task = tasks.find(t => t.id === taskId);
//     setTaskToEdit(task);
//     setStatusToUpdate(newStatus);
//     setShowStatusAlert(true);
//   };

//   const confirmStatusUpdate = () => {
//     setTasks(tasks.map(task =>
//       task.id === taskToEdit.id ? { ...task, status: statusToUpdate } : task
//     ));
//     setShowStatusAlert(false);
//     setTaskToEdit(null);
//     setStatusToUpdate(null);
//   };

//   const handleEditTask = (task) => {
//     setTaskToEdit(task);
//     setNewTaskTitle(task.title);
//     setNewTaskDescription(task.description);
//     setEditDialogOpen(true);
//   };

//   const confirmEdit = () => {
//     setTasks(tasks.map(task =>
//       task.id === taskToEdit.id
//         ? { ...task, title: newTaskTitle, description: newTaskDescription }
//         : task
//     ));
//     setEditDialogOpen(false);
//     setTaskToEdit(null);
//     setNewTaskTitle("");
//     setNewTaskDescription("");
//   };

//   const addComment = () => {
//     if (newComment.trim()) {
//       setComments([...comments, {
//         id: comments.length + 1,
//         user: "Current User",
//         message: newComment,
//         timestamp: "Just now"
//       }]);
//       setNewComment("");
//     }
//   };

//   return (
//     <div className="p-2 sm:p-4 md:p-6">
//       <div className="mb-4">
//         <Breadcrumb items={breadcrumbItems} />
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:gap-6">
//         {/* Tasks Section */}
//         <div className="w-full">
//           <div className="flex flex-col sm:flex-row justify-between  items-start sm:items-center gap-4 mb-6">
//             <div className="flex items-center justify-between w-full">
//               <h1 className="text-xl sm:text-2xl font-bold">Project Tasks</h1>
//               <div className="flex gap-2">
//                 <Sheet>
//                   <SheetTrigger asChild>
//                     <Button variant="outline" size="sm">
//                       <MessageSquare className="h-4 w-4 mr-2" />
//                       <span className="hidden sm:inline">Comments</span>
//                     </Button>
//                   </SheetTrigger>
//                   <SheetContent className="w-full sm:w-[400px]">
//                     <SheetHeader>
//                       <SheetTitle>Comments</SheetTitle>
//                     </SheetHeader>
//                     <div className="mt-4 h-[calc(100vh-200px)] flex flex-col">
//                       <ScrollArea className="flex-1">
//                         <div className="space-y-4 pr-4">
//                           {comments.map((comment) => (
//                             <div key={comment.id} className="flex gap-2 sm:gap-3">
//                               <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
//                                 <AvatarImage src={`https://avatar.vercel.sh/${comment.user}`} />
//                                 <AvatarFallback>{comment.user[0]}</AvatarFallback>
//                               </Avatar>
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2">
//                                   <span className="font-semibold text-xs sm:text-sm">{comment.user}</span>
//                                   <span className="text-xs text-gray-500">{comment.timestamp}</span>
//                                 </div>
//                                 <p className="text-xs sm:text-sm mt-1">{comment.message}</p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </ScrollArea>
//                       <div className="flex gap-2 mt-4 pt-4 border-t">
//                         <Input
//                           placeholder="Type your comment..."
//                           value={newComment}
//                           onChange={(e) => setNewComment(e.target.value)}
//                           onKeyPress={(e) => e.key === 'Enter' && addComment()}
//                           className="text-xs sm:text-sm"
//                         />
//                         <Button size="icon" onClick={addComment}>
//                           <Send className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </SheetContent>
//                 </Sheet>
                
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button size="sm">
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add Task
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                       <DialogTitle className="text-lg sm:text-xl">Create New Task</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4 mt-4">
//                       <Input
//                         placeholder="Task Title"
//                         value={newTaskTitle}
//                         onChange={(e) => setNewTaskTitle(e.target.value)}
//                         className="text-sm sm:text-base"
//                       />
//                       <Textarea
//                         placeholder="Task Description"
//                         value={newTaskDescription}
//                         onChange={(e) => setNewTaskDescription(e.target.value)}
//                         className="text-sm sm:text-base"
//                       />
//                       <Button onClick={addTask} className="w-full sm:w-auto">Create Task</Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </div>
//           </div>

//           <Tabs defaultValue="todo" className="w-full">
//             <TabsList className="w-full mb-4 grid grid-cols-3">
//               <TabsTrigger value="todo" className="text-xs sm:text-sm">To Do</TabsTrigger>
//               <TabsTrigger value="in-progress" className="text-xs sm:text-sm">In Progress</TabsTrigger>
//               <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
//             </TabsList>

//             {["todo", "in-progress", "completed"].map((status) => (
//               <TabsContent key={status} value={status}>
//                 <div className="space-y-3">
//                   {tasks
//                     .filter((task) => task.status === status)
//                     .map((task) => (
//                       <Card key={task.id}>
//                         <CardContent className="p-3 sm:p-4">
//                           <div className="flex flex-col sm:flex-row justify-between gap-2">
//                             <div className="space-y-1">
//                               <h3 className="font-semibold text-sm sm:text-base">{task.title}</h3>
//                               <p className="text-xs sm:text-sm text-gray-500">{task.description}</p>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Select
//                                 value={task.status}
//                                 onValueChange={(value) => handleStatusUpdate(task.id, value)}
//                               >
//                                 <SelectTrigger className="w-28 sm:w-32 text-xs sm:text-sm">
//                                   <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="todo">To Do</SelectItem>
//                                   <SelectItem value="in-progress">In Progress</SelectItem>
//                                   <SelectItem value="completed">Completed</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button variant="ghost" size="sm">
//                                     <MoreVertical className="h-4 w-4" />
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end" className="text-xs sm:text-sm">
//                                   <DropdownMenuItem onClick={() => handleEditTask(task)}>
//                                     <Edit className="mr-2 h-4 w-4" />
//                                     Edit
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem onClick={() => handleDeleteTask(task)}>
//                                     <Trash2 className="mr-2 h-4 w-4" />
//                                     Delete
//                                   </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>
//         </div>
//       </div>

//       {/* Edit Task Dialog */}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Task</DialogTitle>
//             <DialogDescription>
//               Make changes to the task details below.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 mt-4">
//             <Input
//               placeholder="Task Title"
//               value={newTaskTitle}
//               onChange={(e) => setNewTaskTitle(e.target.value)}
//             />
//             <Textarea
//               placeholder="Task Description"
//               value={newTaskDescription}
//               onChange={(e) => setNewTaskDescription(e.target.value)}
//             />
//           </div>
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//             <Button onClick={confirmEdit}>Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Task</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this task? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmDelete} className="bg-red-600">Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Status Update Confirmation Dialog */}
//       <AlertDialog open={showStatusAlert} onOpenChange={setShowStatusAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Update Status</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to change the status of this task to {statusToUpdate}?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmStatusUpdate}>Update</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default SingleProject;