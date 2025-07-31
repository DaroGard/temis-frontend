import { FileText, DollarSign, Calendar } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'document' | 'invoice' | 'appointment';
  title: string;
  timestamp: string;
  description?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'invoice':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'bg-green-100';
      case 'invoice':
        return 'bg-blue-100';
      case 'appointment':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    // Simple format for demo - in real app, use proper date formatting
    if (timestamp.includes('hora')) {
      return timestamp;
    }
    return `Hace ${timestamp}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Actividad Reciente
        </h3>
        <p className="text-sm text-slate-600">
          Últimas acciones e tu cuenta
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className={`p-2 rounded-full ${getActivityBgColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 mb-1">
                {activity.title}
              </div>
              {activity.description && (
                <div className="text-sm text-slate-600 mb-2">
                  {activity.description}
                </div>
              )}
              <div className="text-xs text-slate-500">
                {formatTimestamp(activity.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay actividad reciente</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;