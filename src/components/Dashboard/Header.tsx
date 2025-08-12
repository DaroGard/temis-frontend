import { Search, Bell, Settings, User } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps {
    userName?: string;
    onSearch?: (query: string) => void;
}

const DashboardHeader = ({ userName = "Users", onSearch }: DashboardHeaderProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const value = e.target.value;
        setSearchQuery(value);
        onSearch?.(value);
    };
    
    return (
    <header className="bg-slate-800 text-white px-6 py-4">
        <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">
                    TEMIS
                </div>
                <div className="text-sm text-slate-300">
                        Gestión legal inteligente
                </div>
            </div>
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                    type="text"
                    placeholder="Buscar casos, clientes, documentos..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>
            {/* Right Section */}
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                    </span>
                </button>
                {/* Settings */}
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Settings className="h-6 w-6" />
                </button>
                {/* User Profile */}
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-600">
                    <div className="bg-slate-600 p-2 rounded-full">
                        <User className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{userName}</span>
                </div>
            </div>
        </div>
    </header>
    );
};

export default DashboardHeader;