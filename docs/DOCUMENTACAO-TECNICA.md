# 📑 Documentação Técnica Detalhada — MudaBrasil v4

> **Escopo:** Especificação técnica completa de arquitetura, contratos de API, dependências, segurança e diretrizes de implantação.

---

## 1. Stack Tecnológica

| Camada | Tecnologia / Ferramenta | Descrição / Versão |
| :--- | :--- | :--- |
| **Runtime** | Node.js | `>= 22.0.0` |
| **Framework Backend** | Express.js | Roteamento de API e proxy de dados |
| **Automação / Scraping** | Playwright | `>= 1.62.1` |
| **E-mails / Notificações** | Nodemailer | `>= 9.1.1` |
| **Frontend** | HTML5, CSS3, JavaScript Vanilla | Sem dependências pesadas de framework JS (alta performance) |
| **Estilização** | CSS Custom Properties (Variáveis), Flexbox, Grid | Design responsivo com suporte a modo escuro padrão |
| **Hospedagem API** | Railway | Deploy conteinerizado via Docker |
| **Hospedagem Estática**| GitHub Pages | Publicação contínua do frontend |

---

## 2. Contratos e Endpoints da API (`server/index.js`)

### 2.1. Healthcheck
* **URL:** `GET /api/health`
* **Descrição:** Retorna o status operacional do servidor backend.
* **Exemplo de Resposta:**
  ```json
  { "status": "ok", "timestamp": "2026-09-23T00:00:00.000Z" }
  ```

### 2.2. Dados de Parlamentares
* **URL:** Consulta interna via arquivos JSON estáticos em `/data/politicos.json` ou proxies em tempo de execução para as APIs da Câmara e Senado.
* **Campos principais do objeto parlamentar:**
  * `id` (String): Identificador único (ex: `camara-204379`)
  * `nome` (String): Nome civil ou parlamentar
  * `partido` (String): Sigla do partido político
  * `uf` (String): Unidade federativa
  * `cargo` (String): Ex: `Deputado Federal` ou `Senador`
  * `email` (String): E-mail institucional de contato

### 2.3. Projetos de Lei (PLs)
* **URL:** Consulta via `/data/pls.json` ou parâmetros de query (`?autor=...`).

---

## 3. Segurança e Boas Práticas

1. **Isolamento de Credenciais:** Nenhuma chave de API ou credencial de banco/SMTP é hardcoded no frontend. As variáveis sensíveis residem exclusivamente nas configurações de ambiente do Railway.
2. **Tratamento de Erros de Rede:** As requisições assíncronas no frontend possuem fallbacks visuais (`onerror` em imagens, blocos de carregamento com *skeletons* e mensagens de indisponibilidade temporária).
3. **Licenciamento e Conformidade:** Todos os dados exibidos provêm de fontes públicas oficiais (Câmara, Senado, TSE, Portal da Transparência) sob licenças de dados abertos, com avisos explícitos de caráter informativo e não-institucional.

---

## 4. Guia de Execução Local

### Pré-requisitos
* Node.js instalado (versão 22 ou superior).
* Git Bash ou terminal compatível.

### Passos para Rodar:
1. Instalar as dependências do backend:
   ```bash
   npm install
   ```
2. Iniciar o servidor local de desenvolvimento:
   ```bash
   npm start
   ```
   *(O servidor rodará em `http://127.0.0.1:8080/`)*
3. Para abrir o frontend, acesse `index.html` diretamente no navegador ou sirva a raiz através de um servidor estático local.
