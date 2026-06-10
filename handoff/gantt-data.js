/* ProjectYard — Dados do Cronograma Global no formato DHTMLX Gantt
   Gerado a partir de GANTT_GLOBAL (protótipo). Carregar com gantt.parse(ganttData).
   Datas: gantt.config.date_format = "%Y-%m-%d".
   Campos extra por tarefa: planned_start/planned_end (baseline = previsto),
   status, critica, owner, color, prazo. Ligações = dependências fim-início (type "0").
   Caminho crítico: gantt.config.highlight_critical_path = true (usa as ligações). */

const ganttData = {
  "data": [
    {
      "id": "PY-118",
      "text": "Edifício Marquês — Reabilitação",
      "type": "project",
      "open": true,
      "start_date": "2026-01-07",
      "end_date": "2026-10-26",
      "progress": 0.64,
      "color": "#6a5af9",
      "code": "PY-118",
      "health": "green",
      "pm": "Ana Moreira"
    },
    {
      "id": "PY-118.1",
      "text": "Estudo Prévio",
      "parent": "PY-118",
      "start_date": "2026-01-07",
      "end_date": "2026-02-21",
      "progress": 1,
      "planned_start": "2026-01-07",
      "planned_end": "2026-02-18",
      "status": "Concluída",
      "critica": false,
      "owner": "Rui Cardoso",
      "color": "#6a5af9",
      "prazo": 100
    },
    {
      "id": "PY-118.2",
      "text": "Licenciamento",
      "parent": "PY-118",
      "start_date": "2026-02-18",
      "end_date": "2026-05-01",
      "progress": 1,
      "planned_start": "2026-02-15",
      "planned_end": "2026-04-19",
      "status": "Concluída",
      "critica": true,
      "owner": "Ana Moreira",
      "color": "#6a5af9",
      "prazo": 100
    },
    {
      "id": "PY-118.3",
      "text": "Projeto de Execução",
      "parent": "PY-118",
      "start_date": "2026-05-01",
      "end_date": "2026-07-26",
      "progress": 0.64,
      "planned_start": "2026-04-25",
      "planned_end": "2026-07-26",
      "status": "Em curso",
      "critica": true,
      "owner": "Pedro Dias",
      "color": "#6a5af9",
      "prazo": 64
    },
    {
      "id": "PY-118.4",
      "text": "Assistência Técnica",
      "parent": "PY-118",
      "start_date": "2026-07-20",
      "end_date": "2026-10-26",
      "progress": 0,
      "planned_start": "2026-07-20",
      "planned_end": "2026-10-26",
      "status": "Por iniciar",
      "critica": false,
      "owner": "Rui Cardoso",
      "color": "#6a5af9",
      "prazo": 0
    },
    {
      "id": "PY-115",
      "text": "Sede Nova — Vértice",
      "type": "project",
      "open": true,
      "start_date": "2025-11-01",
      "end_date": "2026-09-01",
      "progress": 0.78,
      "color": "#2a7fb8",
      "code": "PY-115",
      "health": "green",
      "pm": "Ana Moreira"
    },
    {
      "id": "PY-115.1",
      "text": "Estudo Prévio",
      "parent": "PY-115",
      "start_date": "2025-11-01",
      "end_date": "2025-12-13",
      "progress": 1,
      "planned_start": "2025-11-01",
      "planned_end": "2025-12-10",
      "status": "Concluída",
      "critica": false,
      "owner": "Rui Cardoso",
      "color": "#2a7fb8",
      "prazo": 100
    },
    {
      "id": "PY-115.2",
      "text": "Projeto Base",
      "parent": "PY-115",
      "start_date": "2025-12-07",
      "end_date": "2026-02-04",
      "progress": 1,
      "planned_start": "2025-12-07",
      "planned_end": "2026-02-01",
      "status": "Concluída",
      "critica": true,
      "owner": "Joana Faria",
      "color": "#2a7fb8",
      "prazo": 100
    },
    {
      "id": "PY-115.3",
      "text": "Projeto de Execução",
      "parent": "PY-115",
      "start_date": "2026-02-01",
      "end_date": "2026-05-17",
      "progress": 0.88,
      "planned_start": "2026-01-29",
      "planned_end": "2026-05-17",
      "status": "Em curso",
      "critica": true,
      "owner": "Tiago Pinto",
      "color": "#2a7fb8",
      "prazo": 88
    },
    {
      "id": "PY-115.4",
      "text": "Assistência Técnica",
      "parent": "PY-115",
      "start_date": "2026-05-17",
      "end_date": "2026-09-01",
      "progress": 0,
      "planned_start": "2026-05-17",
      "planned_end": "2026-09-01",
      "status": "Por iniciar",
      "critica": false,
      "owner": "Ana Moreira",
      "color": "#2a7fb8",
      "prazo": 0
    },
    {
      "id": "PY-117",
      "text": "Quinta do Lago — V4",
      "type": "project",
      "open": true,
      "start_date": "2026-02-01",
      "end_date": "2026-09-01",
      "progress": 0.41,
      "color": "#e0922a",
      "code": "PY-117",
      "health": "amber",
      "pm": "Rui Cardoso"
    },
    {
      "id": "PY-117.1",
      "text": "Estudo Prévio",
      "parent": "PY-117",
      "start_date": "2026-02-04",
      "end_date": "2026-03-20",
      "progress": 1,
      "planned_start": "2026-02-01",
      "planned_end": "2026-03-13",
      "status": "Concluída",
      "critica": false,
      "owner": "Rui Cardoso",
      "color": "#e0922a",
      "prazo": 100
    },
    {
      "id": "PY-117.2",
      "text": "Licenciamento",
      "parent": "PY-117",
      "start_date": "2026-03-20",
      "end_date": "2026-05-17",
      "progress": 0.7,
      "planned_start": "2026-03-10",
      "planned_end": "2026-05-17",
      "status": "Em curso",
      "critica": true,
      "owner": "Sofia Lemos",
      "color": "#e0922a",
      "prazo": 70
    },
    {
      "id": "PY-117.3",
      "text": "Projeto de Execução",
      "parent": "PY-117",
      "start_date": "2026-05-17",
      "end_date": "2026-09-01",
      "progress": 0,
      "planned_start": "2026-05-17",
      "planned_end": "2026-09-01",
      "status": "Por iniciar",
      "critica": false,
      "owner": "Tiago Pinto",
      "color": "#e0922a",
      "prazo": 0
    },
    {
      "id": "PY-112",
      "text": "Mercado do Bolhão",
      "type": "project",
      "open": true,
      "start_date": "2026-01-26",
      "end_date": "2026-07-17",
      "progress": 0.28,
      "color": "#d65151",
      "code": "PY-112",
      "health": "red",
      "pm": "Sofia Lemos"
    },
    {
      "id": "PY-112.1",
      "text": "Estudo Prévio",
      "parent": "PY-112",
      "start_date": "2026-02-01",
      "end_date": "2026-03-26",
      "progress": 1,
      "planned_start": "2026-01-26",
      "planned_end": "2026-03-07",
      "status": "Concluída",
      "critica": false,
      "owner": "Sofia Lemos",
      "color": "#d65151",
      "prazo": 100
    },
    {
      "id": "PY-112.2",
      "text": "Projeto Base",
      "parent": "PY-112",
      "start_date": "2026-03-26",
      "end_date": "2026-05-01",
      "progress": 0.55,
      "planned_start": "2026-03-07",
      "planned_end": "2026-05-01",
      "status": "Em curso",
      "critica": true,
      "owner": "Pedro Dias",
      "color": "#d65151",
      "prazo": 55
    },
    {
      "id": "PY-112.3",
      "text": "Licenciamento",
      "parent": "PY-112",
      "start_date": "2026-05-01",
      "end_date": "2026-07-17",
      "progress": 0,
      "planned_start": "2026-05-01",
      "planned_end": "2026-07-17",
      "status": "Por iniciar",
      "critica": true,
      "owner": "Sofia Lemos",
      "color": "#d65151",
      "prazo": 0
    },
    {
      "id": "PY-120",
      "text": "Parque Logístico — Maia",
      "type": "project",
      "open": true,
      "start_date": "2026-10-01",
      "end_date": "2027-07-01",
      "progress": 0,
      "color": "#1f9d6b",
      "code": "PY-120",
      "health": "amber",
      "pm": "Ana Moreira"
    },
    {
      "id": "PY-120.1",
      "text": "Estudo Prévio",
      "parent": "PY-120",
      "start_date": "2026-10-01",
      "end_date": "2026-12-01",
      "progress": 0,
      "planned_start": "2026-10-01",
      "planned_end": "2026-12-01",
      "status": "Por iniciar",
      "critica": false,
      "owner": "Ana Moreira",
      "color": "#1f9d6b",
      "prazo": 0
    },
    {
      "id": "PY-120.2",
      "text": "Projeto Base",
      "parent": "PY-120",
      "start_date": "2026-12-01",
      "end_date": "2027-03-01",
      "progress": 0,
      "planned_start": "2026-12-01",
      "planned_end": "2027-03-01",
      "status": "Por iniciar",
      "critica": true,
      "owner": "Miguel Nunes",
      "color": "#1f9d6b",
      "prazo": 0
    },
    {
      "id": "PY-120.3",
      "text": "Licenciamento",
      "parent": "PY-120",
      "start_date": "2027-03-01",
      "end_date": "2027-07-01",
      "progress": 0,
      "planned_start": "2027-03-01",
      "planned_end": "2027-07-01",
      "status": "Por iniciar",
      "critica": true,
      "owner": "Ana Moreira",
      "color": "#1f9d6b",
      "prazo": 0
    }
  ],
  "links": [
    {
      "id": "l1",
      "source": "PY-118.1",
      "target": "PY-118.2",
      "type": "0"
    },
    {
      "id": "l2",
      "source": "PY-118.2",
      "target": "PY-118.3",
      "type": "0"
    },
    {
      "id": "l3",
      "source": "PY-118.3",
      "target": "PY-118.4",
      "type": "0"
    },
    {
      "id": "l4",
      "source": "PY-115.1",
      "target": "PY-115.2",
      "type": "0"
    },
    {
      "id": "l5",
      "source": "PY-115.2",
      "target": "PY-115.3",
      "type": "0"
    },
    {
      "id": "l6",
      "source": "PY-115.3",
      "target": "PY-115.4",
      "type": "0"
    },
    {
      "id": "l7",
      "source": "PY-117.1",
      "target": "PY-117.2",
      "type": "0"
    },
    {
      "id": "l8",
      "source": "PY-117.2",
      "target": "PY-117.3",
      "type": "0"
    },
    {
      "id": "l9",
      "source": "PY-112.1",
      "target": "PY-112.2",
      "type": "0"
    },
    {
      "id": "l10",
      "source": "PY-112.2",
      "target": "PY-112.3",
      "type": "0"
    },
    {
      "id": "l11",
      "source": "PY-120.1",
      "target": "PY-120.2",
      "type": "0"
    },
    {
      "id": "l12",
      "source": "PY-120.2",
      "target": "PY-120.3",
      "type": "0"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) module.exports = ganttData;
