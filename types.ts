
import React from 'react';

export type ViewType = 'dashboard' | 'fleet' | 'preventive' | 'vehicle-models';
export type Status = 'aguardando' | 'diagnostico' | 'aguardando-pecas' | 'em-andamento' | 'finalizado' | 'entregue';
export type Priority = 'normal' | 'urgente';
export type MaintenanceType = 'PREVENTIVA' | 'CORRETIVA' | 'SINISTRO' | 'FUNILARIA E PINTURA';

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
    tipoManutencao: MaintenanceType;
    dataEntrada: string;
    dataFinalizacao: string | null;
    valorEstimado?: number;
    tempoInicio: string;
    tempoFinal: string | null;
    history?: StatusChange[];
}

export interface PreventiveItem {
    prioridadeData: string;
    prioridadeKm: string;
    kmProxManutencao: string;
    placa: string;
    modelo: string;
    modalidade: string;
    centroCusto: string;
    motorista: string;
    lotacao: string;
    dataUltimaManutencao: string;
    kmUltimaManutencao: string;
    kmAtual: string;
    kmProxManutencaoReal: string;
    kmFaltaUltrapassa: string;
    dataProximaManutencao: string;
    situacao: string;
}

export interface ModelPart {
    id: string;
    nome: string;
    codigoMaterial: string;
    vidaUtilKm: number;
    vidaUtilMeses: number;
    valor: number;
    dataCadastro: string;
}

export interface ModelService {
    id: string;
    nome: string;
    vidaUtilKm: number;
    vidaUtilMeses: number;
    valor: number;
    dataCadastro: string;
}

export interface VehicleModel {
    id: string;
    descricao: string;
    marca: string;
    tipoVeiculo: string;
    tipoPorte: string;
    formula: string;
    quantidadeBaterias: number;
    mediaKmL: number;
    autonomiaMedia: number;
    controlaHorimetro: boolean;
    ativo: boolean;
    pecas: ModelPart[];
    servicos: ModelService[];
    dataCadastro: string;
    usuarioCadastro: string;
}

export interface Vehicle {
    codigoFrota: string;
    placa: string;
    modelo: string;
    centroCusto: string;
    numeroFrota?: string;
    kmAtual?: string;
    renavam?: string;
    chassiMotor?: string;
    cidade?: string;
    combustivel?: string;
    statusVeiculo?: string;
    setorVeiculo?: string;
    cor?: string;
    anoModelo?: string;
    anoFabricacao?: string;
    horimetro?: string;
    kmUltimaManutencao?: string;
    kmProximaManutencao?: string;
    velMaxTransito?: string;
    velMaxVeiculo?: string;
    dataUltimaManutencao?: string;
    limiteAbastecimento?: string;
    assistenteResponsavel?: string;
    reserva?: boolean;
    aparelho?: string;
    escala?: string;
    lotacao?: string;
    proprietarioCpfCnpj?: string;
    modalidade?: string;
    valorPadraoLocacao?: string;
    integracaoRastreamento?: boolean;
    lid?: string;
    capacidadeCarga?: string;
    capacidadeMaxTracao?: string;
    pesoBruto?: string;
    controleOsm?: boolean;
    controleUsoForaTurno?: boolean;
    bloqueioForaTurno?: boolean;
    emitirAlertas?: boolean;
    ativo?: boolean;
    observacoes?: string;
    gestaoMultas?: boolean;
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
