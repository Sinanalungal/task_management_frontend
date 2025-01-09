"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import { CalendarIcon, Plus, CheckCircle2, CircleDashed, Timer, Trash2, Search, Filter } from "lucide-react";
import Breadcrumb from '@/components/breadcump';

const ITEMS_PER_PAGE = 5;

const breadcrumbItems = [
  { label: 'Home', href: '/dashboard/' },
  { label: 'My Tasks' },
];

const MyTasks = () => {
  // Existing state
  const [assignedTasks, setAssignedTasks] = useState([
    {
      id: 1,
      title: "Design Homepage",
      description: "Create mockups for the new homepage",
      project: "Website Redesign",
      assignedBy: "John Doe",
      dueDate: new Date(2025, 0, 15),
      priority: "high",
      status: "in-progress"
    },
    {
      id: 2,
      title: "API Integration",
      description: "Integrate payment gateway API",
      project: "E-commerce App",
      assignedBy: "Jane Smith",
      dueDate: new Date(2025, 0, 20),
      priority: "medium",
      status: "todo"
    }
  ]);

  const [personalTasks, setPersonalTasks] = useState([
    {
      id: 13,
      title: "Review Documentation",
      description: "Review and update API documentation",
      dueDate: new Date(2025, 0, 12),
      priority: "low",
      status: "todo"
    }
  ]);

  // New state for filtering, search, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  // Existing state for new task creation
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());

  // Filter and search logic
  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      let matchesDate = true;
      if (dateRange.from && dateRange.to) {
        matchesDate = isAfter(new Date(task.dueDate), dateRange.from) && 
                     isBefore(new Date(task.dueDate), dateRange.to);
      }

      return matchesSearch && matchesPriority && matchesDate;
    });
  };

  // Memoized filtered tasks
  const filteredAssignedTasks = useMemo(() => filterTasks(assignedTasks), 
    [assignedTasks, searchQuery, priorityFilter, dateRange]);
  const filteredPersonalTasks = useMemo(() => filterTasks(personalTasks), 
    [personalTasks, searchQuery, priorityFilter, dateRange]);

  // Pagination logic
  const paginateTasks = (tasks) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Existing utility functions
  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return styles[priority] || styles.medium;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Timer className="h-4 w-4 text-blue-500" />;
      default:
        return <CircleDashed className="h-4 w-4 text-gray-500" />;
    }
  };

  // Filter controls component
  const FilterControls = () => (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          icon={<Search className="h-4 w-4" />}
        />
      </div>
      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="low">Low Priority</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[250px]">
            <Filter className="h-4 w-4 mr-2" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Filter by date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {(dateRange.from || dateRange.to || priorityFilter !== "all" || searchQuery) && (
        <Button
          variant="ghost"
          onClick={() => {
            setDateRange({ from: null, to: null });
            setPriorityFilter("all");
            setSearchQuery("");
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  // Pagination controls component
  const PaginationControls = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {Math.min(((currentPage - 1) * ITEMS_PER_PAGE) + 1, totalItems)} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} tasks
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  // Task card component (existing)
  const TaskCard = ({ task, isPersonal = false }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(task.status)}
              <h3 className="font-semibold">{task.title}</h3>
            </div>
            <p className="text-sm text-gray-500">{task.description}</p>
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <Badge variant="secondary" className={getPriorityBadge(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <div className="flex items-center gap-1 text-gray-500">
                <CalendarIcon className="h-4 w-4" />
                {format(new Date(task.dueDate), "MMM dd, yyyy")}
              </div>
              {!isPersonal && (
                <>
                  <Badge variant="outline" className="ml-2">
                    {task.project}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://avatar.vercel.sh/${task.assignedBy}`} />
                      <AvatarFallback>{task.assignedBy[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-500">
                      {task.assignedBy}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={task.status}
              onValueChange={(value) => updateTaskStatus(task.id, value, isPersonal)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {isPersonal && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id, isPersonal)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Existing CRUD operations
  const addPersonalTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: personalTasks.length + 1,
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newTaskDueDate,
        priority: newTaskPriority,
        status: "todo"
      };
      setPersonalTasks([...personalTasks, newTask]);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("medium");
      setNewTaskDueDate(new Date());
    }
  };

  const updateTaskStatus = (taskId, newStatus, isPersonal) => {
    if (isPersonal) {
      setPersonalTasks(personalTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } else {
      setAssignedTasks(assignedTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    }
  };

  const deleteTask = (taskId, isPersonal) => {
    if (isPersonal) {
      setPersonalTasks(personalTasks.filter(task => task.id !== taskId));
    } else {
      setAssignedTasks(assignedTasks.filter(task => task.id !== taskId));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Breadcrumb items={breadcrumbItems} />

      <div className="max-[400px]:grid max-[400px]:gap-4 flex justify-between  items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Personal Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newTaskDueDate, "PPP")}
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
           </div>
           <DialogFooter>
             <Button onClick={addPersonalTask}>Create Task</Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>

     <FilterControls />

     <Tabs defaultValue="all" className="w-full">
       <TabsList className="grid w-full grid-cols-3">
         <TabsTrigger value="all">All Tasks</TabsTrigger>
         <TabsTrigger value="assigned">Assigned Tasks</TabsTrigger>
         <TabsTrigger value="personal">Personal Tasks</TabsTrigger>
       </TabsList>

       <TabsContent value="all" className="mt-4">
         <div className="grid gap-4">
           {paginateTasks([...filteredAssignedTasks, ...filteredPersonalTasks]).map(task => (
             <TaskCard 
               key={task.id} 
               task={task} 
               isPersonal={!task.project} 
             />
           ))}
         </div>
         <PaginationControls totalItems={filteredAssignedTasks.length + filteredPersonalTasks.length} />
       </TabsContent>

       <TabsContent value="assigned" className="mt-4">
         <div className="grid gap-4">
           {paginateTasks(filteredAssignedTasks).map(task => (
             <TaskCard key={task.id} task={task} />
           ))}
         </div>
         <PaginationControls totalItems={filteredAssignedTasks.length} />
       </TabsContent>

       <TabsContent value="personal" className="mt-4">
         <div className="grid gap-4">
           {paginateTasks(filteredPersonalTasks).map(task => (
             <TaskCard key={task.id} task={task} isPersonal={true} />
           ))}
         </div>
         <PaginationControls totalItems={filteredPersonalTasks.length} />
       </TabsContent>
     </Tabs>
   </div>
 );
};

export default MyTasks;