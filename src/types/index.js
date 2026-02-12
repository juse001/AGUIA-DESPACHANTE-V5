// Tipos para o sistema de gestão de processos
export var TipoProcesso;
(function (TipoProcesso) {
    TipoProcesso["AQUISICAO_ARMA_SINARM"] = "AQUISICAO_ARMA_SINARM";
    TipoProcesso["AQUISICAO_ARMA_CR_ATIRADOR"] = "AQUISICAO_ARMA_CR_ATIRADOR";
    TipoProcesso["AQUISICAO_ARMA_CR_CACADOR"] = "AQUISICAO_ARMA_CR_CACADOR";
    TipoProcesso["CRAF_CR"] = "CRAF_CR";
    TipoProcesso["GUIA_TRAFEGO_CACA"] = "GUIA_TRAFEGO_CACA";
    TipoProcesso["GUIA_TRAFEGO_MUDANCA_ACERVO"] = "GUIA_TRAFEGO_MUDANCA_ACERVO";
    TipoProcesso["GUIA_TRAFEGO_RECUPERACAO"] = "GUIA_TRAFEGO_RECUPERACAO";
    TipoProcesso["GUIA_TRAFEGO_TIRO"] = "GUIA_TRAFEGO_TIRO";
    TipoProcesso["GUIA_TRAFEGO_SINARM"] = "GUIA_TRAFEGO_SINARM";
    TipoProcesso["TRANSFERENCIA_ARMA_CR"] = "TRANSFERENCIA_ARMA_CR";
    TipoProcesso["CR_ATIRADOR_CACADOR"] = "CR_ATIRADOR_CACADOR";
})(TipoProcesso || (TipoProcesso = {}));
export var StatusProcesso;
(function (StatusProcesso) {
    StatusProcesso["ABERTO"] = "ABERTO";
    StatusProcesso["EM_ANALISE"] = "EM_ANALISE";
    StatusProcesso["DOCUMENTACAO_INCOMPLETA"] = "DOCUMENTACAO_INCOMPLETA";
    StatusProcesso["DOCUMENTACAO_COMPLETA"] = "DOCUMENTACAO_COMPLETA";
    StatusProcesso["DOCUMENTACAO_COMPLETA_PARA_PROTOCOLO"] = "DOCUMENTACAO_COMPLETA_PARA_PROTOCOLO";
    StatusProcesso["DEFERIDO"] = "DEFERIDO";
    StatusProcesso["INDEFERIDO"] = "INDEFERIDO";
    StatusProcesso["ENTREGUE_AO_CLIENTE"] = "ENTREGUE_AO_CLIENTE";
    StatusProcesso["RESTITUIDO"] = "RESTITUIDO";
})(StatusProcesso || (StatusProcesso = {}));
export var StatusDocumento;
(function (StatusDocumento) {
    StatusDocumento["PENDENTE"] = "PENDENTE";
    StatusDocumento["ENTREGUE"] = "ENTREGUE";
    StatusDocumento["REJEITADO"] = "REJEITADO";
    StatusDocumento["NAO_APLICAVEL"] = "NAO_APLICAVEL";
})(StatusDocumento || (StatusDocumento = {}));
