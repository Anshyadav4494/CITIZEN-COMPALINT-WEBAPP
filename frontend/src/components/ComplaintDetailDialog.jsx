import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { MapPin, Calendar, Hash, FileText, Clock, User, Building, AlertTriangle } from "lucide-react";

const statusConfig = {
    "In Progress": { className: "bg-blue-100 text-blue-700" },
    "Submitted": { className: "bg-amber-100 text-amber-700" },
    "Assignments": { className: "bg-purple-100 text-purple-700" }, // Handle 'Assigned' status if needed
    "Resolved": { className: "bg-green-100 text-green-700" },
    "Closed": { className: "bg-gray-100 text-gray-700" },
    "Rejected": { className: "bg-red-100 text-red-700" }
};

const priorityConfig = {
    "High": "text-red-600 bg-red-50",
    "Critical": "text-red-700 bg-red-100",
    "Medium": "text-yellow-600 bg-yellow-50",
    "Low": "text-green-600 bg-green-50"
};

export function ComplaintDetailDialog({ open, onOpenChange, complaint }) {
    if (!complaint) return null;

    const statusStyle = statusConfig[complaint.status] || { className: "bg-gray-100 text-gray-700" };
    const priorityClass = priorityConfig[complaint.priority] || "text-gray-600 bg-gray-50";

    // Handle nested relationships safely
    const categoryName = complaint.category ? complaint.category.name : "Uncategorized";
    const zoneName = complaint.zone ? complaint.zone.name : "Unknown Zone";
    const departmentName = complaint.department ? complaint.department.name : "Pending Assignment";
    const formattedDate = new Date(complaint.created_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden shadow-2xl border-0">
                {/* Header with improved styling */}
                <div className="p-8 pb-6 border-b border-gray-100 bg-white">
                    <div className="flex justify-between items-start mb-1">
                        <DialogTitle className="text-2xl font-bold text-gray-900 pr-8 line-clamp-2">
                            {complaint.title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-500 hidden">
                        Complaint details
                    </DialogDescription>
                    <div className="flex items-center gap-3 mt-2">
                        <Badge className={`${statusStyle.className} rounded-full px-3 py-1 font-semibold border-0 shadow-none`}>
                            {complaint.status}
                        </Badge>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityClass}`}>
                            {complaint.priority} Priority
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(complaint.created_at).toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <div className="p-8 py-6 space-y-8 bg-white max-h-[65vh] overflow-y-auto">

                    {/* Key Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* ID & Date */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <Hash className="w-3.5 h-3.5" /> Complaint ID
                                </h4>
                                <p className="text-sm font-semibold text-gray-900">#{complaint.id}</p>
                            </div>

                            <div className="space-y-1">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" /> Filed On
                                </h4>
                                <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
                            </div>
                        </div>

                        {/* Category & Department */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <FileText className="w-3.5 h-3.5" /> Category
                                </h4>
                                <p className="text-sm font-semibold text-gray-900">{categoryName}</p>
                            </div>

                            <div className="space-y-1">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <Building className="w-3.5 h-3.5" /> Assigned Dept
                                </h4>
                                <p className="text-sm font-semibold text-gray-900">{departmentName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-2 pt-2 border-t border-gray-50">
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            <MapPin className="w-3.5 h-3.5" /> Location
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 font-medium">
                            {complaint.address || `${zoneName}, Smart City`}
                            <div className="text-xs text-gray-400 font-normal mt-1">{zoneName}</div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            <FileText className="w-3.5 h-3.5" /> Description
                        </h4>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {complaint.description}
                            </p>
                        </div>
                    </div>

                    {/* Image Placeholder (Future) */}
                    {/* <div className="mt-4 p-4 border border-dashed border-gray-200 rounded-lg text-center text-gray-400 text-sm">
                        No images attached
                     </div> */}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white hover:bg-gray-100 border-gray-200 text-gray-700">
                        Close
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                        onClick={() => {/* Maybe track/add comment feature later */ }}
                    >
                        Track Status
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
