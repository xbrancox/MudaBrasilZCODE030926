# 🗳️ VotaBrasil — Wiki da Arquitetura e Sistema

> **Versão:** 1.0.0  
> **Repositório:** `https://github.com/xbrancox/mudabrasilv4`  
> **Ambiente Local:** `http://localhost:8080/`

---

## 1. Visão Geral do Projeto
O **VotaBrasil** é uma plataforma cívica e de transparência política voltada para o acompanhamento dos representantes públicos no Brasil (Deputados Federais, Senadores, Eleições 2026 e Fundo Eleitoral). O sistema combina um frontend estático de alta performance com um backend em Node.js responsável por integrações com dados abertos e interações comunitárias.

---

## 2. Estrutura de Diretórios e Arquivos

```text
C:\Users\euler\MudaBrasil\
├── app/                    # Aplicação Web App (Cédula de Votação)
│   └── index.html          # Wizard de votação 4 etapas
├── data/                   # Bases de dados JSON locais e caches
│   ├── candidatos-2026.json # Snapshot oficial TSE 2026 (19.893 candidatos)
│   └── noticiarios.json
├── js/                     # Scripts de frontend (módulos e lógica)
│   └── thermometer.js
├── pages/                  # Páginas secundárias / seções do sistema
│   ├── eleicoes-2026.html  # Catálogo de candidatos reais do TSE
│   ├── meu-voto.html       # Comprovante de voto
│   └── ...
├── server/                 # Backend Node.js / Express
│   └── index.js            # Servidor HTTP nativo + rotas de API
├── templates/              # Templates reutilizáveis
│   └── cedula-votabrasil.html
└── docs/                   # Documentação técnica
```

---

## 3. Arquitetura do Backend (`server/index.js`)

### Portas
- **8080** (principal): Servidor estático + rotas de API
- **8081** (alternativa): Fallback automático

### Rotas Principais

| Rota | Funcionalidade |
|------|---------------|
| `GET /api/candidatos-tse` | Lista candidatos reais do TSE com fotos de incumbentes e avatares de fallback |
| `POST /api/voto/cargo-lote` | Submeter voto com todos os cargos (5 cargos) |
| `POST /api/voto/conferir` | Verificar código único de 20 dígitos |
| `POST /api/voto/demonstracao` | Resetar voto de demonstração |
| `POST /api/auth/register` | Registrar sessão anônima |
| `POST /api/auth/google` | Autenticação Google (desenvolvimento) |

### Enriquecimento de Fotos
1. **Incumbentes**: Correspondência por cargo, UF e partido com Câmara/Senado
2. **Fallback**: Avatares gerados via `ui-avatars.com` com as iniciais do candidato
3. **Isolamento**: Objetos de candidato são clonados para evitar mutação no cache

### Ordenação
Os candidatos são retornados ordenados alfabeticamente por `nomeUrna` (pt-BR), com fallback por número de urna.

---

## 4. Cargos Eleitorais (TSE 2026)

| Cargo | Código TSE | UF Especial |
|-------|-----------|-------------|
| Presidente | 1 | BR (todos) |
| Governador | 3 | Por UF |
| Senador | 5 | Por UF |
| Deputado Federal | 6 | Por UF |
| Deputado Estadual | 7 | Por UF |
| **Deputado Distrital** | **8** | **Apenas DF** |

---

## 5. Cédula de Votação (Wizard 4 Etapas)

1. **f0**: Introdução + seleção de UF de domicílio eleitoral
2. **f1**: Montagem da cédula (escolha de candidatos por cargo)
3. **f2**: Revisão completa dos votos
4. **f3**: Explicação do mandato revogável
5. **f4**: Geração do código único de 20 dígitos + comprovante

### Características
- Dados reais do TSE (snapshot local + fallback de incumbentes)
- Rascunho persistente em `localStorage`
- Códigos únicos de 20 dígitos com verificação criptográfica
- Comprovante dourado com QR code opcional

---

## 6. Testes e Validação

```bash
npm test  # Suíte de fumaça (smoke test)
```

 Cobertura:
- `db.js`: Operações de banco de dados SQLite
- `votes.js`: Validação de votos e códigos
- `reclamacoes.js`: Sanitização de entradas
- `auth.js`: Gestão de sessões
- `verificacao`: Domínios permitidos

---

## 7. Links Locais

| Recurso | URL |
|---------|-----|
| Cédula de Votação | `http://localhost:8080/cedula-votabrasil.html` |
| Eleições 2026 | `http://localhost:8080/pages/eleicoes-2026.html` |
| API Candidatos TSE | `http://localhost:8080/api/candidatos-tse?cargo=6&uf=SP` |

---

## 8. Próximos Passos

- [x] Teste manual completo de votação (5 cargos)
- [x] Validação de persistência de UF no localStorage
- [x] Integração da página de eleições 2026 com API local
- [x] Documentação técnica atualizada
- [ ] Limpeza de scripts locais (.bat, logs de fusão)