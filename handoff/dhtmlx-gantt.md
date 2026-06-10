# Handoff — Cronograma Global → DHTMLX Gantt

Guia para implementar o **Cronograma Global** do ProjectYard com **DHTMLX Gantt**.
O protótipo React (ecrã *Cronograma global*) passa a ser a **referência visual e de UX**;
o DHTMLX é o motor. Este pacote dá os dados já no formato certo e a config para replicar o desenho.

## Ficheiros
| Ficheiro | O que é |
|---|---|
| `gantt-data.js` | Dados do portfólio no formato DHTMLX (`ganttData = { data, links }`). 5 projetos · 17 fases · 12 dependências. |
| `gantt-init.js` | Init completo: zoom, colunas, baseline, marcador "hoje", cores, filtros. |
| `gantt.css` | Skin (cores das barras por estado, baseline, linha hoje, caminho crítico). |

## Arranque rápido
```html
<link rel="stylesheet" href="https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.css">
<script src="https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.js"></script>
<link rel="stylesheet" href="gantt.css">
<div id="gantt_here" style="width:100%;height:640px;"></div>
<script src="gantt-data.js"></script>
<script src="gantt-init.js"></script>
```

## Modelo de dados (`gantt-data.js`)
Cada **fase** é uma tarefa; cada **projeto** é uma tarefa `type:"project"` (pai). Datas reais ISO.

```js
{
  id: "PY-118.3", text: "Projeto de Execução", parent: "PY-118",
  start_date: "2026-05-01", end_date: "2026-07-26",  // barra de TRABALHO (real onde existe)
  progress: 0.64,
  planned_start: "2026-04-25", planned_end: "2026-07-26", // BASELINE = previsto
  status: "Em curso", critica: true, owner: "Pedro Dias", color: "#6a5af9", prazo: 64
}
```
- **Previsto vs Real** → `planned_start/planned_end` é o baseline (barra fina por baixo); `start_date/end_date` é o trabalho real/atual. O desvio (slippage) fica visível.
- **Dependências** → `links` com `type:"0"` (fim-início) entre fases consecutivas de cada projeto. **Pressuposto** — confirma a sequência real; ajusta/retira conforme o vosso planeamento.
- **Multi-ano** → resolvido por usar datas reais; o DHTMLX faz scroll/zoom nativamente (PY-115 cruza 2025→2026, PY-120 cruza 2026→2027).

## Mapa: protótipo → DHTMLX
| Decisão no protótipo | Config DHTMLX |
|---|---|
| Toggle Semana / Mês / Trimestre / Ano | `gantt.ext.zoom` com 4 níveis de `scales` (ver `gantt-init.js`) |
| Faixa de anos + meses no topo | escalas multi-linha (`year` + `month`/`quarter`/`week`) |
| Coluna de projeto fixa à esquerda | `gantt.config.columns` (grelha nativa, redimensionável) |
| Barra previsto vs real | baseline via `gantt.addTaskLayer` (`planned_*`) |
| Linha "Hoje" | `gantt.addMarker({ css:"today-line" })` (plugin `marker`) |
| Cor por estado (concluída/curso/por iniciar/atraso) | `gantt.templates.task_class` → `gantt.css` |
| Badge "multi-ano" / "Atraso" | template de texto ou `task_class` adicional |
| Fase crítica / caminho crítico | `links` + `highlight_critical_path` (**PRO**) ou etiqueta `.py-crit` (sem PRO) |
| Chips clicáveis (críticas/atraso/…) | `onBeforeTaskDisplay` + `gantt.render()` (`setGanttFilter` em `gantt-init.js`) |
| Abrir centrado em hoje | `gantt.showDate(new Date(2026,5,8))` |
| Drag para mover/redimensionar fases | nativo (`gantt.config.drag_move/drag_resize`) |

## Notas de licença
- **Standard (grátis):** zoom, marker, tooltip, colunas, baseline via `addTaskLayer`, filtros, drag.
- **PRO:** `critical_path` (caminho crítico real) e `auto_scheduling` (reagendar por dependências).
  Sem PRO, mantém-se `critica` como **etiqueta** (classe `.py-crit`) em vez de caminho crítico calculado.

## Pressupostos a confirmar
1. **Dependências** entre fases (criei fim-início sequenciais) — ajustar à realidade de cada projeto.
2. **"Em atraso"** = `planned_end < hoje` e estado ≠ Concluída. No protótipo há uma tolerância (~0,15 mês);
   replicar em `onBeforeTaskDisplay` se quiserem rigor igual.
3. **Cor das barras** — aqui é por estado. Se preferirem **por projeto**, basta usar o campo `color`
   (o DHTMLX colore a barra automaticamente) e reservar verde/vermelho só para concluída/atraso.
4. **"Hoje"** está fixo em 8 Jun 2026 (dados mock); em produção usar `new Date()`.

## Fonte
Gerado a partir de `GANTT_GLOBAL` (`data.jsx`). Se os dados do protótipo mudarem, regenerar `gantt-data.js`
com o mesmo conversor (mês-absoluto → data real, base Jan 2025 = mês 0).
