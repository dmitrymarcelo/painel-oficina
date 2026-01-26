
import React, { useState, useMemo, useCallback } from 'react';
import { OrdemServico, Vehicle, Status, ToastMessage, Filters, StatusChange, ViewType, PreventiveItem, VehicleModel } from './types';
import { INITIAL_OS_DATA, COLUMNS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { getNextId } from './utils/formatters';

import Header from './components/Header';
import StatsBar from './components/StatsBar';
import KanbanBoard from './components/KanbanBoard';
import OsModal from './components/OsModal';
import FilterModal from './components/FilterModal';
import ReportsModal from './components/ReportsModal';
import FleetManagementView from './components/FleetManagementView';
import PreventiveMaintenanceView from './components/PreventiveMaintenanceView';
import VehicleModelsView from './components/VehicleModelsView';
import QrCodeModal from './components/QrCodeModal';
import PasswordModal from './components/PasswordModal';
import Toast from './components/Toast';

const App: React.FC = () => {
    const [view, setView] = useState<ViewType>('dashboard');
    const [ordensServico, setOrdensServico] = useLocalStorage<OrdemServico[]>('oficina_ordens_servico', INITIAL_OS_DATA);
    const [vehicleDatabase, setVehicleDatabase] = useLocalStorage<Vehicle[]>('oficina_vehicle_database', []);
    const [preventiveDatabase, setPreventiveDatabase] = useLocalStorage<PreventiveItem[]>('oficina_preventive_database', []);
    const [vehicleModels, setVehicleModels] = useLocalStorage<VehicleModel[]>('oficina_vehicle_models', []);
    
    const [isOsModalOpen, setIsOsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    const [editingOs, setEditingOs] = useState<OrdemServico | null>(null);
    const [selectedOsForQr, setSelectedOsForQr] = useState<OrdemServico | null>(null);
    const [pendingTransition, setPendingTransition] = useState<{id: number, status: Status} | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [filters, setFilters] = useState<Filters>({});
    
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        setToast({ id: Date.now(), message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const operationStatus = useMemo(() => {
        const osAtivas = ordensServico.filter(os => !['finalizado', 'entregue'].includes(os.status));
        if (osAtivas.length === 0) return 'ESTÁVEL';
        const agora = new Date().getTime();
        const gargalos = osAtivas.filter(os => (agora - new Date(os.dataEntrada).getTime()) / 3600000 >= 48).length;
        return gargalos > osAtivas.length * 0.3 ? 'SOB PRESSÃO' : 'FLUXO SAUDÁVEL';
    }, [ordensServico]);

    const handleStatusChangeRequest = (id: number, status: Status) => {
        const os = ordensServico.find(o => o.id === id);
        if (os && os.status === status) return;
        
        setPendingTransition({ id, status });
        setIsPasswordModalOpen(true);
    };

    const confirmStatusChange = () => {
        if (!pendingTransition) return;
        
        setOrdensServico(prev => prev.map(os => {
            if (os.id === pendingTransition.id) {
                const historyEntry: StatusChange = {
                    status: pendingTransition.status,
                    timestamp: new Date().toISOString()
                };
                return {
                    ...os,
                    status: pendingTransition.status,
                    history: [...(os.history || []), historyEntry]
                };
            }
            return os;
        }));
        
        setPendingTransition(null);
        setIsPasswordModalOpen(false);
        showToast('Status atualizado com sucesso!', 'success');
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-app-bg text-slate-900 font-sans text-sm">
            <Header currentView={view} onViewChange={setView} onNewOsClick={() => setIsOsModalOpen(true)} onFilterClick={() => setIsFilterModalOpen(true)} onReportsClick={() => setIsReportsModalOpen(true)} searchTerm={searchTerm} onSearchChange={setSearchTerm} showToast={showToast} operationStatus={operationStatus} />
            
            <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative">
                {view === 'fleet' ? (
                    <FleetManagementView vehicleDatabase={vehicleDatabase} setVehicleDatabase={setVehicleDatabase} setOrdensServico={setOrdensServico} showToast={showToast} onBack={() => setView('dashboard')} />
                ) : view === 'preventive' ? (
                    <PreventiveMaintenanceView preventiveData={preventiveDatabase} setPreventiveData={setPreventiveDatabase} vehicleDatabase={vehicleDatabase} vehicleModels={vehicleModels} showToast={showToast} onBack={() => setView('dashboard')} />
                ) : view === 'vehicle-models' ? (
                    <VehicleModelsView models={vehicleModels} setModels={setVehicleModels} showToast={showToast} onBack={() => setView('dashboard')} />
                ) : (
                    <>
                        <StatsBar ordensServico={ordensServico} />
                        <KanbanBoard ordensServico={ordensServico.filter(os => (!debouncedSearchTerm || os.placa.includes(debouncedSearchTerm.toUpperCase())))} columns={COLUMNS} onStatusChange={handleStatusChangeRequest} onEditOs={os => { setEditingOs(os); setIsOsModalOpen(true); }} onDeleteOs={id => setOrdensServico(prev => prev.filter(os => os.id !== id))} onShowQr={os => { setSelectedOsForQr(os); setIsQrModalOpen(true); }} />
                    </>
                )}
            </main>

            {isOsModalOpen && <OsModal isOpen={isOsModalOpen} onClose={() => { setIsOsModalOpen(false); setEditingOs(null); }} onSave={os => { if (editingOs) setOrdensServico(prev => prev.map(x => x.id === editingOs.id ? {...x, ...os} : x)); else setOrdensServico(prev => [...prev, { ...os, id: getNextId(prev), history: [] }]); setIsOsModalOpen(false); }} os={editingOs} vehicleDatabase={vehicleDatabase} preventiveDatabase={preventiveDatabase} showToast={showToast} />}
            {isFilterModalOpen && <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilters={setFilters} currentFilters={filters} />}
            {isReportsModalOpen && <ReportsModal isOpen={isReportsModalOpen} onClose={() => setIsReportsModalOpen(false)} ordensServico={ordensServico} />}
            {isQrModalOpen && selectedOsForQr && <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} os={selectedOsForQr} />}
            {isPasswordModalOpen && (
                <PasswordModal 
                    isOpen={isPasswordModalOpen} 
                    onClose={() => { setIsPasswordModalOpen(false); setPendingTransition(null); }} 
                    onSuccess={confirmStatusChange} 
                />
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default App;
