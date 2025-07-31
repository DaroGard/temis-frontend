import { Calendar, MapPin } from 'lucide-react';

interface AgendaItem {
  id: number;
  time: string;
  title: string;
  location: string;
  type: 'audiencia' | 'consulta' | 'reunion';
}

interface AgendaSectionProps {
  agendaItems: AgendaItem[];
  onViewCalendar?: () => void;
}

const AgendaSection = ({ agendaItems, onViewCalendar }: AgendaSectionProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audiencia':
        return 'bg-green-100 text-green-800';
      case 'consulta':
        return 'bg-blue-100 text-blue-800';
      case 'reunion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'audiencia':
        return 'Audiencia';
      case 'consulta':
        return 'Consulta';
      case 'reunion':
        return 'Reunión';
      default:
        return type;
    }
  };
  return (
  <div className="section-card">
    <div className="section-header">
      <div className="section-header-left">
        <Calendar className="section-icon text-green-500" />
        <h3 className="section-title">Agenda</h3>
      </div>
      <span className="section-header-right">Organiza tu calendario</span>
    </div>
    <div className="space-y-4">
      {agendaItems.map((item) => (
        <div key={item.id} className="item-container">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="item-row-between">
                <span className="invoice-number-text min-w-[60px]">
                  {item.time}
                </span>
                <span className={`status-badge ${getTypeColor(item.type)}`}>
                  {getTypeText(item.type)}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                {item.title}
              </div>
              <div className="flex items-center space-x-1 text-sm font-medium text-slate-900">
                <MapPin className="h-3 w-3" />
                <span>{item.location}</span>
              </div>
            </div>
            {/* Opcional: botón de acciones como MoreVertical */}
          </div>
        </div>
      ))}
    </div>
      <button 
        onClick={onViewCalendar}
        className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Ver calendario completo
      </button>
  </div>
  );
};

export default AgendaSection;