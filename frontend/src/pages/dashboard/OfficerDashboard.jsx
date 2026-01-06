import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, Clock, Filter } from 'lucide-react';
import { Toaster } from '../../components/ui/sonner';
import { toast } from "sonner";

export default function OfficerDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ assigned: 0, in_progress: 0, resolved: 0 });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            // Parallel fetch for better performance
            const [complaintsRes, statsRes] = await Promise.all([
                api.get('/complaints'),
                api.get('/dashboard/officer')
            ]);

            setComplaints(complaintsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Error loading dashboard:", error);
            // toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/complaints/${id}/status`, { status: newStatus });
            toast.success(`Complaint status updated to ${newStatus}`);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Officer Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage and resolve complaints assigned to your department.</p>
                </div>
                <Button variant="outline" onClick={fetchDashboardData} className="gap-2">
                    <Clock className="w-4 h-4" /> Refresh
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Assigned / Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.assigned}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.in_progress}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.resolved}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Complaints</h2>
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>

                {complaints.length === 0 ? (
                    <Card className="bg-gray-50 border-dashed">
                        <div className="p-12 text-center text-gray-500">
                            No complaints currently assigned to your department.
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {complaints.map((complaint) => (
                            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${complaint.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        complaint.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            'bg-green-50 text-green-700 border-green-200'
                                                    }`}>
                                                    {complaint.priority} Priority
                                                </span>
                                                <span className="text-xs text-gray-500">#{complaint.id}</span>
                                                <span className="text-xs text-gray-500">• {new Date(complaint.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="font-semibold text-lg text-gray-900">{complaint.title}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">{complaint.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium text-gray-700">Category:</span> {complaint.category?.name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium text-gray-700">Zone:</span> {complaint.zone?.name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 min-w-[140px]">
                                            <div className="text-sm text-right mb-2">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                        complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {complaint.status}
                                                </span>
                                            </div>

                                            {complaint.status !== 'Resolved' && (
                                                <div className="flex flex-col gap-2">
                                                    {complaint.status !== 'In Progress' && (
                                                        <Button size="sm" onClick={() => updateStatus(complaint.id, 'In Progress')} className="w-full bg-blue-600 hover:bg-blue-700">
                                                            Mark In Progress
                                                        </Button>
                                                    )}
                                                    <Button size="sm" onClick={() => updateStatus(complaint.id, 'Resolved')} variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50">
                                                        Mark Resolved
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <Toaster position="top-right" />
        </div>
    );
}
