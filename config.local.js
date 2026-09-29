/* ============================================================
   VotaBrasil — Configuração Local (Independente e Autônomo)
   ============================================================ */

let API_BASE = '';
const SERVIDO_PELO_BACKEND = true;

window.VotaBrasil = window.VotaBrasil || {};
window.VotaBrasil.API_BASE = API_BASE;
window.API_BASE = API_BASE;
window.VotaBrasil.MODO = 'autonomo';
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

console.log('%c🟢 VotaBrasil — Autônomo (Local)', 'font-size:16px;font-weight:bold;color:#2ECC71');
