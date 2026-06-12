# Spec — Splash screen + Indicador de carregamento (loader da marca)

Referências visuais prontas no repo:
- `prototype/splash.html` — ecrã de arranque (splash)
- `prototype/loader.html` — loader L1 nos 3 tamanhos
- Imagens: `prototype/logo.jpg` (logótipo completo), `prototype/favicon-512.png` / `py-loader-mark.png` (símbolo "P")

---

## 1. Splash screen (arranque da app)
Ecrã mostrado **uma vez**, no arranque/login, enquanto a app inicializa.

**Composição (ver `prototype/splash.html`):**
- Fundo **claro** (`#f3f1ec`) com grelha de planta (blueprint) subtil, esbatida ao centro com máscara radial.
- **Logótipo** completo (`logo.jpg`) ao centro, em painel branco com sombra suave.
- **Barra de progresso** dourada fina (gradiente `#d9a32a → #e6b540`) que enche.
- Texto **"A CARREGAR…"** (Space Grotesk, maiúsculas, tracking largo, cor `#a87c18`).
- Rodapé **"PLAN · BUILD · DELIVER"**.
- **SEM spinner** aqui — a barra já indica progresso; o logótipo já contém o símbolo. Não duplicar indicadores.

**Comportamento:**
- Mostrar no arranque; ao terminar a inicialização, **fade-out** e revelar a app (ou a página de login).
- Tempo mínimo ~1,2s para não "piscar"; máximo controlado pelo carregamento real.
- Acessibilidade: `role="status"`, `aria-live="polite"`; respeitar `prefers-reduced-motion` (a barra pode aparecer estática/cheia).

---

## 2. Indicador de carregamento (loader L1) — dentro da app
Anel dourado a girar à volta do símbolo da marca. Um componente, **3 tamanhos** (ver `prototype/loader.html`).

| Situação | Variante | Comportamento |
|---|---|---|
| Mudar de ecrã / carregar página | **Ecrã inteiro** (`.py-overlay` + `.py-loader.lg`) | Véu **claro** (`rgba(243,241,236,.80)`) — **não** escurece o ecrã; bloqueia cliques durante o load |
| Carregar dados de secção/tabela | **Médio** (`.py-loader.md`) centrado na área | Spinner só na zona que carrega |
| Botão a submeter/guardar | **Inline** (`.py-loader.sm` dentro do `<button>`) | Anel pequeno + "A guardar…"; desativar o botão |

**Regras:**
- Véu **claro** por omissão (nunca o escuro, salvo operação muito pesada).
- Só aparece se a operação demorar (respostas instantâneas não piscam o loader).
- A "ampulheta" da marca = este loader L1.

**Implementação ASP.NET (sugestão):**
- *Partial* `_Loader.cshtml` (markup do `.py-overlay`) incluído no `_Layout`; CSS `.py-loader*` num ficheiro próprio (copiar de `prototype/loader.html`).
- Mostrar o overlay no início da navegação e em pedidos **AJAX** (`beforeSend`/`complete` ou eventos do fetch); esconder no fim.
- `role="status"` + `aria-live="polite"`; `prefers-reduced-motion` abranda o anel (já no CSS).

---
*Marca: navy `#233140` · dourado `#d9a32a` · fundo `#f3f1ec`. Fontes: Space Grotesk (títulos), Plus Jakarta Sans (corpo).*
