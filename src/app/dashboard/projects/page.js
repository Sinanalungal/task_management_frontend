"use client"

import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Breadcrumb from '@/components/breadcump';
const breadcrumbItems = [
    { label: 'Home', href: '/dashboard/' },
    { label: 'Projects' },
];
const ProjectsList = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const mockProjects = [
        {
            id: 1,
            name: 'Design System',
            members: [
                { id: 1, avatar: '/api/placeholder/32/32', name: 'Alex Smith' },
                { id: 2, avatar: '/api/placeholder/32/32', name: 'Sarah Johnson' }
            ],
            comments: 2,
        },
        {
            id: 2,
            name: 'Marketing Website',
            members: [
                { id: 3, avatar: '/api/placeholder/32/32', name: 'Mike Brown' },
                { id: 4, avatar: '/api/placeholder/32/32', name: 'Emma Wilson' }
            ],
            comments: 0,
        }
    ];

    const filteredProjects = mockProjects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <Breadcrumb items={breadcrumbItems} />

            <div className="max-w-7xl mx-auto">
                {/* Header with search and add button */}
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search project or member..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                        <Plus size={20} />
                        Add new project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                        <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
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
                                    </div>

                                    <div className="mt-4 flex -space-x-2">
                                        {project.members.map((member) => (
                                            <img
                                                key={member.id}
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-8 h-8 rounded-full border-2 border-white"
                                            />
                                        ))}
                                        <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-white text-gray-400 hover:text-gray-600">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsList;