/* VotaBrasil - API Publica para Terceiros v11 */
(function(){
  'use strict';

  var VB_API = {
    versao: '1.1.0',
    plataforma: 'VotaBrasil',
    
    // Gerar dados agregados (simulados no frontend, reais no backend)
    gerarDados: function() {
      var dados = {
        plataforma: this.plataforma,
        versao: this.versao,
        atualizado: new Date().toISOString(),
        estatisticas: {
          total_votos_simulados: this._getLocalCount('mb_votos') + this._getLocalCount('vb_votos'),
          total_revogacoes: this._getLocalCount('mb_revogacoes') + this._getLocalCount('vb_revogacoes'),
          total_conferencias: this._getLocalCount('mb_conferencias') + this._getLocalCount('vb_conferencias'),
          total_reclamacoes: this._getLocalCount('mb_reclamacoes') + this._getLocalCount('vb_reclamacoes'),
          total_apoios: this._getLocalCount('mb_apoios') + this._getLocalCount('vb_apoios'),
          atividade_civica: {
            usuarios_ativos_7d: Math.floor(Math.random() * 500) + 100,
            streak_medio_dias: Math.floor(Math.random() * 15) + 3,
            nivel_medio: Math.floor(Math.random() * 4) + 1
          }
        },
        endpoints: {
          dados_completos: './api/dados.json',
          documentacao: 'https://votabrasil.app/api-docs',
          github: 'https://github.com/xbrancox/mudabrasilv4'
        },
        aviso: 'Prototipo demonstrativo. Dados simulados para fins educacionais. Sem valor juridico.'
      };
      
      return dados;
    },
    
    // Contar itens em localStorage
    _getLocalCount: function(key) {
      try {
        var data = localStorage.getItem(key);
        if (!data) return 0;
        var arr = JSON.parse(data);
        return Array.isArray(arr) ? arr.length : 0;
      } catch(e) {
        return 0;
      }
    },
    
    // Exportar dados como JSON
    exportar: function() {
      var dados = this.gerarDados();
      var json = JSON.stringify(dados, null, 2);
      return json;
    },
    
    // Baixar arquivo JSON
    baixar: function(filename) {
      filename = filename || 'votabrasil-dados.json';
      var json = this.exportar();
      var blob = new Blob([json], {type: 'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    // Injetar endpoint /api/dados (se backend ativo)
    atualizarBackend: function() {
      var cfg = window.VotaBrasil || window.MudaBrasil || {};
      if (!cfg.API_BASE) {
        console.log('[VB-API] Modo demo - sem backend');
        return;
      }
      
      fetch(cfg.API_BASE + '/api/dados', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: this.exportar()
      }).then(function(r) {
        if (r.ok) {
          console.log('[VB-API] Dados enviados ao backend');
        }
      }).catch(function(e) {
        console.log('[VB-API] Erro ao enviar:', e.message);
      });
    },
    
    // Widget visual (botao no rodape)
    criarWidget: function() {
      if (document.querySelector('.vb-api-widget')) return;
      
      var widget = document.createElement('div');
      widget.className = 'vb-api-widget';
      widget.innerHTML = '<button class="vb-api-btn" title="API Publica para Jornalistas/Apps">📊 API</button>';
      widget.style.cssText = 'position:fixed;right:16px;bottom:80px;z-index:9998';
      
      var btn = widget.querySelector('.vb-api-btn');
      btn.style.cssText = 'background:#3498DB;color:#fff;border:none;padding:10px 14px;border-radius:8px;cursor:pointer;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.3)';
      
      var self = this;
      btn.onclick = function() {
        self.abrirPainel();
      };
      
      document.body.appendChild(widget);
    },
    
    // Painel modal
    abrirPainel: function() {
      var overlay = document.createElement('div');
      overlay.className = 'vb-api-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center';
      
      var modal = document.createElement('div');
      modal.style.cssText = 'background:#fff;border-radius:12px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto';
      
      var dados = this.gerarDados();
      var json = JSON.stringify(dados, null, 2);
      
      modal.innerHTML = '<h2 style="margin-top:0">📊 API Publica VotaBrasil</h2>' +
        '<p><strong>Para jornalistas, pesquisadores e desenvolvedores de apps</strong></p>' +
        '<p>Dados agregados em formato JSON. Atualizado a cada deploy.</p>' +
        '<h3>Estatisticas atuais:</h3>' +
        '<ul>' +
        '<li>Total de votos simulados: <strong>' + dados.estatisticas.total_votos_simulados + '</strong></li>' +
        '<li>Total de revogacoes: <strong>' + dados.estatisticas.total_revogacoes + '</strong></li>' +
        '<li>Total de reclamacoes: <strong>' + dados.estatisticas.total_reclamacoes + '</strong></li>' +
        '<li>Usuarios ativos (7 dias): <strong>' + dados.estatisticas.atividade_civica.usuarios_ativos_7d + '</strong></li>' +
        '</ul>' +
        '<h3>JSON completo:</h3>' +
        '<textarea readonly style="width:100%;height:200px;font-family:monospace;font-size:12px;padding:8px">' + json + '</textarea>' +
        '<div style="margin-top:16px;display:flex;gap:8px">' +
        '<button class="vb-api-baixar" style="background:#2ECC71;color:#fff;border:none;padding:10px 16px;border-radius:6px;cursor:pointer;font-weight:700">Baixar JSON</button>' +
        '<button class="vb-api-fechar" style="background:#95A5A6;color:#fff;border:none;padding:10px 16px;border-radius:6px;cursor:pointer;font-weight:700">Fechar</button>' +
        '</div>' +
        '<p style="margin-top:16px;font-size:12px;color:#666">Endpoint publico: <code>./api/dados.json</code></p>';
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      var self = this;
      modal.querySelector('.vb-api-baixar').onclick = function() {
        self.baixar();
      };
      modal.querySelector('.vb-api-fechar').onclick = function() {
        document.body.removeChild(overlay);
      };
      overlay.onclick = function(e) {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
        }
      };
    },
    
    // Inicializar
    init: function() {
      var self = this;
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          self.criarWidget();
          setTimeout(function() {
            self.atualizarBackend();
          }, 2000);
        });
      } else {
        this.criarWidget();
        setTimeout(function() {
          self.atualizarBackend();
        }, 2000);
      }
    }
  };
  
  // Expor globalmente
  window.VBApi = VB_API;
  
  // Auto-inicializar
  VB_API.init();
  
  console.log('[VotaBrasil] API Publica v' + VB_API.versao + ' carregada');
})();
