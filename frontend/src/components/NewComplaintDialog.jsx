import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import api from "../services/api";
import { Loader2, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export function NewComplaintDialog({ open, onOpenChange, onSubmit }) {
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    // Data Loading
    const [categories, setCategories] = useState([]);
    const [zones, setZones] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            fetchOptions();
        }
    }, [open]);

    const fetchOptions = async () => {
        setLoadingData(true);
        try {
            const [catsRes, zonesRes] = await Promise.all([
                api.get('/categories'),
                api.get('/zones')
            ]);
            setCategories(catsRes.data);
            setZones(zonesRes.data);
        } catch (e) {
            console.error("Failed to load options", e);
            setError("Failed to load categories. Please check your connection.");
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title || !categoryId || !zoneId || !description || !location) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({
                title,
                category_id: parseInt(categoryId),
                zone_id: parseInt(zoneId),
                description,
                address: location // Location field maps to address
            });

            // Reset form
            setTitle("");
            setCategoryId("");
            setZoneId("");
            setDescription("");
            setLocation("");
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            setError("Failed to submit complaint. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        setError("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] p-8 gap-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-2xl font-bold text-gray-900">File a New Complaint</DialogTitle>
                    <DialogDescription className="text-base text-gray-500">
                        Submit your complaint and we'll get it reviewed as soon as possible.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="space-y-5">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-bold text-gray-900">Complaint Title *</Label>
                            <Input
                                id="title"
                                placeholder="Brief description of the issue"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors text-base"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-bold text-gray-900">Category *</Label>
                                <Select value={categoryId} onValueChange={setCategoryId} required>
                                    <SelectTrigger id="category" className="h-11 bg-gray-50 border-gray-200 focus:bg-white text-base">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Zone */}
                            <div className="space-y-2">
                                <Label htmlFor="zone" className="text-sm font-bold text-gray-900">Zone / Area *</Label>
                                <Select value={zoneId} onValueChange={setZoneId} required>
                                    <SelectTrigger id="zone" className="h-11 bg-gray-50 border-gray-200 focus:bg-white text-base">
                                        <SelectValue placeholder="Select zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zones.map((zone) => (
                                            <SelectItem key={zone.id} value={zone.id.toString()}>
                                                {zone.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-bold text-gray-900">Location *</Label>
                            <Input
                                id="location"
                                placeholder="Street address or landmark"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors text-base"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-bold text-gray-900">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Please provide detailed information about the issue..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                required
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none text-base p-3"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 mt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={submitting}
                            className="font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-sm"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Complaint"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
