/* ============================================================
   VOTABRASIL — FUNDO ELEITORAL (dados públicos TSE)
   ------------------------------------------------------------
   Distribuição do FEFC (Fundo Especial de Financiamento de
   Campanha) por partido, Elections 2026.

   FONTE OFICIAL (verificada em 15/9/2026):
     https://www.tse.jus.br/eleicoes/eleicoes-2026-content/prestacao-de-contas/distribuicao-dos-recursos-do-fundo-especial-de-financiamento-de-campanha-fefc-eleicoes-2026
   A tabela "Cálculo de distribuição dos recursos do FEFC —
   Eleições 2026" foi transcrita integralmente para
   data/fundo-eleitoral.json (valores em reais, com as quatro
   cotas: 2% partidos registrados, 35% votos Câmara, 48%
   bancada Câmara, 15% bancada Senado). Soma oficial:
   R$ 4.961.519.777,00.

   POR QUE UM SNAPSHOT COMMITADO?
     - dadosabertos.tse.jus.br e cdn.tse.jus.br bloqueiam o
       servidor (Akamai 403), então a ingestão HTTP automática
       não é confiável aqui. O snapshot é dado PÚBLICO oficial
       (licença CC-BY / dados abertos) e pode ser versionado.
     - scripts/atualizar-fundo-eleitoral.js regenera o snapshot
       a partir da página do TSE quando necessário.

   SOBRE "VALOR POR POLÍTICO":
     Os repasses do FEFC aos candidatos são publicados nas
     prestações de contas pós-eleição (DivulgaCandContas). Para
     as Eleições 2026 (1º turno em 04/10/2026) esses arquivos
     ainda NÃO existem — hoje só há o montante que cada PARTIDO
     recebeu. Este módulo nunca inventa valor individual: o
     campo porPolitico fica vazio até a fonte publicar, e a UI
     mostra isso com honestidade.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const SNAPSHOT_FILE = path.join(__dirname, '..', 'data', 'fundo-eleitoral.json');

let cache = null;
let cacheMtime = 0;

function carregarSnapshot() {
  try {
    const st = fs.statSync(SNAPSHOT_FILE);
    if (cache && st.mtimeMs === cacheMtime) return cache;
    cache = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
    cacheMtime = st.mtimeMs;
    return cache;
  } catch (e) {
    if (cache) return cache; // última cópia boa em memória
    throw new Error('Snapshot do fundo eleitoral indisponível: ' + e.message);
  }
}

/* Chave usada nos dois lados (servidor e app): nome minúsculo
   sem acentos + '|' + sigla do partido sem acentos. */
function keyPol(nome, partido) {
  const norm = s => String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return norm(nome) + '|' + norm(partido);
}

function getPartidos() {
  const d = carregarSnapshot();
  return { ano: d.ano, fonte: d.fonte, urlFonte: d.urlFonte, atualizadoEm: d.atualizadoEm, partidos: d.porPartido };
}

function getCandidatos() {
  const d = carregarSnapshot();
  return {
    ano: d.ano,
    fonte: d.fonte,
    urlFonte: d.urlFonte,
    atualizadoEm: d.atualizadoEm,
    aviso: d.avisoPorPolitico,
    candidatos: d.porPolitico || []
  };
}

function getResumo() {
  const d = carregarSnapshot();
  const map = {};
  for (const p of (d.porPolitico || [])) {
    map[keyPol(p.nome, p.partido)] = p;
  }
  return {
    ok: true,
    totalDistribuido: d.totalDistribuido,
    ano: d.ano,
    partidosComRecursos: (d.porPartido || []).length,
    candidatosBeneficiados: (d.porPolitico || []).length,
    atualizadoEm: d.atualizadoEm,
    fonte: d.fonte,
    urlFonte: d.urlFonte,
    aviso: d.avisoPorPolitico,
    map
  };
}

/* Exportação CSV (ponto-e-vírgula, padrão Excel pt-BR) dos dados
   públicos do fundo — para jornalistas, pesquisadores e cidadãos. */
function csvEscape(v) {
  const s = String(v == null ? '' : v);
  return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function brl(v) {
  return Number(v || 0).toFixed(2).replace('.', ',');
}
function getCSV() {
  const d = carregarSnapshot();
  const linhas = ['sigla_partido;nome_partido;valor_total_brl;percentual_do_fundo;cota_2pct_registrados_brl;cota_35pct_votos_camara_brl;cota_48pct_bancada_camara_brl;cota_15pct_bancada_senado_brl'];
  for (const p of (d.porPartido || [])) {
    const c = {};
    for (const q of (p.cotas || [])) {
      if (/^Cota 2%/.test(q.destino)) c.c2 = q.valor;
      else if (/^Cota 35%/.test(q.destino)) c.c35 = q.valor;
      else if (/^Cota 48%/.test(q.destino)) c.c48 = q.valor;
      else if (/^Cota 15%/.test(q.destino)) c.c15 = q.valor;
    }
    linhas.push([csvEscape(p.sigla), csvEscape(p.nome), brl(p.valor), String(p.percentual == null ? '' : p.percentual).replace('.', ','), brl(c.c2), brl(c.c35), brl(c.c48), brl(c.c15)].join(';'));
  }
  // candidatos (quando existirem prestações de contas publicadas)
  if ((d.porPolitico || []).length) {
    linhas.push('');
    linhas.push('nome_candidato;cargo;uf;sigla_partido;ano;valor_recebido_brl;origem');
    for (const c of d.porPolitico) {
      linhas.push([csvEscape(c.nome), csvEscape(c.cargo), csvEscape(c.uf), csvEscape(c.partido), csvEscape(c.ano), brl(c.valor), csvEscape(c.origem)].join(';'));
    }
  }
  // BOM UTF-8: Excel abre acentos corretamente
  return '\uFEFF' + linhas.join('\r\n') + '\r\n';
}

module.exports = { getPartidos, getCandidatos, getResumo, getCSV, keyPol, SNAPSHOT_FILE };
