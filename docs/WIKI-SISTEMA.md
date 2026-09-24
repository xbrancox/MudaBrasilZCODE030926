# 🏛️ MudaBrasil v4 — Wiki da Arquitetura e Sistema

> **Versão:** 4.0.0  
> **Repositório:** `https://github.com/xbrancox/mudabrasilv4`  
> **Hospedagem (Frontend):** GitHub Pages (`https://xbrancox.github.io/mudabrasilv4/`)  
> **Backend / API (Produção):** Railway (`https://mudabrasil-redesign-production.up.railway.app`)  
> **Ambiente Local:** `http://127.0.0.1:8080/`

---

## 1. Visão Geral do Projeto
O **MudaBrasil** é uma plataforma cívica e de transparência política voltada para o acompanhamento ciudadano dos representantes públicos no Brasil (Deputados Federais, Senadores, PLs em tramitação, Orçamento / Fundo Eleitoral e Eleições 2026). O sistema combina um frontend estático de alta performance com um backend em Node.js responsável por integrações com dados abertos e interações comunitárias.

---

## 2. Estrutura de Diretórios e Arquivos

```text
C:\Users\euler\MudaBrasil\
├── .dockerignore
├── .gitignore
├── .zcodeignore
├── Dockerfile
├── ENVIAR.bat
├── ENTREGA-FINAL.ps1
├── ENTREGA-FINAL-2.ps1
├── FIX-DEFINITIVO.ps1
├── LOG-GAMIFICACAO.txt
├── LOG-IMPLANTACAO.txt
├── LOG-NOTIFICACOES.txt
├── Procfile
├── README.md
├── fakeweb.py
├── favicon.ico
├── index.html              # Página Principal / Home do App
├── og-image.png
package-lock.json
package.json
privacidade.html
railway.toml
robots.txt
termos.html
├── app/                    # Módulo / Aplicação Web App
│   └── index.html
├── data/                   # Bases de dados JSON locais e caches
│   ├── noticiarios.json
│   ├── noticias.json
│   ├── pls.json
│   └── politicos.json
├── js/                     # Scripts de frontend (módulos e lógica)
├── pages/                  # Páginas secundárias / seções do sistema
│   ├── candidatos.html
│   ├── comunidade.html
│   ├── congresso.html
│   ├── eleicoes-2026.html
│   ├── fundo-eleitoral.html
│   ├── meu-voto.html
│   ├── parlamentares.html
│   ├── proposta.html
│   ├── revogar.html
│   ├── status.html
│   ├── termometro.html
│   └── votacoes.html
├── server/                 # Backend Node.js / Express
│   └── index.js
└── templates/              # Templates reutilizáveis
    └── cedula-votabrasil.html
```

---

## 3. Módulos e Funcionalidades Principais

### A. Frontend (`index.html` e `pages/`)
* **Página Inicial (`index.html`):** Hub central com introdução à proposta, links rápidos e termômetro cívico.
* **Radar Político (`pages/parlamentares.html`):** Listagem e ficha completa de parlamentares federais e senadores (57ª legislatura), com dados de presença, proposituras, despesas e contatos oficiais.
* **Congresso e PLs (`pages/congresso.html`):** Acompanhamento de Projetos de Lei e tramitações em tempo real.
* **Eleições 2026 & Fundo Eleitoral (`pages/eleicoes-2026.html`, `pages/fundo-eleitoral.html`):** Panorama eleitoral e destinação de recursos públicos de campanha.
* **Votações Nominais (`pages/votacoes.html`):** Registro de como cada parlamentar votou em plenário.
* **Cédula de Votação / Rascunho (`templates/cedula-votabrasil.html`):** Ferramenta interativa de simulação de voto cívico.

### B. Backend (`server/index.js`)
* Servidor Node.js baseado em Express.
* Fornece endpoints de API para consulta de parlamentares, dados abertos da Câmara e do Senado, e armazenamento de interações (reclamações, apoios, respostas).
* Gerencia o healthcheck da API em produção (`/api/health`).

---

## 4. Fluxo de Dados e Integrações
1. **Dados Abertos:** Consumo direto das APIs públicas oficiais (Câmara dos Deputados `dadosabertos.camara.leg.br`, Senado Federal e TSE).
2. **Armazenamento Estático/Local:** Dados consolidados em JSON (`/data`) para garantir resiliência e velocidade de carregamento mesmo offline ou em caso de instabilidade nas APIs governamentais.
3. **Deploy Contínuo:** Configurado para Railway via `Dockerfile` e `railway.toml`, com sincronização automática do frontend estático para o GitHub Pages.
