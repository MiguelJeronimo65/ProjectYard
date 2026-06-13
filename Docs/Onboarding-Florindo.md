# Onboarding — Florindo Arquitetos (dados reais)

> Fonte: `000_GESTÃO_ATELIE_FEP_17.04.2026-00.xlsx` (Excel de gestão do cliente).
> Objetivo: preencher a app à mão, como cliente real, usando o Excel como verdade.
> NÃO há importador — outros clientes não terão este Excel; isto é só o guião do Florindo.

## 0. Identidade do workspace (assinatura do Jorge)
- **Nome:** Florindo Arquitetos · **slug sugerido:** `florindo-arquitetos`
- **Owner:** Jorge Florindo · `florindo.arquitectos@gmail.com`
- **Morada:** Rua Conselheiro José Silvestre Ribeiro, 4A, 1600-431 Lisboa
- **Website:** www.florindoarquitetos.com · **Telefone:** +351 966 401 256
- **Logótipo:** o monograma que o Jorge enviou (carregar em Definições → Conta → Carregar logótipo)

## 1. Listas & lookups (Definições → Listas) — vocabulário do Florindo
**Fases** (substituir as demo pelas do Excel):
Estudo Prévio · Licenciamento · Execução · Obra · Assistência Técnica · Fecho

**Prioridades:** Alta · Média · Baixa (já igual)

**Estados de projeto** — são fixos na app (enum), NÃO editáveis em Listas. Mapa para o Florindo:
Planeado→Proposta · Em Curso→Em curso · Concluído→Concluído · Em Pausa→Suspenso ·
Cancelado→(sem equivalente — decisão pendente: acrescentar "Cancelado" ao enum)

**Limiares do semáforo (Config do Excel):** Produtividade verde ≥95% / amarelo ≥85%;
Prazo verde ≥95% / amarelo ≥85%. (Hoje fixos no código dos Relatórios; tornar configuráveis = tarefa futura.)

## 2. Equipa (Definições → Equipa & permissões → Convidar por email)
| Nome | Papel sugerido | Email | Notas |
|---|---|---|---|
| Jorge (Florindo) | Owner | florindo.arquitectos@gmail.com | criado com o workspace |
| Madalena | Gestor ou Membro | *(falta — pedir ao Jorge)* | função "a definir" no Excel |
| Beatriz | Membro | *(falta)* | |
| Tiago | Membro | *(falta)* | |

Custo/hora estava a 0 no Excel — preencher quando souberem (entra no custo de produção dos Relatórios).
O Excel também refere "João Barata" como gestor do PRJ-006 — confirmar se é colaborador ou externo.

## 3. Clientes (Clientes → Novo cliente)
6 clientes (no Excel só têm sigla; NIF/contacto/email por preencher):
GEBI · CMLGS SA · CMLGS LDA · CAPGS E CMLGS · AÇORES · ARL

## 4. Projetos (Projetos → Novo projeto) — código PRJ-NNN
| Código | Projeto | Gestor | Datas (Excel) |
|---|---|---|---|
| PRJ-001 | Orçamento ARL | — | fim real 20/04/2026 |
| PRJ-002 | Orçamento FFUL_LAB-PEDRO | — | início prev. 20/04/2026 |
| PRJ-003 | Orçamento PH Benfica | — | |
| PRJ-004 | Orçamento PH RESTELO | — | |
| PRJ-005 | Orçamento EDIF. Almada | — | |
| PRJ-006 | Orçamento Póvoa | João Barata | |
| PRJ-007 | Posto Viseu | JF | fim prev. 27/04/2026 |
| PRJ-008 | Posto ST. Tirso | JF | fim prev. 27/04/2026 |
| PRJ-009 | Posto Costa da Caparica | JF | fim prev. 27/04/2026 |
| PRJ-010 | Casa da Portaria Afonso (reunião) | — | início prev. 12/05/2026 |
| PRJ-011 | Licenciamento Coimbra (ver) | — | |
| PRJ-012 | Licenciamento Bicesse (ver) | — | |

Honorários/horas/faturado estavam a 0 no Excel (fase inicial). Na app:
- **Horas** vêm do Registo de horas; **Faturado/Recebido** vêm das Faturas; **% conclusão** das Fases.
  Ou seja, não se escrevem no projeto — resultam do detalhe (mais fiável que o Excel).

## 5. Diferenças app × Excel a ter em conta
- **Código:** Excel usa `PRJ-001`; a app deixa escrever o código no formulário — usar o mesmo.
- **Totais do projeto** (horas/faturado): no Excel escrevem-se; na app derivam-se do detalhe.
- **Estados:** ver mapa acima (lacuna: "Cancelado").
- **Cofre de acessos a portais** (folha "Dados Plataformas": CMLisboa, CMMafra, CMCoimbra…):
  a app NÃO tem equivalente. Necessidade real do cliente → candidato a funcionalidade futura
  ("Acessos/Credenciais", com passwords cifradas). Por agora fica de fora.

## 6. Ordem sugerida de carregamento
1. Criar workspace (consola Workspaces) → 2. Logótipo + dados do gabinete (Definições → Conta)
→ 3. Fases nos lookups → 4. Convidar equipa → 5. Clientes → 6. Projetos.
