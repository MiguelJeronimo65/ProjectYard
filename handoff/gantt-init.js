/* ProjectYard — Exemplo de init DHTMLX Gantt
   Reproduz o Cronograma Global do protótipo: zoom Semana/Mês/Trimestre/Ano,
   coluna de projeto fixa, linha "Hoje", previsto vs real (baseline),
   cor por estado, caminho crítico e filtros (chips).

   Inclui no HTML (DHTMLX Gantt — baseline/critical_path exigem versão PRO):
     <link rel="stylesheet" href="https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.css">
     <script src="https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.js"></script>
     <script src="gantt-data.js"></script>     // expõe ganttData
     <div id="gantt_here" style="width:100%;height:640px;"></div>
     <script src="gantt-init.js"></script>
*/

// ---- Datas ----
gantt.config.date_format = "%Y-%m-%d";
gantt.config.start_date = new Date(2025, 0, 1);
gantt.config.end_date   = new Date(2028, 0, 1);

// ---- Coluna de projeto/fase (grelha fixa à esquerda) ----
gantt.config.columns = [
  { name: "text", label: "Projeto / Fase", tree: true, width: 260, resize: true },
  { name: "owner", label: "Resp.", align: "center", width: 96, template: t => t.owner || "" },
  { name: "progress", label: "%", align: "center", width: 52,
    template: t => (t.type === "project" || t.status === "Em curso") ? Math.round(t.progress * 100) + "%" : "" },
];

// ---- Zoom: Semana / Mês / Trimestre / Ano (= toggle do protótipo) ----
gantt.ext.zoom.init({
  levels: [
    { name: "Semana", scale_height: 62, min_column_width: 30, scales: [
      { unit: "year", step: 1, format: "%Y" },
      { unit: "month", step: 1, format: "%M" },
      { unit: "week", step: 1, format: d => "S" + gantt.date.getISOWeek(d) },
    ]},
    { name: "Mês", scale_height: 52, min_column_width: 72, scales: [
      { unit: "year", step: 1, format: "%Y" },
      { unit: "month", step: 1, format: "%M" },
    ]},
    { name: "Trimestre", scale_height: 52, min_column_width: 92, scales: [
      { unit: "year", step: 1, format: "%Y" },
      { unit: "quarter", step: 1, format: d => "T" + (Math.floor(d.getMonth() / 3) + 1) },
    ]},
    { name: "Ano", scale_height: 40, min_column_width: 120, scales: [
      { unit: "year", step: 1, format: "%Y" },
    ]},
  ],
});

// ---- Plugins: linha hoje, tooltip, caminho crítico (PRO) ----
gantt.plugins({ marker: true, tooltip: true, critical_path: true });
gantt.config.highlight_critical_path = true;   // usa as ligações (dependências FS)

// ---- Cor por estado / tipo (ver gantt.css) ----
gantt.templates.task_class = (start, end, t) => {
  if (t.type === "project") return "py-project";
  if (t.status === "Concluída") return "py-done";
  if (t.status === "Em curso")  return "py-doing";
  return "py-todo";
};
gantt.templates.task_text = (s, e, t) =>
  t.status === "Em curso" ? Math.round(t.progress * 100) + "%" : "";

// ---- Baseline = PREVISTO (barra fina por baixo da barra real) ----
gantt.addTaskLayer(t => {
  if (!t.planned_start) return false;
  const sX = gantt.posFromDate(gantt.date.parseDate(t.planned_start, "%Y-%m-%d"));
  const eX = gantt.posFromDate(gantt.date.parseDate(t.planned_end, "%Y-%m-%d"));
  const el = document.createElement("div");
  el.className = "py-baseline";
  el.style.left = sX + "px";
  el.style.width = Math.max(0, eX - sX) + "px";
  el.style.top = gantt.getTaskTop(t.id) + gantt.config.task_height + 4 + "px";
  return el;
});

// ---- Arranque ----
gantt.init("gantt_here");
gantt.parse(ganttData);                 // de gantt-data.js
gantt.ext.zoom.setLevel("Mês");
gantt.addMarker({ start_date: new Date(2026, 5, 8), css: "today-line", text: "Hoje", title: "8 Jun 2026" });
gantt.showDate(new Date(2026, 5, 8));    // abre centrado em "hoje"

// ---- Filtros (chips do protótipo) ----
let activeFilter = "";
gantt.attachEvent("onBeforeTaskDisplay", (id, t) => {
  if (t.type === "project" || !activeFilter) return true;
  switch (activeFilter) {
    case "crit":  return !!t.critica;
    case "done":  return t.status === "Concluída";
    case "curso": return t.status === "Em curso";
    case "init":  return t.status === "Por iniciar";
    case "late":  return t.status !== "Concluída" &&
                         gantt.date.parseDate(t.planned_end, "%Y-%m-%d") < new Date(2026, 5, 8);
    default:      return true;
  }
});
function setGanttFilter(kind) {           // ligar aos botões/chips
  activeFilter = (activeFilter === kind) ? "" : kind;
  gantt.render();
}
