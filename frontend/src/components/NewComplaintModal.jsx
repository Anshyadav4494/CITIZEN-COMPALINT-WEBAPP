import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';
import Button from './ui/button';

export default function NewComplaintModal({ isOpen, onClose, onSuccess }) {
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState(""); // Maps to 'location' in UI, 'address' in DB

    const [categories, setCategories] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            // Fetch resources when modal opens
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
                    setError("Failed to load options");
                }
            };
            fetchData();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/complaints', {
                title,
                category_id: categoryId,
                zone_id: zoneId,
                description,
                address // backend might need to be updated to accept 'address' if it's not 'location'
            });
            onSuccess();
            onClose();
            // Reset form
            setTitle("");
            setCategoryId("");
            setZoneId("");
            setDescription("");
            setAddress("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit complaint.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg transform rounded-xl bg-white p-6 shadow-2xl transition-all sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">File a New Complaint</h2>
                        <p className="mt-1 text-sm text-gray-500">Submit your complaint and we'll get it reviewed.</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Complaint Title *</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="Brief description of the issue"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category *</label>
                            <select
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Select...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Zone *</label>
                            <select
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                                value={zoneId}
                                onChange={(e) => setZoneId(e.target.value)}
                            >
                                <option value="">Select...</option>
                                {zones.map(z => (
                                    <option key={z.id} value={z.id}>{z.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location / Address *</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="Street address or landmark"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description *</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                            placeholder="Please provide detailed information..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="min-w-[140px]">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Complaint'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
