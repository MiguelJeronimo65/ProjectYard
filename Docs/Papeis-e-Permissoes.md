# ProjectYard — Especificação de papéis e permissões

> Pedido por Miguel (2026-06-13): clarificar a diferença entre Superadmin e Administrador,
> o lugar do Owner, e o que é o papel Cliente.

## Os dois mundos

O ProjectYard tem dois níveis de utilizador, refletidos na coluna `users.user_type`:

| Nível | `user_type` | Quem é | Onde vive |
|---|---|---|---|
| **Plataforma** | `platform` | A equipa do ProjectYard (nós) | Fora de qualquer workspace (`tenant_id = NULL`) |
| **Workspace** | `tenant` | O atelier cliente e a sua equipa | Dentro de um workspace (`tenant_id` preenchido) |

## Papéis, um a um

### Superadmin (plataforma)
- É o operador da plataforma — não pertence a nenhum atelier.
- Vê a **consola Workspaces** (todos os tenants), cria/suspende workspaces.
- Pode **abrir qualquer workspace** em modo plataforma ("a ver X") e **entrar como** qualquer
  utilizador (impersonate) — ambos com banner visível; o acesso a conteúdo privado de chat
  fica sempre registado no trilho RGPD (`chat_compliance_access_log`).
- É o único acima do Owner. Não conta para os lugares do plano.

### Owner (workspace)
- O **dono do atelier** — criado automaticamente com o workspace.
- Tudo o que o Administrador faz **+ gerir a faturação da subscrição** (plano, cartão,
  faturas do ProjectYard) e eliminar o workspace.
- Protegido: não pode ser removido nem despromovido por ninguém do workspace.
- Na matriz do protótipo (5 colunas) o Owner não aparece — leia-se: **a linha
  "Gerir faturação do workspace" pertence ao Owner** (e ao Superadmin enquanto suporte),
  não ao Administrador comum.

### Administrador (workspace)
- Braço direito do Owner **dentro da operação**: gere equipa e permissões, listas & lookups,
  dados do workspace, integrações; tudo nos projetos.
- **Não** gere a subscrição/faturação do ProjectYard nem elimina o workspace.
- Diferença para o Superadmin, numa frase: o Administrador manda **num** atelier;
  o Superadmin opera a **plataforma** onde vivem todos os ateliers.

### Gestor (workspace)
- Gere projetos do dia a dia: cria/edita projetos, cronograma, aprova entregáveis,
  envia SMS a clientes. Não toca em equipa, permissões nem faturação.

### Membro (workspace)
- A equipa de produção: vê projetos, trabalha tarefas e horas. Não cria projetos
  nem aprova entregáveis.

### Cliente (workspace)
- **O cliente do atelier** (dono de obra, promotor) — ex.: a Helena Brás da Imobiliária
  Atlântico no protótipo. Não é membro da equipa.
- Destina-se ao **portal do cliente** (ainda por implementar): ver apenas os SEUS projetos
  ("Próprios" na matriz), acompanhar o estado, aprovar entregáveis que lhe digam respeito
  e receber notificações. Não vê faturação interna, custos, nem projetos de outros clientes.
- Conta como lugar no plano? Sim, na implementação atual (rever na fase do portal).

## Matriz (a do ecrã Definições → Equipa)

| Permissão | Superadmin | Administrador | Gestor | Membro | Cliente |
|---|---|---|---|---|---|
| Ver projetos e tarefas | ✓ | ✓ | ✓ | ✓ | Próprios |
| Criar e editar projetos | ✓ | ✓ | ✓ | — | — |
| Gerir tarefas e cronograma | ✓ | ✓ | ✓ | ✓ | — |
| Aprovar entregáveis | ✓ | ✓ | ✓ | — | — |
| Faturação e pagamentos | ✓ | ✓ | — | — | — |
| Enviar SMS a clientes | ✓ | ✓ | ✓ | — | — |
| Gerir equipa e permissões | ✓ | ✓ | — | — | — |
| Gerir faturação do workspace | ✓ (suporte) | — (é do **Owner**) | — | — | — |
| Aceder ao portal do cliente | ✓ | ✓ | ✓ | — | ✓ |

## Estado da implementação (2026-06-13)
- Papéis existem como roles Identity (`user_roles`) + coluna denormalizada `users.role`.
- A matriz acima é **informativa no ecrã**; o enforcement por `[Authorize(Roles=…)]`
  nos controllers é um pendente conhecido (aplicar módulo a módulo).
- Impersonate: implementado, só Superadmin, com banner e regresso à conta original.
- Portal do cliente: por desenhar/implementar (fase própria).
