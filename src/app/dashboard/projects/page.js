"use client"

import React, { useState } from 'react';
import { Plus, Users, X, UserPlus, Mail } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import Breadcrumb from '@/components/breadcump';

const breadcrumbItems = [
    { label: 'Home', href: '/dashboard/' },
    { label: 'Projects' },
];

const ProjectsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        members: []
    });
    const [memberEmail, setMemberEmail] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    const [mockProjects, setMockProjects] = useState([
        {
            id: 1,
            name: 'Design System',
            description: 'Company-wide design system',
            members: [
                { id: 1, avatar: '/api/placeholder/32/32', name: 'Alex Smith', email: 'alex@example.com', role: 'admin' },
                { id: 2, avatar: '/api/placeholder/32/32', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'member' }
            ],
            comments: 2,
        },
        {
            id: 2,
            name: 'Marketing Website',
            description: 'Company marketing website redesign',
            members: [
                { id: 3, avatar: '/api/placeholder/32/32', name: 'Mike Brown', email: 'mike@example.com', role: 'admin' },
                { id: 4, avatar: '/api/placeholder/32/32', name: 'Emma Wilson', email: 'emma@example.com', role: 'member' }
            ],
            comments: 0,
        }
    ]);

    const filteredProjects = mockProjects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddMember = () => {
        if (memberEmail.trim()) {
            const newMember = {
                id: Date.now(),
                name: memberEmail.split('@')[0],
                email: memberEmail,
                avatar: `/api/placeholder/32/32`,
                role: 'member'
            };
            setNewProject(prev => ({
                ...prev,
                members: [...prev.members, newMember]
            }));
            setMemberEmail('');
        }
    };

    const handleInviteMember = () => {
        if (inviteEmail.trim() && selectedProject) {
            const newMember = {
                id: Date.now(),
                name: inviteEmail.split('@')[0],
                email: inviteEmail,
                avatar: `/api/placeholder/32/32`,
                role: 'member'
            };
            
            setMockProjects(prev => prev.map(project => 
                project.id === selectedProject.id
                    ? { ...project, members: [...project.members, newMember] }
                    : project
            ));
            
            setInviteEmail('');
            setIsInviteDialogOpen(false);
        }
    };

    const removeMember = (memberId) => {
        setNewProject(prev => ({
            ...prev,
            members: prev.members.filter(member => member.id !== memberId)
        }));
    };

    const handleCreateProject = () => {
        if (newProject.name.trim()) {
            const newProjectData = {
                id: mockProjects.length + 1,
                ...newProject,
                comments: 0,
            };
            setMockProjects(prev => [...prev, newProjectData]);
            setNewProject({ name: '', description: '', members: [] });
            setIsDialogOpen(false);
        }
    };

    const handleMemberAction = (project) => {
        setSelectedProject(project);
        setIsInviteDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <Breadcrumb items={breadcrumbItems} />

            <div className="max-w-7xl mx-auto">
                {/* Header with search and add button */}
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="relative flex-1 w-full">
                        <Input
                            type="text"
                            placeholder="Search project or member..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                Add new project
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="project-name">Project Name</Label>
                                    <Input
                                        id="project-name"
                                        placeholder="Enter project name"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project-description">Description</Label>
                                    <Input
                                        id="project-description"
                                        placeholder="Enter project description"
                                        value={newProject.description}
                                        onChange={(e) => setNewProject(prev => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Team Members</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter member email"
                                            value={memberEmail}
                                            onChange={(e) => setMemberEmail(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddMember();
                                                }
                                            }}
                                        />
                                        <Button onClick={handleAddMember} type="button">
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newProject.members.map(member => (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                                            >
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span className="text-sm">{member.email}</span>
                                                <button
                                                    onClick={() => removeMember(member.id)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateProject}>
                                    Create Project
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <Link href={`/dashboard/projects/${project.id}`}>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                                            <div className="flex items-center gap-4 text-gray-600 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Users size={16} />
                                                    <span>{project.members.length}</span>
                                                </div>
                                                <div>
                                                    {project.comments} new comments
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="mt-4 flex items-center">
                                    <div className="flex -space-x-2 flex-1">
                                        {project.members.map((member) => (
                                            <img
                                                key={member.id}
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-8 h-8 rounded-full border-2 border-white"
                                            />
                                        ))}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 rounded-full border-2 border-dashed border-gray-300"
                                            >
                                                <Plus size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleMemberAction(project)}>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Invite Member
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Mail className="h-4 w-4 mr-2" />
                                                View Join Requests
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Invite Member Dialog */}
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                placeholder="Enter email address"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleInviteMember}>
                            Send Invitation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProjectsList;