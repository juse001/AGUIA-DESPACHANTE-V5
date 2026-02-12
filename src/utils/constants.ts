import { TipoProcesso, StatusProcesso, StatusDocumento } from '../types';

export const nomesTipoProcesso: Record<TipoProcesso, string> = {
  [TipoProcesso.AQUISICAO_ARMA_SINARM]: 'Aquisição de Arma de Fogo SINARM',
  [TipoProcesso.AQUISICAO_ARMA_CR_ATIRADOR]: 'Aquisição de Arma de Fogo CR (Acervo de Atirador)',
  [TipoProcesso.AQUISICAO_ARMA_CR_CACADOR]: 'Aquisição de Arma de Fogo CR (Acervo de Caçador)',
  [TipoProcesso.CRAF_CR]: 'CRAF CR',
  [TipoProcesso.GUIA_TRAFEGO_CACA]: 'Guia de Tráfego (Caça)',
  [TipoProcesso.GUIA_TRAFEGO_MUDANCA_ACERVO]: 'Guia de Tráfego (Mudança de Acervo)',
  [TipoProcesso.GUIA_TRAFEGO_RECUPERACAO]: 'Guia de Tráfego (Recuperação)',
  [TipoProcesso.GUIA_TRAFEGO_TIRO]: 'Guia de Tráfego (Tiro)',
  [TipoProcesso.GUIA_TRAFEGO_SINARM]: 'Guia de Tráfego SINARM',
  [TipoProcesso.TRANSFERENCIA_ARMA_CR]: 'Transferência de Arma de Fogo CR',
  [TipoProcesso.CR_ATIRADOR_CACADOR]: 'CR Atirador e Caçador (Concessão e Apostilamento)',
};

export const nomesStatusProcesso: Record<StatusProcesso, string> = {
  [StatusProcesso.ABERTO]: 'Aberto',
  [StatusProcesso.EM_ANALISE]: 'Em Análise',
  [StatusProcesso.DOCUMENTACAO_INCOMPLETA]: 'Documentação Incompleta',
  [StatusProcesso.DOCUMENTACAO_COMPLETA]: 'Documentação Completa',
  [StatusProcesso.DOCUMENTACAO_COMPLETA_PARA_PROTOCOLO]: 'Documentação Completa para Protocolo',
  [StatusProcesso.DEFERIDO]: 'Deferido',
  [StatusProcesso.INDEFERIDO]: 'Indeferido',
  [StatusProcesso.ENTREGUE_AO_CLIENTE]: 'Entregue ao Cliente',
  [StatusProcesso.RESTITUIDO]: 'Restituído',
};

export const nomesStatusDocumento: Record<StatusDocumento, string> = {
  [StatusDocumento.PENDENTE]: 'Pendente',
  [StatusDocumento.ENTREGUE]: 'Entregue',
  [StatusDocumento.REJEITADO]: 'Rejeitado',
  [StatusDocumento.NAO_APLICAVEL]: 'Não Aplicável',
};

export const coresStatusProcesso: Record<StatusProcesso, string> = {
  [StatusProcesso.ABERTO]: 'bg-red-100 text-red-800',
  [StatusProcesso.EM_ANALISE]: 'bg-green-100 text-green-800',
  [StatusProcesso.DOCUMENTACAO_INCOMPLETA]: 'bg-yellow-100 text-yellow-800',
  [StatusProcesso.DOCUMENTACAO_COMPLETA]: 'bg-green-100 text-green-800',
  [StatusProcesso.DOCUMENTACAO_COMPLETA_PARA_PROTOCOLO]: 'bg-yellow-100 text-yellow-800',
  [StatusProcesso.DEFERIDO]: 'bg-emerald-100 text-emerald-800',
  [StatusProcesso.INDEFERIDO]: 'bg-red-100 text-red-800',
  [StatusProcesso.ENTREGUE_AO_CLIENTE]: 'bg-gray-100 text-gray-800',
  [StatusProcesso.RESTITUIDO]: 'bg-purple-100 text-purple-800',
};

export const coresStatusDocumento: Record<StatusDocumento, string> = {
  [StatusDocumento.PENDENTE]: 'bg-yellow-100 text-yellow-800',
  [StatusDocumento.ENTREGUE]: 'bg-green-100 text-green-800',
  [StatusDocumento.REJEITADO]: 'bg-red-100 text-red-800',
  [StatusDocumento.NAO_APLICAVEL]: 'bg-gray-100 text-gray-800',
};

export const formatarCPF = (cpf: string): string => {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
};

export const formatarTelefone = (telefone: string): string => {
  const apenasNumeros = telefone.replace(/\D/g, '');
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (apenasNumeros.length === 10) {
    return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
};

export const calcularDiasDecorridos = (data: Date): number => {
  const hoje = new Date();
  const diferenca = hoje.getTime() - new Date(data).getTime();
  return Math.floor(diferenca / (1000 * 60 * 60 * 24));
};

export const calcularDiasRestantes = (data: Date): number => {
  const hoje = new Date();
  const diferenca = new Date(data).getTime() - hoje.getTime();
  return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
};

export const formatarData = (data: Date | string): string => {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const obterCorStatusProcesso = (status: StatusProcesso): string => {
  return coresStatusProcesso[status];
};

export const obterCorStatusDocumento = (status: StatusDocumento): string => {
  return coresStatusDocumento[status];
};
