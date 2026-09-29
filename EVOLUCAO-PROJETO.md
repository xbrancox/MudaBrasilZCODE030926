# 🧠 VotaBrasil — Arquitetura, Decisões e Evoluções Cívicas

> Este documento registra as melhorias de produto, heurísticas de votação, métricas de fidelidade e métodos de cobrança cívica desenvolvidos para o VotaBrasil. Pode ser utilizado como referência e contexto para futuros projetos de civic-tech e interações com IA.

---

## 1. Fidelidade Partidária vs. Sentimento da Base (Termômetro Cívico)
* **Objetivo:** Mostrar ao eleitor se o parlamentar vota alinhado às diretrizes do seu partido ou ao clamor e termômetro de confiança de sua base eleitoral.
* **Métrica implementada:** 
  * O sistema cruza as votações nominais do Plenário com a média da bancada partidária (Fidelidade Partidária) e compara com o índice de confiança agregado na UF daquele parlamentar no *Termômetro de Confiança*.
  * O "Delta" exibe o desvio percentual entre o voto do deputado e o esperado pela base.

## 2. Taxa de Resposta a Cobranças (Métrica de Gabinete)
* **Objetivo:** Estimular a prestação de contas dos parlamentares através de cobranças estruturadas.
* **Mecanismo:** 
  * O eleitor gera um **Recibo de Cobrança Cívica** (com votações nominais específicas e promessas cobradas).
  * O envio é feito via WhatsApp ou e-mail oficial do gabinete (extraído da API de dados abertos da Câmara/Senado).
  * O índice de resposta reflete o engajamento do gabinete com as cobranças originadas na plataforma, criando reputação digital de transparência para o político.

## 3. Pilares de Transparência e Escolha Informada
1. **Quórum e Tipo de Votação:** Distinção clara entre votações Simbólicas ("fica como está") e Nominais (voto individual registrado).
2. **Dossiê Cívico:** Cruzamento das últimas 30 votações nominais + presença + índice de integridade.
3. **Mandato Revogável:** Conscientização de que 70% dos votos de origem podem revogar o mandato (mecanismo de responsabilidade política contínua).
