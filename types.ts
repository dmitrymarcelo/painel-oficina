// FIX: Import React to provide the React namespace for types like React.ComponentType.
import React from 'react';

export type Status = 'aguardando' | 'diagnostico' | 'aguardando-pecas' | 'em-andamento' | 'finalizado' | 'entregue';
export type Priority = 'normal' | 'urgente';

export interface StatusChange {
  status: Status;
  timestamp: string;
}

export interface OrdemServico {
    id: number;
    veiculo: string;
    placa: string;
    centroCusto: string;
    numeroFrota?: string;
    servico: string;
    status: Status;
    prioridade: Priority;
    dataEntrada: string; // ISO string
    dataFinalizacao: string | null; // ISO string
    valorEstimado?: number;
    tempoInicio: string; // ISO string for timer
    tempoFinal: string | null; // ISO string for timer
    history?: StatusChange[];
}

export interface Vehicle {
    placa: string;
    centroCusto: string;
    modelo: string;
    numeroFrota: string;
}

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export interface Filters {
    priority?: Priority | '';
    status?: Status | '';
    dateFrom?: string;
    dateTo?: string;
}

export interface ColumnConfig {
    id: Status;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
}