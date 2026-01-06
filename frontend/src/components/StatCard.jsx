import { Card } from "./ui/card";

export function StatCard({ label, value, icon: Icon, accentColor }) {
    // We'll use style objects for dynamic colors based on the prop
    // Ideally this would be class mapping but dynamic colors are requested

    return (
        <Card className="p-6 border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div
                    className="h-12 w-12 rounded-full flex items-center justify-center transition-colors"
                    style={{
                        backgroundColor: `${accentColor}10`, // 10 = ~6% opacity hex
                        color: accentColor
                    }}
                >
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </Card>
    );
}
