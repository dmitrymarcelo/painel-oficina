
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { OrdemServico, Vehicle, Status, ToastMessage, Filters, StatusChange } from './types';
import { INITIAL_OS_DATA, INITIAL_VEHICLE_DATA, COLUMNS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { getNextId } from './utils/formatters';

import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TimeStatsBar from './components/TimeStatsBar';
import KanbanBoard from './components/KanbanBoard';
import OsModal from './components/OsModal';
import FilterModal from './components/FilterModal';
import ReportsModal from './components/ReportsModal';
import BaseManagementModal from './components/BaseManagementModal';
import Toast from './components/Toast';

const App: React.FC = () => {
    const [ordensServico, setOrdensServico] = useLocalStorage<OrdemServico[]>('oficina_ordens_servico', INITIAL_OS_DATA);
    const [vehicleDatabase, setVehicleDatabase] = useLocalStorage<Vehicle[]>('oficina_vehicle_database', INITIAL_VEHICLE_DATA);
    
    const [isOsModalOpen, setIsOsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
    const [isBaseModalOpen, setIsBaseModalOpen] = useState(false);
    
    const [editingOs, setEditingOs] = useState<OrdemServico | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [filters, setFilters] = useState<Filters>({});
    
    const [toast, setToast] = useState<ToastMessage | null>(null);

    // Sincronização em tempo real entre abas do navegador
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'oficina_ordens_servico' && e.newValue) {
                setOrdensServico(JSON.parse(e.newValue));
            }
            if (e.key === 'oficina_vehicle_database' && e.newValue) {
                setVehicleDatabase(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [setOrdensServico, setVehicleDatabase]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        setToast({ id: Date.now(), message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleImportData = useCallback((data: any) => {
        try {
            if (data.ordensServico) setOrdensServico(data.ordensServico);
            if (data.vehicleDatabase) setVehicleDatabase(data.vehicleDatabase);
            showToast('Dados restaurados com sucesso!', 'success');
        } catch (e) {
            showToast('Erro ao processar arquivo de backup.', 'error');
        }
    }, [setOrdensServico, setVehicleDatabase, showToast]);

    const handleNewOsClick = useCallback(() => {
        setEditingOs(null);
        setIsOsModalOpen(true);
    }, []);

    const handleEditOs = useCallback((os: OrdemServico) => {
        setEditingOs(os);
        setIsOsModalOpen(true);
    }, []);

    const handleDeleteOs = useCallback((id: number) => {
        if (window.confirm(`Tem certeza que deseja excluir a O.S. #${id}?`)) {
            setOrdensServico(prev => prev.filter(os => os.id !== id));
            showToast('O.S. excluída com sucesso!', 'success');
        }
    }, [setOrdensServico, showToast]);
    
    const handleSaveOs = useCallback((osData: Omit<OrdemServico, 'id' | 'history'>) => {
        if (editingOs) {
            setOrdensServico(prev => prev.map(os => {
                if (os.id === editingOs.id) {
                    const updatedOs = { ...os, ...osData, id: editingOs.id };
                    if (osData.status !== editingOs.status) {
                        const newHistoryEntry: StatusChange = {
                            status: osData.status,
                            timestamp: new Date().toISOString()
                        };
                        updatedOs.history = [...(os.history || []), newHistoryEntry];
                    }
                    return updatedOs;
                }
                return os;
            }));
            showToast('O.S. atualizada com sucesso!', 'success');
        } else {
            const newOs: OrdemServico = { 
                ...osData, 
                id: getNextId(ordensServico),
                history: [{ status: osData.status, timestamp: osData.dataEntrada }]
            };
            setOrdensServico(prev => [...prev, newOs]);
            showToast('Nova O.S. criada com sucesso!', 'success');
        }
        setIsOsModalOpen(false);
        setEditingOs(null);
    }, [editingOs, setOrdensServico, showToast, ordensServico]);

    const handleStatusChange = useCallback((id: number, newStatus: Status) => {
        setOrdensServico(prev => prev.map(os => {
            if (os.id === id) {
                 if (os.status === newStatus) return os;

                const oldStatus = os.status;
                const isNowFinished = ['finalizado', 'entregue'].includes(newStatus);
                const wasFinished = ['finalizado', 'entregue'].includes(oldStatus);
                
                const updatedOs: OrdemServico = { ...os, status: newStatus };

                if (isNowFinished && !wasFinished) {
                    updatedOs.tempoFinal = new Date().toISOString();
                    updatedOs.dataFinalizacao = updatedOs.tempoFinal;
                } else if (!isNowFinished && wasFinished) {
                    updatedOs.tempoFinal = null;
                    updatedOs.dataFinalizacao = null;
                }

                const newHistoryEntry: StatusChange = {
                    status: newStatus,
                    timestamp: new Date().toISOString(),
                };
                updatedOs.history = [...(os.history || []), newHistoryEntry];

                return updatedOs;
            }
            return os;
        }));
        showToast(`Status da O.S. #${id} alterado.`, 'info');
    }, [setOrdensServico, showToast]);

    const filteredOrdensServico = useMemo(() => {
        const lowerSearch = debouncedSearchTerm.trim().toLowerCase();
        return ordensServico.filter(os => {
            const searchMatch = lowerSearch === '' ||
                os.placa.toLowerCase().includes(lowerSearch) ||
                os.veiculo.toLowerCase().includes(lowerSearch) ||
                os.servico.toLowerCase().includes(lowerSearch) ||
                os.id.toString().includes(lowerSearch);

            const priorityMatch = !filters.priority || os.prioridade === filters.priority;
            const statusMatch = !filters.status || os.status === filters.status;
            const dateFromMatch = !filters.dateFrom || new Date(os.dataEntrada) >= new Date(filters.dateFrom);
            const dateToMatch = !filters.dateTo || new Date(os.dataEntrada) <= new Date(filters.dateTo + 'T23:59:59');

            return searchMatch && priorityMatch && statusMatch && dateFromMatch && dateToMatch;
        });
    }, [ordensServico, debouncedSearchTerm, filters]);
    
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-dark-bg text-text-light font-sans text-sm">
            <Header
                onNewOsClick={handleNewOsClick}
                onFilterClick={() => setIsFilterModalOpen(true)}
                onReportsClick={() => setIsReportsModalOpen(true)}
                onBaseClick={() => setIsBaseModalOpen(true)}
                onImportData={handleImportData}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showToast={showToast}
            />
            
            <main className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
                <div className="flex-shrink-0">
                    <TimeStatsBar ordensServico={ordensServico} />
                    <StatsBar ordensServico={ordensServico} />
                </div>
                
                <KanbanBoard
                    ordensServico={filteredOrdensServico}
                    columns={COLUMNS}
                    onStatusChange={handleStatusChange}
                    onEditOs={handleEditOs}
                    onDeleteOs={handleDeleteOs}
                />
            </main>

            {isOsModalOpen && (
                <OsModal
                    isOpen={isOsModalOpen}
                    onClose={() => setIsOsModalOpen(false)}
                    onSave={handleSaveOs}
                    os={editingOs}
                    vehicleDatabase={vehicleDatabase}
                    showToast={showToast}
                />
            )}

            {isFilterModalOpen && (
                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    onApplyFilters={setFilters}
                    currentFilters={filters}
                />
            )}

            {isReportsModalOpen && (
                <ReportsModal
                    isOpen={isReportsModalOpen}
                    onClose={() => setIsReportsModalOpen(false)}
                    ordensServico={ordensServico}
                />
            )}

            {isBaseModalOpen && (
                <BaseManagementModal
                    isOpen={isBaseModalOpen}
                    onClose={() => setIsBaseModalOpen(false)}
                    vehicleDatabase={vehicleDatabase}
                    setVehicleDatabase={setVehicleDatabase}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default App;
