'use strict';
/* ============================================================
   VotaBrasil - Relatorio de Cassacao por Revogacao de Mandato
   Requer jsPDF UMD carregado via CDN (jspdf.umd.min.js)
   ============================================================ */

function gerarRelatorioPDF(nome, partido, uf, elegeram, revogados) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('Biblioteca jsPDF nao carregada. Recarregue a pagina.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pct = Math.round(revogados / elegeram * 100);
  const data = new Date().toLocaleString('pt-BR');
  const protocolo = 'VB-' + Date.now().toString(36).toUpperCase();
  const nomeLimpo = String(nome || '').replace(/[\s]+/g, '-').toLowerCase();

  // ---- CABECALHO ----
  doc.setFillColor(6, 26, 58);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text('VotaBrasil', 105, 13, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Relatorio de Cassacao por Revogacao de Mandato', 105, 21, { align: 'center' });

  // ---- METADADOS ----
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.text('Gerado em: ' + data, 200, 34, { align: 'right' });
  doc.text('Protocolo: ' + protocolo, 200, 39, { align: 'right' });
  doc.setTextColor(180, 30, 30);
  doc.text('PROTOTIPO DEMONSTRATIVO - SEM VALOR JURIDICO', 200, 44, { align: 'right' });

  // ---- BLOCO 1: POLITICO AVALIADO ----
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('1. Politico Avaliado', 20, 55);
  doc.setDrawColor(127, 176, 245);
  doc.setLineWidth(0.3);
  doc.line(20, 58, 190, 58);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  doc.text('Nome: ' + nome, 20, 67);
  doc.text('Partido: ' + partido, 20, 75);
  doc.text('UF: ' + uf, 110, 75);

  // ---- BLOCO 2: ESTATISTICAS ----
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('2. Estatisticas de Revogacao', 20, 92);
  doc.line(20, 95, 190, 95);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  doc.text('Votos que elegeram:   ' + elegeram.toLocaleString('pt-BR'), 20, 105);
  doc.text('Votos revogados:      ' + revogados.toLocaleString('pt-BR'), 20, 113);
  doc.setFont(undefined, 'bold');
  doc.text('Percentual:           ' + pct + '%', 20, 121);
  doc.setFont(undefined, 'normal');

  // ---- RESULTADO ----
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 127, 170, 18, 'F');
  if (pct >= 70) {
    doc.setTextColor(180, 30, 30);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('UMBRAL DA CASSACAO ATINGIDO (>= 70%)', 105, 135, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Representacao recomendada junto aos orgaos competentes.', 105, 141, { align: 'center' });
  } else {
    const falta = Math.max(0, Math.round(elegeram * 0.7) - revogados);
    doc.setTextColor(30, 80, 180);
    doc.setFontSize(11);
    doc.text('Faltam ' + falta.toLocaleString('pt-BR') + ' revogacoes para atingir 70%.', 105, 137, { align: 'center' });
  }

  // ---- BLOCO 3: FUNDAMENTACAO ----
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('3. Fundamentacao', 20, 158);
  doc.line(20, 161, 190, 161);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  const regra = [
    'Regra proposta pelo VotaBrasil: o mandato do politico e cassado quando',
    '70% dos votos que originalmente o elegeram forem revogados por seus',
    'proprios eleitores. A revogacao opera em janela aberta a partir da posse',
    'e permanece ativa durante todo o mandato. Cada eleitor revoga apenas',
    'o proprio voto, preservando o sigilo mediante login verificado (Gov.br),',
    'criptografia de ponta a ponta e auditoria publica.',
    '',
    'O presente relatorio compila o conjunto de codigos criptograficos de',
    '20 digitos dos eleitores que revogaram, disponiveis no VotaBrasil',
    'mediante autenticacao do requerente.'
  ];
  regra.forEach(function (l, i) { doc.text(l, 20, 170 + i * 5); });

  // ---- BLOCO 4: DESTINACAO ----
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('4. Destinacao Recomendada', 20, 220);
  doc.line(20, 223, 190, 223);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  const dest = [
    'Protocolar junto aos seguintes orgaos:',
    '  - Tribunal Superior Eleitoral (TSE)',
    '  - Ministerio Publico Eleitoral',
    '  - Mesa Diretora da Casa Legislativa correspondente',
    '',
    'Anexar este relatorio + lista assinada dos codigos criptograficos',
    'dos eleitores revogadores (fornecida pelo VotaBrasil).'
  ];
  dest.forEach(function (l, i) { doc.text(l, 20, 232 + i * 5); });

  // ---- ASSINATURAS ----
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.line(20, 268, 95, 268);
  doc.line(115, 268, 190, 268);
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Assinatura do eleitor requerente', 57.5, 272, { align: 'center' });
  doc.text('Representante VotaBrasil', 152.5, 272, { align: 'center' });

  // ---- RODAPE ----
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text('VotaBrasil - Plataforma civica de voto continuo e revogavel', 105, 282, { align: 'center' });
  doc.text('votabrasil.app', 105, 287, { align: 'center' });

  doc.save('cassacao-' + nomeLimpo + '-' + Date.now() + '.pdf');
}

// Delegacao de evento para botoes .btn-pdf-cassacao (nao depende do core.js)
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.btn-pdf-cassacao');
  if (!btn) return;
  e.preventDefault();
  var nome = btn.getAttribute('data-nome') || '';
  var partido = btn.getAttribute('data-partido') || '';
  var uf = btn.getAttribute('data-uf') || '';
  var el = parseInt(btn.getAttribute('data-elegeram') || '0', 10);
  var rev = parseInt(btn.getAttribute('data-revogados') || '0', 10);
  if (!nome || !el) return;
  gerarRelatorioPDF(nome, partido, uf, el, rev);
});

console.log('%c📄 VotaBrasil PDF Cassacao carregado', 'color:#FFD700;font-weight:bold');
