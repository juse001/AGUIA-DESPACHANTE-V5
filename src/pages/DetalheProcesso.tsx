import React, { useState, useEffect } from 'react';
import { StatusDocumento, Processo, StatusProcesso } from '../types';
import { useDocumentosStore } from '../stores/documentosStore';
import { useProcessosStore } from '../stores/processosStore';
import { db } from '../db/database';
import { Button, Alert } from '../components';
import { coresStatusDocumento, nomesTipoProcesso, nomesStatusProcesso } from '../utils/constants';
import { Trash2, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DetalheProcessoProps {
  processoId: string;
  onVoltar: () => void;
}

// Mapeamento de documentos requeridos por tipo de processo
const documentosPorTipo: Record<string, string[]> = {
  AQUISICAO_ARMA_SINARM: [
    'Certidão de Antecedentes Criminais',
    'Comprovante bancário de pagamento da taxa',
    'Comprovante de Capacidade Técnica para o manuseio de arma de fogo',
    'Comprovante de Ocupação Lícita',
    'Comprovante de Residência Fixa',
    'Documento de Identificação Pessoal',
    'EFETIVA NECESSIDADE',
    'Foto 3x4 recente',
    'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
    'Procuração',
    'Requerimento SINARM Assinado',
  ],
  AQUISICAO_ARMA_CR_ATIRADOR: [
    'Certidão de Antecedentes Criminais',
    'Comprovante de Capacidade Técnica para o manuseio de arma de fogo',
    'Comprovante de Ocupação Lícita',
    'Comprovante de Residência Fixa (5 ANOS)',
    'Declaração de não estar respondendo a inquérito policial ou a processo criminal',
    'Declaração de Segurança do Acervo (ESPECIFICO PARA COMPRA)',
    'Documento de Identificação Pessoal',
    'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
    'Modelo, Marca e loja',
    'Comprovante de habitualidade na forma da norma vigente',
  ],
  AQUISICAO_ARMA_CR_CACADOR: [
    'Certidão de Antecedentes Criminais',
    'Comprovante da necessidade de abate de fauna invasora expedido pelo Ibama',
    'Comprovante de Capacidade Técnica para o manuseio de arma de fogo',
    'Comprovante de filiação a entidade de tiro desportivo',
    'Comprovante de Ocupação Lícita',
    'Comprovante de Residência Fixa (5 ANOS)',
    'Declaração de não estar respondendo a inquérito policial ou a processo criminal',
    'Declaração de Segurança do Acervo (ESPECIFICO PARA COMPRA)',
    'Documento de Identificação Pessoal',
    'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
    'Modelo, Marca e loja',
  ],
  CRAF_CR: [
    'Documento de Identificação Pessoal',
    'Autorizar aquisição de arma de fogo',
    'Nota Fiscal',
  ],
  GUIA_TRAFEGO_CACA: [
    'Comprovante de filiação a entidade de tiro desportivo',
    'Dados da arma correspondentes à respectiva guia',
    'Documento de Identificação Pessoal',
    'Autorização de manejo de caça emitida pelo IBAMA, acompanhada do CAR da respectiva fazenda',
  ],
  GUIA_TRAFEGO_MUDANCA_ACERVO: [
    'Comprovante de Residência Fixa',
    'Dados da arma correspondentes à respectiva guia',
    'Dados, Endereço de origem e endereço de destino',
    'Documento de Identificação Pessoal',
  ],
  GUIA_TRAFEGO_RECUPERACAO: [
    'Dados da arma correspondentes à respectiva guia',
    'Documento de Identificação Pessoal',
    'Documento de regularização ou restituição da arma de fogo',
  ],
  GUIA_TRAFEGO_TIRO: [
    'Dados da arma correspondentes à respectiva guia',
    'Documento de Identificação Pessoal',
    'Dados do clube de destino',
  ],
  GUIA_TRAFEGO_SINARM: [
    'Comprovante de Residência Fixa',
    'Documento de Identificação Pessoal',
    'Documento que comprove a necessidade da emissão da guia',
    'Registro da arma',
  ],
  TRANSFERENCIA_ARMA_CR: [
    'Certidão de Antecedentes Criminais',
    'Comprovante de Capacidade Técnica para o manuseio de arma de fogo',
    'Comprovante de Ocupação Lícita',
    'Comprovante de Residência Fixa (5 ANOS)',
    'Declaração de não estar respondendo a inquérito policial ou a processo criminal',
    'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
    'Anexo M de transferência - assinada pelas partes',
    'Termo de transferência de propriedade da arma de fogo',
  ],
  CR_ATIRADOR_CACADOR: [
    'Certidão de Antecedentes Criminais',
    'Comprovante de Ocupação Lícita',
    'Comprovante de Residência Fixa (5 ANOS)',
    'Declaração de não estar respondendo a inquérito policial ou a processo criminal',
    'Documento de Identificação Pessoal',
    'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
  ],
};

export const DetalheProcesso: React.FC<DetalheProcessoProps> = ({ processoId, onVoltar }) => {
  const { buscarProcesso, atualizarStatusProcesso, atualizarProcesso } = useProcessosStore();
  const {
    documentosProcesso,
    carregarDocumentosPorProcesso,
    adicionarDocumentoProcesso,
    deletarDocumentoProcesso,
    atualizarStatusDocumento,
    atualizarDocumentoProcesso,
  } = useDocumentosStore();
  
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    carregarDados();
  }, [processoId]);

  // Sincronizar descrição quando o modal é reaberto
  useEffect(() => {
    if (processoId && processo) {
      // Recarregar dados do processo para garantir descrição atualizada
      carregarDados();
    }
  }, [processoId]);

  useEffect(() => {
    if (!processo) return;
    // Reavalia automaticamente quando o checklist muda
    void avaliarStatusAutomatico(processo);
  }, [documentosProcesso, processo?.id]);

  const normalizarNomeDocumento = (nome: string): string => {
    return nome
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Obtém chave normalizada para comparação
  const obterChaveNormalizada = (nome: string): string => {
    return normalizarNomeDocumento(nome);
  };

  const obterRecomendadosUnicos = (tipo: string): string[] => {
    const recomendadosBrutos = documentosPorTipo[tipo] || [];
    const unicos: string[] = [];
    const chaveVistas = new Set<string>();
    
    for (const nome of recomendadosBrutos) {
      const chave = obterChaveNormalizada(nome);
      if (chaveVistas.has(chave)) continue;
      chaveVistas.add(chave);
      unicos.push(nome.trim());
    }
    
    return unicos;
  };

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const proc = await buscarProcesso(processoId);
      setProcesso(proc || null);
      
      if (proc) {
        await carregarDocumentosPorProcesso(processoId);
        await removerDuplicados(proc.id);
        await sincronizarChecklist(proc);
        await carregarDocumentosPorProcesso(processoId);
      }
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao carregar processo' });
    } finally {
      setCarregando(false);
    }
  };

  const avaliarStatusAutomatico = async (proc: Processo) => {
    const docs = documentosProcesso.filter((d) => d.processoId === proc.id);
    if (docs.length === 0) return;

    const concluidos = docs.filter(
      (d) => d.status === StatusDocumento.ENTREGUE || d.status === StatusDocumento.NAO_APLICAVEL
    ).length;
    const completo = concluidos === docs.length;

    if (!completo) return;

    // Não sobrescreve status finais
    if (
      proc.status === StatusProcesso.FINALIZADO ||
      proc.status === StatusProcesso.REJEITADO ||
      proc.status === StatusProcesso.APROVADO
    ) {
      return;
    }

    if (proc.status !== StatusProcesso.PRONTO_PARA_PROTOCOLO) {
      await atualizarStatusProcesso(proc.id, StatusProcesso.PRONTO_PARA_PROTOCOLO);
      setProcesso((prev) => (prev ? { ...prev, status: StatusProcesso.PRONTO_PARA_PROTOCOLO } : prev));
    }
  };

  const sincronizarChecklist = async (proc: Processo) => {
    const recomendados = obterRecomendadosUnicos(proc.tipo);
    if (recomendados.length === 0) return;

    // Busca documentos diretamente do banco
    let processoDocs = await db.documentosProcesso
      .where('processoId')
      .equals(proc.id)
      .toArray();

    // Mapeia chaves normalizadas dos documentos que já existem
    const chavasExistentes = new Set<string>();
    for (const doc of processoDocs) {
      const chave = obterChaveNormalizada(doc.nome);
      chavasExistentes.add(chave);
    }

    // Adiciona documentos faltantes (se a chave normalizada não existe)
    for (const nome of recomendados) {
      const chave = obterChaveNormalizada(nome);
      if (!chavasExistentes.has(chave)) {
        await adicionarDocumentoProcesso({
          processoId: proc.id,
          documentoId: `req_${proc.tipo}_${chave.replace(/\s+/g, '_')}`,
          nome: nome.trim(),
          status: StatusDocumento.PENDENTE,
        });
        // Marca chave como adicionada para evitar duplicatas nesta sessão
        chavasExistentes.add(chave);
      }
    }
    
    // Verifica e remove qualquer duplicata que possa ter sido criada
    await removerDuplicados(proc.id);
  };

  const removerDuplicados = async (procId: string) => {
    // Busca documentos diretamente do banco (não depende do state do React)
    const docs = await db.documentosProcesso
      .where('processoId')
      .equals(procId)
      .toArray();
    
    if (docs.length <= 1) return;

    // Agrupa por chave normalizada
    const grupos: { [chave: string]: typeof docs } = {};
    
    for (const doc of docs) {
      const chave = obterChaveNormalizada(doc.nome);
      if (!grupos[chave]) {
        grupos[chave] = [];
      }
      grupos[chave].push(doc);
    }

    // Remove duplicadas em cada grupo
    const pesoStatus = (status: StatusDocumento) => {
      switch (status) {
        case StatusDocumento.ENTREGUE:
          return 3;
        case StatusDocumento.NAO_APLICAVEL:
          return 2;
        case StatusDocumento.PENDENTE:
        case StatusDocumento.REJEITADO:
        default:
          return 1;
      }
    };

    for (const [, itens] of Object.entries(grupos)) {
      if (itens.length <= 1) continue;

      // Mantém o item "mais avançado" (OK > Não precisa > Pendente)
      const ordenados = [...itens].sort((a, b) => {
        const diff = pesoStatus(b.status) - pesoStatus(a.status);
        if (diff !== 0) return diff;
        const da = a.dataEntrega ? new Date(a.dataEntrega).getTime() : 0;
        const db = b.dataEntrega ? new Date(b.dataEntrega).getTime() : 0;
        return db - da;
      });

      const manter = ordenados[0];
      const remover = ordenados.slice(1);

      // Remove duplicados extras
      for (const extra of remover) {
        await deletarDocumentoProcesso(extra.id);
      }

      // Se algum duplicado tinha uma data de entrega e o mantido não tem, preserva
      if (manter.status === StatusDocumento.ENTREGUE && !manter.dataEntrega) {
        const comData = ordenados.find((d) => d.status === StatusDocumento.ENTREGUE && d.dataEntrega);
        if (comData?.dataEntrega) {
          await atualizarDocumentoProcesso(manter.id, { dataEntrega: comData.dataEntrega });
        }
      }
    }
  };

  const handleAtualizarStatus = async (docId: string, novoStatus: StatusDocumento) => {
    try {
      await atualizarStatusDocumento(docId, novoStatus);
      setMensagem({ tipo: 'success', texto: 'Status do documento atualizado!' });
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao atualizar status' });
    }
  };

  const handleDeletarDocumento = async (docId: string) => {
    if (window.confirm('Deletar este documento?')) {
      try {
        await deletarDocumentoProcesso(docId);
        setMensagem({ tipo: 'success', texto: 'Documento deletado!' });
      } catch (error) {
        setMensagem({ tipo: 'error', texto: 'Erro ao deletar documento' });
      }
    }
  };

  const documentosRecomendados = processo ? obterRecomendadosUnicos(processo.tipo) : [];
  
  // Deduplicação na renderização para garantir sem duplicatas
  const documentosUnicos = Array.from(
    documentosProcesso.reduce((mapa, doc) => {
      const chave = obterChaveNormalizada(doc.nome);
      const existente = mapa.get(chave);
      
      // Mantém o documento com status mais avançado
      const pesoStatus = (d: typeof doc) => {
        switch (d.status) {
          case StatusDocumento.ENTREGUE: return 3;
          case StatusDocumento.NAO_APLICAVEL: return 2;
          default: return 1;
        }
      };
      
      if (!existente || pesoStatus(doc) > pesoStatus(existente)) {
        mapa.set(chave, doc);
      }
      return mapa;
    }, new Map<string, typeof documentosProcesso[0]>())
    .values()
  );
  
  const documentosPendentes = documentosUnicos.filter((d) => d.status === StatusDocumento.PENDENTE).length;
  const documentosEntregues = documentosUnicos.filter((d) => d.status === StatusDocumento.ENTREGUE).length;
  const documentosNaoPrecisa = documentosUnicos.filter((d) => d.status === StatusDocumento.NAO_APLICAVEL).length;
  const documentosConcluidos = documentosEntregues + documentosNaoPrecisa;
  const percentualConclusao = documentosUnicos.length > 0 ? (documentosConcluidos / documentosUnicos.length * 100).toFixed(1) : 0;

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!processo) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-900 font-semibold mb-4">Processo não encontrado</p>
        <Button variant="secondary" onClick={onVoltar}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="secondary" onClick={onVoltar} className="mb-4">
            ← Voltar
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">Detalhes do Processo</h1>
        </div>
      </div>

      {/* Mensagens */}
      {mensagem && (
        <Alert
          type={mensagem.tipo}
          message={mensagem.texto}
          onClose={() => setMensagem(null)}
        />
      )}

      {/* Informações do Processo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-primary-600">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Tipo de Processo</p>
          <p className="text-2xl font-bold text-gray-900 mt-3">{nomesTipoProcesso[processo.tipo]}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Status</p>
          <div className="mt-3">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${coresStatusDocumento[StatusDocumento.PENDENTE]}`}>
              {nomesStatusProcesso[processo.status]}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-600">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Data de Abertura</p>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            {new Date(processo.dataAbertura).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h2>
        <textarea
          value={processo.observacoes || ''}
          onChange={async (e) => {
            const novasObserv = e.target.value;
            setProcesso((prev) => (prev ? { ...prev, observacoes: novasObserv } : prev));
            try {
              await atualizarProcesso(processo.id, { observacoes: novasObserv });
              setMensagem({ tipo: 'success', texto: 'Descrição atualizada!' });
            } catch (error) {
              setMensagem({ tipo: 'error', texto: 'Erro ao atualizar descrição' });
            }
          }}
          placeholder="Adicione uma descrição para este processo..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {/* Progresso de Documentação */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Progresso da Documentação</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center bg-green-50 rounded-lg p-6 border border-green-200">
            <p className="text-4xl font-bold text-green-600">{documentosConcluidos}</p>
            <p className="text-sm text-green-700 flex items-center justify-center gap-2 mt-2 font-semibold">
              <CheckCircle className="w-5 h-5" /> Concluídos
            </p>
          </div>
          
          <div className="text-center bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <p className="text-4xl font-bold text-yellow-600">{documentosPendentes}</p>
            <p className="text-sm text-yellow-700 flex items-center justify-center gap-2 mt-2 font-semibold">
              <Clock className="w-5 h-5" /> Pendentes
            </p>
          </div>

          <div className="text-center bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-4xl font-bold text-blue-600">{percentualConclusao}%</p>
            <p className="text-sm text-blue-700 flex items-center justify-center gap-2 mt-2 font-semibold">
              <FileText className="w-5 h-5" /> Progresso
            </p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500 shadow-md"
            style={{ width: `${percentualConclusao}%` }}
          />
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentos Requeridos</h2>

        {documentosUnicos.length === 0 && documentosRecomendados.length > 0 && (
          <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-blue-900">
            <p className="font-bold mb-3 text-lg">📋 Documentos Recomendados para este Tipo de Processo:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {documentosRecomendados.map((doc, idx) => (
                <li key={idx} className="text-blue-800">{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {documentosUnicos.length > 0 ? (
          <div className="space-y-4">
            {documentosUnicos.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{doc.nome}</p>
                    <p className="text-sm text-gray-500">
                      {doc.status === StatusDocumento.ENTREGUE && doc.dataEntrega
                        ? `Marcado como OK em ${new Date(doc.dataEntrega).toLocaleDateString('pt-BR')}`
                        : doc.status === StatusDocumento.NAO_APLICAVEL
                        ? 'Não precisa'
                        : 'Pendente'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        checked={doc.status === StatusDocumento.ENTREGUE}
                        onChange={(e) =>
                          handleAtualizarStatus(
                            doc.id,
                            e.target.checked ? StatusDocumento.ENTREGUE : StatusDocumento.PENDENTE
                          )
                        }
                      />
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${coresStatusDocumento[StatusDocumento.ENTREGUE]}`}>
                        OK
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                        checked={doc.status === StatusDocumento.NAO_APLICAVEL}
                        onChange={(e) =>
                          handleAtualizarStatus(
                            doc.id,
                            e.target.checked ? StatusDocumento.NAO_APLICAVEL : StatusDocumento.PENDENTE
                          )
                        }
                      />
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${coresStatusDocumento[StatusDocumento.NAO_APLICAVEL]}`}>
                        Não precisa
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={() => handleDeletarDocumento(doc.id)}
                    className="text-red-600 hover:text-red-900 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Nenhum documento vinculado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};
