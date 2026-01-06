import Card from '../../components/ui/card';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">City Admin Control Panel</h1>
            <p>Overview of city-wide metrics and performance.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {['Total Issues', 'Open Tickets', 'Avg Resolution Time', 'SLA Breaches'].map((item) => (
                    <Card key={item} className="h-32 flex items-center justify-center">
                        <span className="font-semibold text-gray-600">{item}</span>
                    </Card>
                ))}
            </div>
            {/* Map Integration would be here */}
            <Card className="h-96 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Heatmap Visualization Placeholder</span>
            </Card>
        </div>
    );
}
