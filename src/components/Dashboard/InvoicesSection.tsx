import { DollarSign, CheckCircle, Clock } from 'lucide-react';

interface Invoice {
    id: number;
    invoice_number: string;
    client_name: string;
    amount: string;
    status: 'pending' | 'paid' | 'overdue';
}

interface InvoicesSectionProps {
    invoices: Invoice[];
    onViewAll?: () => void;
    onManageInvoice?: (invoiceId: number) => void;
}

const InvoicesSection = ({ invoices, onViewAll, onManageInvoice }: InvoicesSectionProps) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'overdue':
                return <Clock className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
        case 'paid':
            return 'Pagada';
        case 'pending':
            return 'Pendiente';
        case 'overdue':
            return 'Vencida';
        default:
            return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-600';
            case 'overdue':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="section-card">
            <div className="section-header">
                <div className="section-header-left">
                    <DollarSign className="section-icon text-blue-500"/>
                    <h3 className="section-title">Facturas</h3>
                </div>
                <span className="section-header-right">Administra tu facturas</span>
            </div>

            <div className="space-y-4">
                {invoices.map((invoice) => (
                <div key={invoice.id} className="item-container">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="item-row-between">
                                <span className="invoice-number-text">
                                    Factura {invoice.invoice_number}
                                </span>
                                <div className={`item-status ${getStatusColor(invoice.status)}`}>
                                    {getStatusIcon(invoice.status)}
                                    <span className="text-sm font-medium">
                                        {getStatusText(invoice.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="item-client">
                                {invoice.client_name}
                            </div>
                            <div className="item-amount">
                                {invoice.amount}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <button 
            onClick={onViewAll}
            className="section-button-blue"
        >
            Gestionar Factura
        </button>
    </div>
    );
};

export default InvoicesSection;