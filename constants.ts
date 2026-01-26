
import { OrdemServico, Vehicle, Status, ColumnConfig } from './types';
import { ClockIcon, StethoscopeIcon, BoxIcon, WrenchScrewdriverIcon, CheckCircleIcon, TruckIcon } from './components/Icons';

export const INITIAL_OS_DATA: OrdemServico[] = [];

export const INITIAL_VEHICLE_DATA: Vehicle[] = [];

export const STATUS_NAMES: { [key in Status]: string } = {
    'aguardando': 'Aguardando',
    'diagnostico': 'Diagnóstico',
    'aguardando-pecas': 'Aguardando Peças',
    'em-andamento': 'Em Andamento',
    'finalizado': 'Finalizado',
    'entregue': 'Entregue'
};

export const COLUMNS: ColumnConfig[] = [
    { id: 'aguardando', title: 'Aguardando', icon: ClockIcon },
    { id: 'diagnostico', title: 'Diagnóstico', icon: StethoscopeIcon },
    { id: 'aguardando-pecas', title: 'Aguardando Peças', icon: BoxIcon },
    { id: 'em-andamento', title: 'Em Andamento', icon: WrenchScrewdriverIcon },
    { id: 'finalizado', title: 'Finalizado', icon: CheckCircleIcon },
    { id: 'entregue', title: 'Entregue', icon: TruckIcon },
];
