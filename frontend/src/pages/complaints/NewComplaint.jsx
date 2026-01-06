import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Loader2, Send, MapPin, Tag, FileText, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NewComplaint() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [zones, setZones] = useState([]);
    const [loadingResources, setLoadingResources] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        zone_id: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, zonesRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/zones')
                ]);
                setCategories(catsRes.data);
                setZones(zonesRes.data);
            } catch (err) {
                console.error("Error fetching resources:", err);
                setError("Failed to load options. Please refresh the page.");
            } finally {
                setLoadingResources(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend Validation
        if (!formData.category_id || !formData.zone_id || !formData.title || !formData.description) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                category_id: parseInt(formData.category_id),
                zone_id: parseInt(formData.zone_id)
            };

            await api.post('/complaints', payload);
            navigate('/citizen/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.errors) {
                // Formatting Laravel validation errors
                const serverErrors = Object.values(err.response.data.errors).flat().join(' ');
                setError(serverErrors);
            } else {
                setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingResources) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-gray-100">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">New Complaint</h1>
                    <p className="text-gray-500 mt-1">Submit a new issue to your local municipal authority.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
                        <CardHeader>
                            <CardTitle>Complaint Details</CardTitle>
                            <CardDescription>
                                Provide as much detail as possible to help us resolve the issue quickly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Issue Title</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <Input
                                            name="title"
                                            placeholder="e.g., Garbage not collected in Main St"
                                            className="pl-10 h-11 bg-gray-50/50 focus:bg-white transition-colors"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Category</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <select
                                                name="category_id"
                                                className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-gray-50/50 hover:bg-gray-50 focus:bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Zone / Area</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <select
                                                name="zone_id"
                                                className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-gray-50/50 hover:bg-gray-50 focus:bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                                                value={formData.zone_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Zone</option>
                                                {zones.map(zone => (
                                                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows="5"
                                        className="w-full p-4 rounded-md border border-input bg-gray-50/50 focus:bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[120px] transition-colors"
                                        placeholder="Please provide specific details about the issue..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={() => navigate('/citizen/dashboard')} className="h-11 px-8">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={submitting} className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Submit Complaint
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-blue-50 border-blue-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-blue-900 text-lg">Tips for faster resolution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-blue-800">
                            <ul className="list-disc pl-4 space-y-2">
                                <li>Be specific about the location.</li>
                                <li>Take a clear photo if possible (feature coming soon).</li>
                                <li>Select the correct category.</li>
                                <li>Keep the description concise but detailed.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Emergency?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                For immediate emergencies (fire, major accidents, immediate danger), please call the emergency helpline directly.
                            </p>
                            <Button variant="destructive" className="w-full">
                                Call 112
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
