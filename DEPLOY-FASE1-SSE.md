# 🚀 Fase 1 — SSE ao vivo + Toast 🔴 AO VIVO

## O que foi implementado

### 🔌 Backend — SSE com eventos em tempo real

**Arquivo:** `server/reclamacoes.js` (linhas 22-29, 67-75, 117-127)

- Sistema de callback `onReclamacaoChange` que dispara sempre que uma reclamação ou apoio é criado
- `createComplaint()` emite evento `reclamacao` com id, politicianId, conteúdo (truncado), status e timestamp
- `createSupport()` emite evento `apoio` com id, politicianId, conteúdo (truncado) e timestamp

**Arquivo:** `server/index.js` (linhas 120-126)

- `reclamacoes.onReclamacaoChange()` inscrito no mesmo EventLoop que os SSE clients
- Quando um evento chega, transmite `event: reclamacao` ou `event: apoio` para TODOS os clients SSE conectados
- O frame SSE inclui `tipo`, `ts` (ISO) e `data` (objeto com os dados da reclamação/apoio)

### 🖥️ Frontend — Toast 🔴 AO VIVO + re-renderização automática

**Arquivo:** `index.html` (linhas 331-353)

- `SSE_SOURCE.addEventListener('reclamacao', ...)` — ao receber uma reclamação de outra janela:
  - Exibe toast: `🔴 AO VIVO - Nova reclamação recebida para {politicianId}!`
  - Chama `carregaRemoteRec()` para atualizar o cache local de reclamações
  - Se o Radar Político estiver aberto, re-renderiza com `renderRad()`
- `SSE_SOURCE.addEventListener('apoio', ...)` — mesmo comportamento para apoios:
  - Toast: `🔴 AO VIVO - Novo apoio registrado para {politicianId}!`
  - Recarrega dados e re-renderiza se necessário

### ⏱️ Fallback — Polling a cada 60s

- Se o SSE falhar (`onerror`), `initSSE()` ativa `setInterval(carregaStats, 60000)`
- O fallback mantém os contadores (votos, PLs) atualizados mesmo sem SSE

---

## 📦 Arquivos modificados

| Arquivo | O que mudou |
|---|---|
| `server/reclamacoes.js` | + callback `onReclamacaoChange` + emissão em `createComplaint` e `createSupport` |
| `server/index.js` | + inscrição no callback e broadcast SSE para reclamações/apoios |
| `index.html` | + listeners `reclamacao` e `apoio` + toast 🔴 AO VIVO + `carregaRemoteRec()` |

---

## 📋 Passo a passo de publicação

### 1. Backend — Railway

```bash
# 1. Instale o Railway CLI (se não tiver)
npm install -g @railway/cli

# 2. Faça login
railway login

# 3. Vincule o projeto existente
railway link

# 4. Deploy
git push railway master
# OU
railway up
```

**Ou via GitHub Actions (recomendado):**

O repositório já tem `railway.toml` e `Procfile`. O Railway detecta automaticamente o Node.js e executa `npm start` (que roda `node server/index.js`).

**Verifique o deploy:**
```bash
curl https://mudabrasil-production-79eb.up.railway.app/api/health
# Deve retornar: { "ok": true, "uptimeSec": ... }
```

### 2. Frontend — GitHub Pages

O frontend está em `https://xbrancox.github.io/mudabrasil/` e o `config.js` já aponta para o backend Railway.

**Se for um novo deploy do frontend:**
```bash
# 1. Commit e push para o repositório mestre
git add -A
git commit -m "feat: Fase 1 SSE ao vivo + toast 🔴 AO VIVO"
git push origin master

# 2. No GitHub, vá em Settings > Pages
#    - Source: Deploy from a branch
#    - Branch: master / (root)
#    - Salvar
```

### 3. Teste manual

| Teste | Como fazer |
|---|---|
| SSE conecta | Abra o DevTools (F12) > Console. Deve aparecer: `✅ SSE conectado (welcome)` |
| Toast 🔴 AO VIVO | Em duas abas: na aba 1, faça uma reclamação no Radar. Na aba 2, deve aparecer o toast |
| Fallback polling | Desative o WiFi. O console mostra: `⚠️ SSE falhou, ativando fallback de polling (60s)` |
| Re-renderização | Com o Radar aberto, faça uma reclamação em outra janela — os contadores e a lista atualizam |

---

## 🧪 Fluxo completo de teste

```
1. Abra https://xbrancox.github.io/mudabrasil/ em duas abas (A e B)
2. Nas duas, vá em Radar Político e pesquise um político
3. Na aba A, clique em "Fazer reclamação", preencha e envie
4. Na aba B, você verá o toast: 🔴 AO VIVO - Nova reclamação recebida!
5. A aba B também recarrega as reclamações do político automaticamente
```

---

## 🏗️ Arquitetura do fluxo SSE

```
[Usuário janela A]
  ↓ POST /api/reclamacoes
[Backend Railway]
  ↓ reclamacoes.createComplaint()
  ↓ emitReclamacaoEvent('reclamacao', data)
  ↓ forEach SSE client → res.write('event: reclamacao\ndata: {...}\n\n')
[Usuário janela B]
  ↓ SSE_SOURCE.addEventListener('reclamacao', fn)
  ↓ toast('🔴 AO VIVO - Nova reclamação recebida!')
  ↓ carregaRemoteRec() → re-renderiza
```

---

## 🔗 Links

- **Repositório novo:** https://github.com/xbrancox/MudaBrasilZCODE030926
- **Frontend GitHub Pages:** https://xbrancox.github.io/mudabrasil/
- **Backend Railway:** https://mudabrasil-production-79eb.up.railway.app
- **Endpoint SSE:** https://mudabrasil-production-79eb.up.railway.app/api/stream