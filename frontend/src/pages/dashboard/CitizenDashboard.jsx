import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, CheckCircle2, Clock } from 'lucide-react';
import { toast } from "sonner";

import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { RecentActivity } from '../../components/RecentActivity';
import { NewComplaintDialog } from '../../components/NewComplaintDialog';
import { ComplaintDetailDialog } from '../../components/ComplaintDetailDialog';
import { Toaster } from '../../components/ui/sonner';
import { Button } from '../../components/ui/button';

export default function CitizenDashboard() {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const fetchComplaints = async () => {
        try {
            const response = await api.get('/complaints');
            // Transform data to ensure IDs and Dates are handled
            const formattedData = response.data.map(item => ({
                ...item,
                // Ensure ID is string for keys
                id: item.id.toString(),
                date: new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })
            }));
            // Sort by latest first
            setComplaints(formattedData.reverse());
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // toast.error("Failed to load complaints"); // Optional: don't spam errors on load
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const stats = useMemo(() => {
        const total = complaints.length;
        const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
        const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'In Progress' || c.status === 'Pending').length;

        return { total, resolved, pending };
    }, [complaints]);

    const handleNewComplaint = async (data) => {
        try {
            await api.post('/complaints', data);
            toast.success("Complaint submitted successfully!", {
                description: "We have received your report and will review it shortly."
            });
            fetchComplaints(); // Reload data
        } catch (error) {
            console.error("Error submitting complaint:", error);
            toast.error("Failed to submit complaint. Please try again.");
        }
    };

    const handleViewComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setIsDetailOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FE] pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                {/* Dashboard Title */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Dashboard</h1>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        label="Total Complaints"
                        value={stats.total}
                        icon={FileText}
                        accentColor="#3B82F6" // Blue
                    />
                    <StatCard
                        label="Resolved"
                        value={stats.resolved}
                        icon={CheckCircle2}
                        accentColor="#10B981" // Emerald
                    />
                    <StatCard
                        label="Pending"
                        value={stats.pending}
                        icon={Clock}
                        accentColor="#F59E0B" // Amber
                    />
                </div>

                {/* Recent Activity */}
                <RecentActivity
                    activities={complaints}
                    onViewComplaint={handleViewComplaint}
                />
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-10 right-10 z-30">
                <Button
                    onClick={() => setIsNewComplaintOpen(true)}
                    className="h-14 rounded-full px-8 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:scale-105 transition-all duration-300 gap-2.5 bg-blue-600 hover:bg-blue-700 text-base font-semibold"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Complaint</span>
                </Button>
            </div>

            {/* Dialogs */}
            <NewComplaintDialog
                open={isNewComplaintOpen}
                onOpenChange={setIsNewComplaintOpen}
                onSubmit={handleNewComplaint}
            />

            <ComplaintDetailDialog
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                complaint={selectedComplaint}
            />

            <Toaster position="top-right" richColors />
        </div>
    );
}
