/* ============================================================
   VotaBrasil — Configuração Global
   -----------------------------------------------------------
   Backend: https://VotaBrasil-redesign-production.up.railway.app (novo projeto Railway)
   Frontend: https://xbrancox.github.io/votabrasil/
   ============================================================ */

let API_BASE = 'https://VotaBrasil-redesign-production.up.railway.app';

/* Página servida pelo próprio backend (dev localhost ou Railway) = mesma origem.
   Hosts estáticos (GitHub Pages) e file:// continuam apontando pro Railway. */
const SERVIDO_PELO_BACKEND = location.protocol.startsWith('http') &&
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || /railway\.app$/.test(location.hostname));
if (SERVIDO_PELO_BACKEND) API_BASE = '';

// Backend Railway = modo PRODUÇÃO (votos ao vivo, selo real, reclamações persistentes)
// API_BASE vazio = modo DEMO (só frontend, dados públicos + localStorage)

window.VotaBrasil = window.VotaBrasil || {};

window.VotaBrasil.API_BASE = API_BASE;
/* Global legado usado inline pela home (index.html). Sem ele, um <script> próprio
   com `const API_BASE` lança SyntaxError e derruba TODA a lógica da página —
   era isso que fazia o Radar Político cair no modo demo. */
window.API_BASE = API_BASE;
window.VotaBrasil.MODO = 'producao';
window.VotaBrasil.SERVIDO_PELO_BACKEND = SERVIDO_PELO_BACKEND;

window.VotaBrasil.URLS = {
  camara: 'https://dadosabertos.camara.leg.br/api/v2',
  senado: 'https://legis.senado.leg.br/dadosabertos',
  tse: 'https://divulgacandcontas.tse.jus.br/divulga/app/',
  transparencia: 'https://www.portaltransparencia.gov.br/',
  cnj: 'https://www.cnj.jus.br/'
};

window.VotaBrasil.CONTATO = {
  email_geral: 'contato@votabrasil.app',
  email_anuncie: 'anuncie@votabrasil.app',
  email_imprensa: 'imprensa@votabrasil.app'
};

window.VotaBrasil.REGRA_REVOGACAO = {
  percentual_cassacao: 0.70,
  abre_apos_posse: true,
  descricao: '70% dos votos que elegeram o político = cassação do mandato'
};

window.VotaBrasil.TERMOMETRO = {
  decaimento_cheio_dias: 90,
  decaimento_piso_dias: 180,
  piso_confianca: 0.5
};

// Aviso de protótipo
console.log('%c🟡 VotaBrasil', 'font-size:16px;font-weight:bold;color:#FFD700');
console.log('%cModo: ' + window.VotaBrasil.MODO, 'color:#94A3B8');
console.log('%cBackend: ' + API_BASE, 'color:#2ECC71');
