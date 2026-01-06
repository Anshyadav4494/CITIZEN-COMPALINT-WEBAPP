import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";

const statusConfig = {
    "In Progress": {
        className: "bg-blue-50 text-blue-600 hover:bg-blue-100"
    },
    "Submitted": {
        className: "bg-amber-50 text-amber-600 hover:bg-amber-100"
    },
    "Resolved": {
        className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
    },
    "Closed": {
        className: "bg-gray-50 text-gray-600 hover:bg-gray-100"
    },
    "Rejected": {
        className: "bg-red-50 text-red-600 hover:bg-red-100"
    },
    // Default fallback
    "default": {
        className: "bg-gray-50 text-gray-600"
    }
};

export function RecentActivity({ activities, onViewComplaint }) {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100/50">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <Button variant="outline" size="sm" className="text-gray-600 font-medium">
                    View All
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">Title</th>
                            <th className="text-left py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-left py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="text-left py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                                    No complaints yet.
                                </td>
                            </tr>
                        ) : (
                            activities.slice(0, 5).map((activity) => {
                                const statusStyle = statusConfig[activity.status] || statusConfig["default"];

                                return (
                                    <tr key={activity.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-5 pr-4 text-sm text-gray-900 font-medium">{activity.title}</td>
                                        <td className="py-5 pr-4">
                                            <Badge className={`${statusStyle.className} rounded-full px-3 py-1 text-[11px] font-semibold border-0 shadow-none`}>
                                                {activity.status}
                                            </Badge>
                                        </td>
                                        <td className="py-5 pr-4 text-sm text-gray-500 font-medium">
                                            {activity.date || new Date(activity.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="py-5 text-right">
                                            <button
                                                onClick={() => onViewComplaint(activity)}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors opacity-90 hover:opacity-100"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
