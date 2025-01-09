"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Mail, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const ProjectRequests = ({ projectId }) => {
    const [joinRequests, setJoinRequests] = useState([
        {
            id: 1,
            userId: 101,
            userName: "David Chen",
            userEmail: "david@example.com",
            userAvatar: "/api/placeholder/32/32",
            message: "I'd like to join the project team and contribute to the development.",
            status: 'pending',
            requestDate: "2024-01-08T10:00:00Z"
        },
        {
            id: 2,
            userId: 102,
            userName: "Lisa Wong",
            userEmail: "lisa@example.com",
            userAvatar: "/api/placeholder/32/32",
            message: "Interested in contributing to the project with my design skills.",
            status: 'pending',
            requestDate: "2024-01-09T09:30:00Z"
        }
    ]);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    };

    const handleAction = (requestId, action) => {
        setJoinRequests(prev => prev.map(request => 
            request.id === requestId
                ? { ...request, status: action }
                : request
        ));
        setIsDetailsOpen(false);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        };
        
        const icons = {
            pending: <Clock className="h-4 w-4 mr-1" />,
            approved: <CheckCircle2 className="h-4 w-4 mr-1" />,
            rejected: <XCircle className="h-4 w-4 mr-1" />
        };
        
        return (
            <Badge className={styles[status]}>
                <div className="flex items-center">
                    {icons[status]}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
            </Badge>
        );
    };

    const showRequestDetails = (request) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Join Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {joinRequests.map(request => (
                        <Card key={request.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={request.userAvatar}
                                        alt={request.userName}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-medium">{request.userName}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Mail className="h-4 w-4" />
                                            <span>{request.userEmail}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(request.requestDate)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusBadge(request.status)}
                                    {request.status === 'pending' && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => showRequestDetails(request)}
                                        >
                                            Review
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request Details</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={selectedRequest.userAvatar}
                                        alt={selectedRequest.userName}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-medium text-lg">{selectedRequest.userName}</h3>
                                        <p className="text-gray-500">{selectedRequest.userEmail}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2">Message</h4>
                                    <p className="text-gray-700">{selectedRequest.message}</p>
                                </div>

                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>Requested on {formatDate(selectedRequest.requestDate)}</span>
                                </div>

                                <DialogFooter className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleAction(selectedRequest.id, 'rejected')}
                                        className="bg-red-50 text-red-600 hover:bg-red-100"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleAction(selectedRequest.id, 'approved')}
                                        className="bg-green-600 text-white hover:bg-green-700"
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default ProjectRequests;