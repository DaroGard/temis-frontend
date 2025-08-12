import { FileText, MoreVertical } from 'lucide-react';

interface Case {
    id: number;
    case_number: string;
    client_name: string;
    case_type: string;
    status: 'active' | 'pending' | 'closed';
}

interface CasesSectionProps {
    cases: Case[];
    onViewAll?: () => void;
    onManageCase?: (caseId: number) => void;
}

const CasesSection = ({ cases, onViewAll, onManageCase }: CasesSectionProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'pending':
                return 'Pendiente';
            case 'closed':
                return 'Cerrado';
            default:
                return status;
        }
    };
    
    return (
    <div className="section-card">
        <div className="section-header">
            <div className="section-header-left">
                <FileText className="section-icon text-yellow-500" />
                <h3 className="section-title">Casos</h3>
            </div>
            <span className="section-header-right">Gestiona tus casos legales</span>
        </div>
        <div className="space-y-4">
            {cases.map((case_item) => (
                <div key={case_item.id} className="item-container">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="item-row-between">
                                <span className="invoice-number-text">
                                    #{case_item.case_number}
                                </span>
                                <span className={`status-badge ${getStatusColor(case_item.status)}`}>
                                    {getStatusText(case_item.status)}
                                </span>
                            </div>
                            <div className="item-client">
                                {case_item.client_name}
                            </div>
                            <div className="item-amount">
                                {case_item.case_type}
                            </div>
                        </div>
                        <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <a href="/cases">
        <button className="w-full mt-6 bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium">
          Ver todos los casos
        </button>
      </a>
    </div>
    );
};

export default CasesSection;