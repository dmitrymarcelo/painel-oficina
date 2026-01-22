
import { OrdemServico, Vehicle, Status, ColumnConfig } from './types';
import { ClockIcon, StethoscopeIcon, BoxIcon, WrenchScrewdriverIcon, CheckCircleIcon, TruckIcon } from './components/Icons';

export const INITIAL_OS_DATA: OrdemServico[] = [
    {
        id: 1,
        veiculo: "Gol 1.0 2018",
        placa: "ABC-1234",
        centroCusto: "MULTIFUNCIONAL INTERIOR",
        numeroFrota: "FROTA-001",
        servico: "Troca de óleo e revisão completa",
        status: "aguardando",
        prioridade: "normal",
        dataEntrada: "2024-07-20T08:30:00Z",
        dataFinalizacao: null,
        valorEstimado: 350.00,
        tempoInicio: "2024-07-20T08:30:00Z",
        tempoFinal: null,
        history: [
            { status: 'aguardando', timestamp: "2024-07-20T08:30:00Z" }
        ]
    },
    {
        id: 2,
        veiculo: "Civic 2.0 2020",
        placa: "XYZ-5678",
        centroCusto: "DESMOBILIZADO",
        numeroFrota: "FROTA-002",
        servico: "Conserto de ar condicionado. Verificar vazamento no sistema e recarregar o gás refrigerante.",
        status: "diagnostico",
        prioridade: "urgente",
        dataEntrada: "2024-07-21T10:15:00Z",
        dataFinalizacao: null,
        valorEstimado: 890.50,
        tempoInicio: "2024-07-21T10:15:00Z",
        tempoFinal: null,
        history: [
            { status: 'aguardando', timestamp: "2024-07-21T10:15:00Z" },
            { status: 'diagnostico', timestamp: "2024-07-21T11:00:00Z" }
        ]
    },
    {
        id: 3,
        veiculo: "Fiesta 1.6 2019",
        placa: "DEF-9012",
        centroCusto: "MULTIFUNCIONAL INTERIOR",
        numeroFrota: "FROTA-003",
        servico: "Substituição de amortecedores dianteiros e traseiros.",
        status: "finalizado",
        prioridade: "normal",
        dataEntrada: "2024-07-19T09:00:00Z",
        dataFinalizacao: "2024-07-21T14:30:00Z",
        valorEstimado: 1200.00,
        tempoInicio: "2024-07-19T09:00:00Z",
        tempoFinal: "2024-07-21T14:30:00Z",
        history: [
            { status: 'aguardando', timestamp: "2024-07-19T09:00:00Z" },
            { status: 'em-andamento', timestamp: "2024-07-20T10:00:00Z" },
            { status: 'finalizado', timestamp: "2024-07-21T14:30:00Z" }
        ]
    },
    {
        id: 4,
        veiculo: "Hilux 2.8 2021",
        placa: "GHI-3456",
        centroCusto: "MANUTENÇÃO LEVE",
        numeroFrota: "FROTA-004",
        servico: "Troca de correia dentada e tensor.",
        status: "entregue",
        prioridade: "urgente",
        dataEntrada: "2024-07-18T14:00:00Z",
        dataFinalizacao: "2024-07-20T16:45:00Z",
        valorEstimado: 2100.75,
        tempoInicio: "2024-07-18T14:00:00Z",
        tempoFinal: "2024-07-20T16:45:00Z",
        history: [
            { status: 'aguardando', timestamp: "2024-07-18T14:00:00Z" },
            { status: 'em-andamento', timestamp: "2024-07-19T08:30:00Z" },
            { status: 'finalizado', timestamp: "2024-07-20T15:00:00Z" },
            { status: 'entregue', timestamp: "2024-07-20T16:45:00Z" }
        ]
    }
];

export const INITIAL_VEHICLE_DATA: Vehicle[] = [
    { placa: "TSN-9G18", centroCusto: "DIRETORIA-ADM", modelo: "TOYOTA HILUX", numeroFrota: "FROTA-101" },
    { placa: "ABC-1234", centroCusto: "MULTIFUNCIONAL INTERIOR", modelo: "VW GOL 1.0 2018", numeroFrota: "FROTA-001" },
    { placa: "XYZ-5678", centroCusto: "DESMOBILIZADO", modelo: "HONDA CIVIC 2.0 2020", numeroFrota: "FROTA-002" },
    { placa: "DEF-9012", centroCusto: "MULTIFUNCIONAL INTERIOR", modelo: "FORD FIESTA 1.6 2019", numeroFrota: "FROTA-003" },
    { placa: "GHI-3456", centroCusto: "MANUTENÇÃO LEVE", modelo: "TOYOTA HILUX 2.8 2021", numeroFrota: "FROTA-004" }
];


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
