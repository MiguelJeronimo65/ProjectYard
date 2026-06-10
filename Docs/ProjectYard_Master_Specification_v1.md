# ProjectYard — Master Specification v1.0

Este documento agrega a especificação principal do ProjectYard.

## Documentos incluídos neste pacote

- `Docs/00_Product/ProjectYard_Product_Vision_v1.md`
- `Docs/01_Architecture/ProjectYard_Architecture_v1.md`
- `Docs/02_DFD/ProjectYard_DFD_v1.md`
- `Docs/03_Database/ProjectYard_Database_Design_v1.md`
- `Docs/04_Modules/ProjectYard_Modules_v1.md`
- `Docs/05_Screens/ProjectYard_Screens_v1.md`
- `Docs/06_Roadmap/ProjectYard_Roadmap_v1.md`
- `Docs/07_Development/ProjectYard_Development_Guide_v1.md`

---

# ProjectYard — Visão do Produto

## 1. Nome

**ProjectYard**

## 2. Tagline proposta

> Where projects move forward.

## 3. Posicionamento

ProjectYard é uma plataforma de **Project Delivery Control**.  
A inspiração conceptual vem de plataformas colaborativas como Basecamp, mas o ProjectYard vai além da colaboração simples, adicionando controlo profissional de:

- fases;
- tarefas;
- subtarefas;
- entregáveis;
- documentos;
- aprovações;
- custos;
- pagamentos;
- prazos;
- riscos;
- SMS bidirecional;
- multi-tenant;
- trial de 30 dias;
- auditoria;
- base documental separada.

## 4. Problema que resolve

Muitos projetos profissionais são geridos com uma mistura de email, WhatsApp, Excel, PDFs, pastas partilhadas e chamadas telefónicas.

Isto causa:

- perda de decisões;
- atrasos sem dono claro;
- documentos desorganizados;
- entregáveis sem versão;
- pagamentos sem ligação a milestones;
- falta de histórico;
- dificuldade em controlar fornecedores/clientes;
- pouca rastreabilidade;
- inexistência de alertas e escalonamento.

## 5. Solução

ProjectYard centraliza o projeto inteiro:

```text
Projeto
 ├── Fases
 ├── Tasks/Subtasks
 ├── Entregáveis
 ├── Documentos
 ├── Aprovações
 ├── Custos
 ├── Pagamentos
 ├── SMS
 ├── Prazos
 ├── Riscos
 └── Relatórios
```

## 6. Público-alvo

- gabinetes de arquitetura;
- empresas de engenharia;
- consultoras;
- PMOs;
- empresas de software;
- empresas de remodelação/obra;
- gestores de projeto;
- equipas técnicas;
- prestadores de serviços profissionais.

## 7. Diferenciação face a Basecamp

| Basecamp | ProjectYard |
|---|---|
| Project workspace simples | Project delivery control completo |
| Comunicação e tarefas | Entregáveis, pagamentos, riscos e prazos |
| Pouco controlo financeiro | Custos, invoices, milestones e pagamentos |
| Documentos simples | Base documental separada com versões |
| Sem SMS bidirecional forte | SMS outbound/inbound com regras |
| Pouco orientado a contratos | Âmbito, exclusões e change requests |
| Reporting limitado | Dashboards operacionais e financeiros |

## 8. Produto SaaS

ProjectYard deve nascer como SaaS multi-tenant:

- Superadmin global;
- tenants independentes;
- trial de 30 dias;
- planos;
- limites por plano;
- auditoria;
- possibilidade futura de base dedicada por tenant enterprise.



---

# ProjectYard — Arquitetura Técnica

## 1. Stack oficial

```text
Frontend/UI: Materio Admin Template
Backend: ASP.NET Core MVC / .NET 10
ORM: EF Core 10
Auth: ASP.NET Identity
Multi-Tenant: Finbuckle.MultiTenant
Architecture: Clean Architecture
Jobs: Hangfire ou Quartz.NET
Main DB: ProjectYard
Documents DB: ProjectYardDocuments
SMS: Gateway com Webhook
```

## 2. Estrutura da Solution

```text
ProjectYard.sln

src/
├── ProjectYard.Web
├── ProjectYard.Application
├── ProjectYard.Domain
├── ProjectYard.Infrastructure
├── ProjectYard.Documents
└── ProjectYard.Shared

tests/
├── ProjectYard.UnitTests
└── ProjectYard.IntegrationTests
```

## 3. Responsabilidade por projeto

### `ProjectYard.Web`

- ASP.NET Core MVC;
- Controllers;
- Razor Views;
- ViewModels;
- integração do Materio;
- autenticação;
- autorização;
- menus;
- dashboards;
- upload/download;
- endpoints webhook SMS.

### `ProjectYard.Application`

- casos de uso;
- DTOs;
- Commands;
- Queries;
- validações;
- serviços de aplicação;
- orquestração de workflows;
- regras de negócio de aplicação.

### `ProjectYard.Domain`

- entidades;
- enums;
- value objects;
- regras de domínio;
- eventos de domínio;
- interfaces core.

### `ProjectYard.Infrastructure`

- DbContext principal;
- EF Core;
- repositórios;
- Identity;
- Finbuckle;
- SMS provider;
- email provider;
- notifications;
- background jobs;
- audit logging.

### `ProjectYard.Documents`

- DbContext documental;
- armazenamento de ficheiros;
- versões;
- links de documentos;
- logs de acesso;
- integração com local storage, Azure Blob ou S3.

## 4. Multi-Tenant

### Estratégia inicial

```text
Shared database + TenantId obrigatório
```

Todas as tabelas funcionais devem ter `TenantId`.

### Estratégia futura Enterprise

```text
Tenant dedicado com DB própria
```

## 5. Superadmin

O Superadmin é global e pode:

- criar tenants;
- criar trials;
- suspender tenants;
- alterar planos;
- consultar auditoria;
- gerir limites;
- ver métricas globais;
- configurar gateways SMS/email.

## 6. Trial 30 dias

Fluxo:

```text
Superadmin cria tenant trial
  → tenant fica TrialActive
  → TrialEndAt = CreatedAt + 30 dias
  → avisos antes de expirar
  → após expirar: TrialExpired
  → superadmin pode estender ou converter
```

## 7. Base documental separada

### Main DB `ProjectYard`

Guarda:

- tenants;
- utilizadores;
- projetos;
- tasks;
- permissões;
- metadados;
- custos;
- pagamentos;
- SMS;
- notificações.

### Documents DB `ProjectYardDocuments`

Guarda:

- DocumentFiles;
- DocumentVersions;
- DocumentLinks;
- DocumentAccessLog;
- thumbnails;
- metadados;
- storage paths;
- opcionalmente blobs.

## 8. Materio

O Materio será usado como camada visual.

Áreas a adaptar:

- layout principal;
- menu lateral;
- dashboard cards;
- data tables;
- forms;
- wizards;
- timeline;
- notifications;
- calendar;
- kanban;
- chat;
- invoice pages;
- role/permission pages.

## 9. Background Jobs

Usar Hangfire/Quartz para:

- alertas de prazo;
- expiração de trial;
- pagamentos vencidos;
- envio de SMS;
- envio de email;
- processamento de respostas SMS;
- criação de notificações;
- geração de relatórios.

## 10. Segurança

- ASP.NET Identity;
- 2FA futura;
- políticas por role;
- filtro por TenantId;
- auditoria;
- logs de acesso a documentos;
- proteção contra acesso cross-tenant;
- validação em todos os serviços.



---

# ProjectYard — Data Flow Diagrams

## 1. DFD Nível 0

```text
+---------------------+       +---------------------+
| Cliente / Contacto  | <---> |      ProjectYard    |
+---------------------+       +----------+----------+
                                         |
                                         v
                              +---------------------+
                              | ProjectYardDocuments|
                              +---------------------+
                                         |
                                         v
                              +---------------------+
                              | Gateway SMS / Email |
                              +---------------------+
```

## 2. DFD Nível 1

```text
[Superadmin]
     |
     v
(1) Gestão de Tenants
     |
     +--> Tenants
     +--> TenantPlans
     +--> TrialAccess

[Admin Tenant]
     |
     v
(2) Utilizadores e Permissões
     |
     +--> Users
     +--> Roles
     +--> Permissions

[Gestor Projeto]
     |
     v
(3) Gestão de Projetos
     |
     +--> Projects
     +--> ProjectPhases
     +--> ProjectMembers
     +--> ProjectTools

[Equipa]
     |
     v
(4) Execução
     |
     +--> ProjectTasks
     +--> ProjectSubTasks
     +--> ProjectDeliverables
     +--> DocumentFiles

[Cliente]
     |
     v
(5) Aprovações e Comunicação
     |
     +--> Approvals
     +--> ApprovalSteps
     +--> SmsMessages
     +--> ProjectMessages

[Financeiro]
     |
     v
(6) Custos e Pagamentos
     |
     +--> ProjectCosts
     +--> PaymentMilestones
     +--> Invoices
     +--> Payments
```

## 3. DFD — Criar Tenant Trial

```text
Superadmin
   |
   v
Criar Tenant
   |
   +--> Tenants
   +--> TenantSettings
   +--> TrialAccess
   +--> Users
   +--> Roles
   +--> Permissions
   |
   v
Enviar convite
   |
   +--> Notifications
   +--> SmsMessages / Email
```

## 4. DFD — Criar Projeto

```text
TenantAdmin / ProjectManager
   |
   v
Criar Projeto
   |
   +--> Projects
   +--> ProjectMembers
   +--> ProjectTools
   +--> ProjectSettings
   |
   v
Criar Fases
   |
   +--> ProjectPhases
   +--> Deadlines
   +--> ProjectMilestones
   |
   v
Criar Tasks / Entregáveis
   |
   +--> ProjectTasks
   +--> ProjectSubTasks
   +--> ProjectDeliverables
```

## 5. DFD — Entregável

```text
Colaborador
   |
   v
Produz Entregável
   |
   +--> ProjectDeliverables
   +--> DeliverableVersions
   +--> DocumentFiles
   |
   v
Submete para Aprovação
   |
   +--> Approvals
   +--> ApprovalSteps
   +--> Notifications
   +--> SmsMessages
```

## 6. DFD — Aprovação

```text
Cliente/Aprovador
   |
   v
Recebe Notificação / SMS
   |
   v
Aprova ou Rejeita
   |
   +--> ApprovalSteps
   +--> Approvals
   +--> ActivityLog
   |
   v
Se aprovado:
   +--> atualizar Deliverable
   +--> verificar PaymentMilestone

Se rejeitado:
   +--> marcar NeedsRevision
   +--> criar comentário
   +--> notificar responsável
```

## 7. DFD — Pagamento por Milestone

```text
Milestone atingida
   |
   v
Validar condição
   |
   +--> PaymentMilestones
   |
   v
Gerar Invoice
   |
   +--> Invoices
   |
   v
Notificar Cliente
   |
   +--> Notifications
   +--> SmsMessages
   |
   v
Registar Pagamento
   |
   +--> Payments
   +--> DocumentFiles como comprovativo
```

## 8. DFD — SMS Bidirecional

```text
Sistema
   |
   v
Criar SMS Outbound
   |
   +--> SmsMessages
   |
   v
Gateway SMS
   |
   v
Atualizar estado

Cliente responde
   |
   v
Gateway Webhook
   |
   v
Processar inbound
   |
   +--> identificar Contact/User
   +--> identificar Tenant
   +--> identificar Project/WorkItem
   +--> aplicar SmsReplyRules
   |
   v
Criar comentário / aprovar / rejeitar / criar tarefa
```

## 9. DFD — Change Request

```text
Pedido extra
   |
   v
Verificar exclusões
   |
   +--> ProjectExclusions
   |
   v
Criar Change Request
   |
   +--> ProjectChangeRequests
   |
   v
Avaliar impacto
   |
   +--> custo
   +--> prazo
   +--> documentos
   |
   v
Aprovação
   |
   +--> Approvals
```



---

# ProjectYard — Database Design

## 1. Bases de dados

```text
ProjectYard
ProjectYardDocuments
```

## 2. Convenções

Todas as tabelas funcionais devem conter:

```text
Id
TenantId
CreatedAt
UpdatedAt
DeletedAt
CreatedByUserId
UpdatedByUserId
```

Campos opcionais conforme o caso:

```text
Uid
Status
RowVersion
IsDeleted
```

## 3. Tabelas de administração

### Tenants

```text
Id PK
Uid
Name
Slug
LegalName
TaxNumber
Email
Phone
Status
PlanId FK
TrialStartAt
TrialEndAt
IsTrial
IsActive
CreatedAt
UpdatedAt
DeletedAt
```

### TenantPlans

```text
Id PK
Code
Name
Description
MaxUsers
MaxProjects
MaxStorageMb
AllowsSms
AllowsApi
AllowsCustomBranding
MonthlyPrice
YearlyPrice
IsActive
CreatedAt
```

### TenantSettings

```text
Id PK
TenantId FK
DefaultLanguage
DefaultTimeZone
BrandLogoUrl
PrimaryColor
SmsEnabled
EmailEnabled
DocumentStorageMode
SettingsJson
CreatedAt
UpdatedAt
```

### TrialAccess

```text
Id PK
TenantId FK
CreatedBySuperAdminId FK
StartAt
EndAt
Status
ExtendedUntil
ExtensionReason
ConvertedAt
CancelledAt
CreatedAt
```

### SuperAdminUsers

```text
Id PK
UserId FK
IsOwner
CanManageTenants
CanViewBilling
CanViewAudit
CreatedAt
```

## 4. Utilizadores e permissões

### Users

```text
Id PK
TenantId FK NULL
IdentityUserId
DisplayName
Email
PhoneNumber
AvatarUrl
UserType
IsSuperAdmin
IsTenantAdmin
IsActive
LastLoginAt
CreatedAt
UpdatedAt
DeletedAt
```

### Roles

```text
Id PK
TenantId FK NULL
Name
Code
Description
IsSystemRole
CreatedAt
UpdatedAt
```

### Permissions

```text
Id PK
Code
Name
Description
Module
CreatedAt
```

### RolePermissions

```text
Id PK
RoleId FK
PermissionId FK
CreatedAt
```

### UserRoles

```text
Id PK
UserId FK
RoleId FK
ScopeType
ScopeId
CreatedAt
CreatedByUserId FK
```

## 5. Empresas e contactos

### Companies

```text
Id PK
TenantId FK
Name
CompanyType
TaxNumber
Email
Phone
Website
Address
PostalCode
City
Country
Notes
IsActive
CreatedAt
UpdatedAt
DeletedAt
```

### Contacts

```text
Id PK
TenantId FK
CompanyId FK
Name
Email
Phone
Role
IsPrimary
CanReceiveSms
CanApprove
CreatedAt
UpdatedAt
DeletedAt
```

## 6. Projetos

### Projects

```text
Id PK
TenantId FK
ClientCompanyId FK
Name
ProjectCode
Description
ProjectType
Status
HealthStatus
ProgressPercent
StartDate
PlannedEndDate
RevisedEndDate
ActualEndDate
ContractAmount
BudgetAmount
Currency
ProjectManagerUserId FK
CreatedAt
UpdatedAt
DeletedAt
```

### ProjectMembers

```text
Id PK
TenantId FK
ProjectId FK
UserId FK
RoleId FK
MemberType
CanView
CanComment
CanCreateTasks
CanManageTasks
CanUploadFiles
CanViewFinancials
CanManageProject
JoinedAt
RemovedAt
CreatedAt
```

### ProjectTools

```text
Id PK
TenantId FK
ProjectId FK
ToolCode
Title
Description
IsEnabled
Position
SettingsJson
CreatedAt
UpdatedAt
```

### ProjectSettings

```text
Id PK
TenantId FK
ProjectId FK
DefaultVisibility
AllowClientAccess
AllowClientComments
AllowClientFileUpload
EnableSmsAlerts
EnableCostControl
EnableDeadlineEscalation
SettingsJson
CreatedAt
UpdatedAt
```

## 7. Fases, milestones e prazos

### ProjectPhases

```text
Id PK
TenantId FK
ProjectId FK
Name
Description
PhaseOrder
PhaseType
Status
StartDate
PlannedEndDate
RevisedEndDate
ActualEndDate
RequiresApproval
ApprovedAt
ApprovedByUserId FK
ProgressPercent
CreatedAt
UpdatedAt
```

### ProjectMilestones

```text
Id PK
TenantId FK
ProjectId FK
PhaseId FK
Name
Description
MilestoneType
DueDate
CompletedAt
Status
TriggersPayment
CreatedAt
UpdatedAt
```

### Deadlines

```text
Id PK
TenantId FK
ProjectId FK
EntityType
EntityId
Title
OriginalDueDate
CurrentDueDate
CompletedAt
Status
ReminderPolicyId FK
EscalationPolicyId FK
ResponsibleUserId FK
CreatedAt
UpdatedAt
```

### DeadlineChanges

```text
Id PK
TenantId FK
DeadlineId FK
OldDueDate
NewDueDate
Reason
ChangedByUserId FK
CreatedAt
```

## 8. WorkItems

### WorkItems

```text
Id PK
TenantId FK
ProjectId FK
ParentWorkItemId FK NULL
ItemType
SourceTable
SourceId
Title
Summary
Status
Visibility
IsClientVisible
IsPinned
IsLocked
CommentsCount
AttachmentsCount
SubscribersCount
LastActivityAt
CreatedByUserId FK
UpdatedByUserId FK
CreatedAt
UpdatedAt
ArchivedAt
DeletedAt
```

## 9. Tasks

### ProjectTasks

```text
Id PK
TenantId FK
ProjectId FK
PhaseId FK
WorkItemId FK
SpecialtyId FK NULL
Title
Description
TaskType
Status
Priority
WorkflowStatus
AssignedOwnerUserId FK
StartDate
DueDate
CompletedAt
ProgressPercent
RequiresApproval
ApprovedAt
CreatedAt
UpdatedAt
```

### ProjectSubTasks

```text
Id PK
TenantId FK
TaskId FK
Title
Description
Status
AssignedToUserId FK
DueDate
CompletedAt
Position
CreatedAt
UpdatedAt
```

### TaskAssignments

```text
Id PK
TenantId FK
TaskId FK
UserId FK
AssignedByUserId FK
AssignedAt
UnassignedAt
```

### TaskDependencies

```text
Id PK
TenantId FK
TaskId FK
DependsOnTaskId FK
DependencyType
CreatedAt
```

### TaskChecklistItems

```text
Id PK
TenantId FK
TaskId FK
Title
Position
IsCompleted
CompletedAt
CompletedByUserId FK
CreatedAt
UpdatedAt
```

## 10. Especialidades

### ProjectSpecialties

```text
Id PK
TenantId FK
ProjectId FK
Code
Name
Description
ResponsibleUserId FK
ExternalEntityId FK NULL
Status
StartDate
DueDate
CompletedAt
RequiresSubmission
RequiresTechnicalDeclaration
CreatedAt
UpdatedAt
```

## 11. Entregáveis

### ProjectDeliverables

```text
Id PK
TenantId FK
ProjectId FK
PhaseId FK
TaskId FK NULL
SpecialtyId FK NULL
WorkItemId FK
Name
Description
DeliverableType
Required
Status
DueDate
SubmittedAt
ReviewedAt
ApprovedAt
RejectedAt
CurrentVersionId FK
CreatedAt
UpdatedAt
```

### DeliverableVersions

```text
Id PK
TenantId FK
DeliverableId FK
VersionNumber
DocumentFileId FK
ChangeSummary
SubmittedByUserId FK
SubmittedAt
Status
CreatedAt
```

### DeliverableApprovals

```text
Id PK
TenantId FK
DeliverableId FK
ApprovalId FK
CreatedAt
```

## 12. Aprovações

### Approvals

```text
Id PK
TenantId FK
ProjectId FK
WorkItemId FK NULL
ApprovalType
Title
Description
Status
RequestedByUserId FK
RequestedAt
CompletedAt
CreatedAt
UpdatedAt
```

### ApprovalSteps

```text
Id PK
TenantId FK
ApprovalId FK
StepNumber
ApproverUserId FK
ApproverContactId FK NULL
Status
Comment
RespondedAt
CreatedAt
UpdatedAt
```

## 13. Financeiro

### ProjectCosts

```text
Id PK
TenantId FK
ProjectId FK
PhaseId FK NULL
TaskId FK NULL
CostCategory
Description
SupplierCompanyId FK NULL
AmountWithoutVat
VatRate
VatAmount
TotalAmount
Currency
CostStatus
ExpectedDate
ActualDate
CreatedAt
UpdatedAt
```

### PaymentMilestones

```text
Id PK
TenantId FK
ProjectId FK
PhaseId FK NULL
MilestoneId FK NULL
Name
Description
Percentage
AmountWithoutVat
VatRate
VatAmount
TotalAmount
TriggerType
TriggerEntityType
TriggerEntityId
DueDate
Status
InvoiceId FK NULL
PaidAt
CreatedAt
UpdatedAt
```

### Invoices

```text
Id PK
TenantId FK
ProjectId FK
InvoiceNumber
InvoiceDate
DueDate
AmountWithoutVat
VatAmount
TotalAmount
Currency
Status
DocumentFileId
CreatedAt
UpdatedAt
```

### Payments

```text
Id PK
TenantId FK
ProjectId FK
InvoiceId FK NULL
PaymentMilestoneId FK NULL
PaymentDate
Amount
PaymentMethod
Reference
Status
ProofDocumentFileId
CreatedAt
UpdatedAt
```

## 14. Documentos — ProjectYardDocuments

### DocumentFiles

```text
Id PK
TenantId
ProjectId
DocumentType
OriginalFileName
StoredFileName
FileExtension
MimeType
FileSizeBytes
Checksum
StorageProvider
StoragePath
BlobData NULL
UploadedByUserId
UploadedAt
Status
CreatedAt
DeletedAt
```

### DocumentVersions

```text
Id PK
TenantId
DocumentFileId FK
VersionNumber
OriginalFileName
StoragePath
Checksum
FileSizeBytes
UploadedByUserId
ChangeSummary
CreatedAt
```

### DocumentLinks

```text
Id PK
TenantId
DocumentFileId FK
EntityType
EntityId
LinkedByUserId
CreatedAt
```

### DocumentAccessLog

```text
Id PK
TenantId
DocumentFileId FK
UserId
ActionType
IpAddress
UserAgent
CreatedAt
```

## 15. Comunicação

### ProjectMessages

```text
Id PK
TenantId FK
ProjectId FK
WorkItemId FK
Title
ContentHtml
ContentText
AuthorUserId FK
Visibility
Status
PublishedAt
CreatedAt
UpdatedAt
DeletedAt
```

### Comments

```text
Id PK
TenantId FK
ProjectId FK
WorkItemId FK
ParentCommentId FK NULL
AuthorUserId FK
ContentHtml
ContentText
Visibility
Status
CreatedAt
UpdatedAt
DeletedAt
```

## 16. SMS

### SmsMessages

```text
Id PK
TenantId FK
ProjectId FK NULL
WorkItemId FK NULL
Direction
FromNumber
ToNumber
ContactId FK NULL
UserId FK NULL
MessageText
Provider
ProviderMessageId
Status
ErrorMessage
SentAt
DeliveredAt
ReceivedAt
ProcessedAt
CreatedAt
```

### SmsTemplates

```text
Id PK
TenantId FK NULL
Code
Name
TemplateText
IsSystemTemplate
CreatedAt
UpdatedAt
```

### SmsReplyRules

```text
Id PK
TenantId FK
Keyword
ActionType
TargetEntityType
IsActive
CreatedAt
UpdatedAt
```

## 17. Notificações

### Notifications

```text
Id PK
TenantId FK
ProjectId FK NULL
WorkItemId FK NULL
NotificationType
Title
Body
ActorUserId FK NULL
MetadataJson
CreatedAt
```

### NotificationRecipients

```text
Id PK
TenantId FK
NotificationId FK
UserId FK NULL
ContactId FK NULL
DeliveryChannel
IsRead
ReadAt
IsDismissed
DismissedAt
DeliveredAt
FailedAt
FailureReason
CreatedAt
```

## 18. Change Requests e Exclusões

### ProjectChangeRequests

```text
Id PK
TenantId FK
ProjectId FK
Title
Description
Reason
RequestedByUserId FK NULL
RequestedByContactId FK NULL
RequestDate
ImpactOnCost
ImpactOnSchedule
AdditionalAmount
AdditionalDays
Status
ApprovedByUserId FK NULL
ApprovedAt
RejectedAt
CreatedAt
UpdatedAt
```

### ProjectExclusions

```text
Id PK
TenantId FK
ProjectId FK
Category
Description
SourceReference
RequiresChangeRequest
CanBeQuotedSeparately
AcknowledgedByClient
AcknowledgedAt
CreatedAt
UpdatedAt
```

## 19. Visitas

### ProjectSiteVisits

```text
Id PK
TenantId FK
ProjectId FK
VisitDate
Period
VisitType
ResponsibleUserId FK
Description
Findings
ActionsRequired
Cost
Billable
InvoiceId FK NULL
Status
CreatedAt
UpdatedAt
```

### SiteVisitPhotos

```text
Id PK
TenantId FK
SiteVisitId FK
DocumentFileId
Caption
CreatedAt
```

## 20. Riscos e bloqueios

### ProjectRisks

```text
Id PK
TenantId FK
ProjectId FK
WorkItemId FK NULL
Title
Description
Category
Probability
Impact
Severity
OwnerUserId FK
MitigationPlan
Status
DueDate
CreatedAt
UpdatedAt
ClosedAt
```

### ProjectBlockers

```text
Id PK
TenantId FK
ProjectId FK
TaskId FK NULL
Title
Description
BlockedBy
ResponsibleUserId FK
Status
CreatedAt
ResolvedAt
```

## 21. Auditoria

### ActivityLog

```text
Id PK
TenantId FK
ProjectId FK NULL
WorkItemId FK NULL
ActorUserId FK NULL
ActionType
EntityType
EntityId
Title
Description
MetadataJson
CreatedAt
```

### AuditLog

```text
Id PK
TenantId FK NULL
ActorUserId FK NULL
Action
EntityType
EntityId
OldValuesJson
NewValuesJson
IpAddress
UserAgent
CreatedAt
```

## 22. Relações principais

```text
Tenants 1:N Users
Tenants 1:N Projects
Projects 1:N ProjectPhases
Projects 1:N ProjectTasks
Projects 1:N ProjectDeliverables
Projects 1:N PaymentMilestones
ProjectPhases 1:N ProjectTasks
ProjectTasks 1:N ProjectSubTasks
ProjectTasks N:N Users via TaskAssignments
ProjectTasks N:N ProjectTasks via TaskDependencies
ProjectDeliverables 1:N DeliverableVersions
Approvals 1:N ApprovalSteps
Invoices 1:N Payments
DocumentFiles 1:N DocumentVersions
DocumentFiles 1:N DocumentLinks
WorkItems 1:N Comments
WorkItems 1:N Notifications
```

## 23. Índices recomendados

```text
Tenants(Slug)
Users(TenantId, Email)
Projects(TenantId, Status)
Projects(TenantId, ProjectManagerUserId)
ProjectTasks(TenantId, ProjectId, Status)
ProjectTasks(TenantId, DueDate)
ProjectDeliverables(TenantId, ProjectId, Status)
Deadlines(TenantId, CurrentDueDate, Status)
PaymentMilestones(TenantId, ProjectId, Status)
SmsMessages(TenantId, ProjectId, Status)
DocumentFiles(TenantId, ProjectId)
ActivityLog(TenantId, ProjectId, CreatedAt)
AuditLog(TenantId, CreatedAt)
```



---

# ProjectYard — Módulos Funcionais

## 1. Tenant Management

Funções:

- criar tenant;
- criar trial 30 dias;
- suspender tenant;
- converter trial em cliente;
- configurar plano;
- definir limites;
- controlar storage;
- configurar SMS/email.

## 2. User Management

Funções:

- criar utilizadores;
- convidar por email;
- convidar por SMS;
- atribuir roles;
- ativar/desativar;
- gerir permissões;
- gerir clientes/convidados.

## 3. Projects

Funções:

- criar projeto;
- definir cliente;
- definir gestor;
- configurar ferramentas;
- adicionar membros;
- controlar estado;
- controlar saúde;
- controlar progresso.

## 4. Project Tools

Ferramentas ativáveis:

```text
Message Board
To-dos
Docs & Files
Calendar
Chat
Card Table
Check-ins
External Links
Decisions
Risks
Approvals
Costs
Payments
Reports
```

## 5. Tasks / Subtasks

Funções:

- task por fase;
- task por especialidade;
- subtasks;
- checklist;
- responsáveis;
- prioridades;
- dependências;
- prazos;
- comentários;
- anexos;
- aprovação.

## 6. Deliverables

Funções:

- criar entregável;
- associar a fase/task/especialidade;
- versionar;
- anexar documentos;
- submeter para aprovação;
- controlar estado;
- controlar prazo.

## 7. Documents

Funções:

- upload;
- versões;
- ligação a qualquer entidade;
- download;
- preview futuro;
- logs de acesso;
- storage separado.

## 8. Approvals

Funções:

- aprovação de entregável;
- aprovação de orçamento;
- aprovação de pagamento;
- aprovação de change request;
- aprovação por SMS;
- histórico de decisão.

## 9. Cost Control

Funções:

- custos previstos;
- custos reais;
- custos por fase;
- custos por fornecedor;
- custos extra;
- variação;
- relatório financeiro.

## 10. Payments

Funções:

- plano de pagamentos;
- milestones;
- faturas;
- comprovativos;
- alertas de vencimento;
- pagamento parcial;
- estado de pagamento.

## 11. SMS

Funções:

- templates;
- envio manual;
- envio automático;
- resposta inbound;
- regras por keyword;
- associação a projeto/aprovação/tarefa;
- histórico.

## 12. Deadlines

Funções:

- prazos por entidade;
- alertas antes/depois;
- histórico de alteração;
- escalonamento;
- dashboard de atrasos.

## 13. Risks / Blockers

Funções:

- registar riscos;
- probabilidade;
- impacto;
- severidade;
- mitigação;
- blockers de tasks;
- responsável por desbloquear.

## 14. Change Requests

Funções:

- pedido extra;
- impacto em custo;
- impacto em prazo;
- aprovação;
- ligação a exclusões;
- implementação.

## 15. Reports

Relatórios:

- projeto;
- financeiro;
- atrasos;
- entregáveis;
- aprovações;
- riscos;
- SMS;
- auditoria.



---

# ProjectYard — Ecrãs

## 1. Superadmin

```text
Dashboard Global
Tenants
Criar Tenant Trial
Planos
Utilizadores Globais
SMS Global
Auditoria
Configurações
```

## 2. Tenant Admin

```text
Dashboard Tenant
Utilizadores
Roles
Permissões
Empresas
Contactos
Configurações
Templates SMS
```

## 3. Projetos

```text
Lista de Projetos
Criar Projeto
Editar Projeto
Dashboard do Projeto
Membros
Ferramentas
Atividade
```

## 4. Project Dashboard

Widgets:

```text
Estado do projeto
Progresso
Tarefas abertas
Tarefas em atraso
Entregáveis pendentes
Aprovações pendentes
Pagamentos pendentes
Riscos abertos
Atividade recente
```

## 5. Fases

```text
Lista de fases
Detalhe da fase
Tasks da fase
Entregáveis da fase
Pagamentos associados
Prazos
```

## 6. Tasks

```text
Lista
Kanban
Detalhe da task
Subtasks
Checklist
Comentários
Anexos
Dependências
Histórico
```

## 7. Entregáveis

```text
Lista
Detalhe
Versões
Documentos
Submeter para aprovação
Estado
Comentários
```

## 8. Documentos

```text
Biblioteca
Pastas
Upload
Versões
Detalhe do documento
Histórico de acesso
Documentos ligados
```

## 9. Aprovações

```text
Pendentes
Detalhe
Passos
Aprovar
Rejeitar
Pedir alterações
Histórico
```

## 10. Financeiro

```text
Custos
Plano de pagamentos
Milestones
Faturas
Pagamentos
Comprovativos
Relatório financeiro
```

## 11. SMS

```text
SMS enviados
SMS recebidos
Templates
Regras de resposta
Detalhe da conversa
SMS não associados
```

## 12. Riscos

```text
Lista
Matriz probabilidade/impacto
Detalhe
Mitigações
Bloqueios
```

## 13. Reports

```text
Relatório do projeto
Relatório financeiro
Relatório de atrasos
Relatório de entregáveis
Relatório de aprovações
Relatório de SMS
```



---

# ProjectYard — Roadmap

## MVP

Objetivo: ter um sistema usável para controlar projetos simples com documentos e tarefas.

Inclui:

- multi-tenant básico;
- superadmin;
- trial 30 dias;
- utilizadores;
- roles;
- projetos;
- membros;
- fases;
- tasks;
- subtasks;
- documentos;
- prazos;
- comentários;
- atividade.

## V1

Objetivo: tornar o sistema útil para projetos profissionais.

Inclui:

- entregáveis;
- aprovações;
- custos;
- pagamentos;
- milestones;
- notificações;
- base documental separada;
- dashboards.

## V2

Objetivo: automatizar controlo e comunicação.

Inclui:

- SMS outbound;
- SMS inbound;
- templates SMS;
- reply rules;
- change requests;
- exclusões;
- riscos;
- blockers;
- visitas;
- relatórios.

## V3

Objetivo: colaboração avançada.

Inclui:

- Kanban;
- chat;
- calendar;
- check-ins;
- project templates;
- automações;
- escalonamentos.

## Enterprise

Inclui:

- DB dedicada por tenant;
- storage dedicado;
- API pública;
- webhooks;
- OCR;
- IA;
- assinatura digital;
- integração com faturação;
- integração com pagamentos;
- dashboards BI.



---

# ProjectYard — Guia de Desenvolvimento

## 1. Template escolhido

**Materio**

O Materio será usado como camada visual/admin template.

## 2. Stack

```text
ASP.NET Core MVC / .NET 10
EF Core 10
ASP.NET Identity
Finbuckle.MultiTenant
Clean Architecture
Materio
Hangfire
```

## 3. Primeira ordem de implementação

```text
1. Criar solution
2. Criar projetos
3. Integrar Materio no ProjectYard.Web
4. Configurar Identity
5. Configurar Finbuckle
6. Criar Tenant model
7. Criar DbContext principal
8. Criar DbContext documental
9. Criar Users/Roles
10. Criar Projects
11. Criar Phases
12. Criar Tasks/SubTasks
13. Criar Documents
```

## 4. Namespaces

```text
ProjectYard.Domain
ProjectYard.Application
ProjectYard.Infrastructure
ProjectYard.Documents
ProjectYard.Web
```

## 5. DbContexts

```text
ProjectYardDbContext
ProjectYardIdentityDbContext
ProjectYardDocumentsDbContext
```

## 6. Primeiras entidades a criar

```text
Tenant
TenantPlan
TrialAccess
ApplicationUser
Role
Permission
Company
Contact
Project
ProjectMember
ProjectPhase
ProjectTask
ProjectSubTask
DocumentFile
DocumentVersion
DocumentLink
```

## 7. Migrations iniciais

```text
InitialIdentity
InitialTenancy
InitialProjects
InitialDocuments
```

## 8. Convenções MVC

Controllers:

```text
TenantsController
ProjectsController
ProjectPhasesController
ProjectTasksController
DocumentsController
ApprovalsController
PaymentsController
SmsController
```

Views:

```text
Views/Tenants
Views/Projects
Views/Tasks
Views/Documents
Views/Approvals
Views/Payments
Views/Sms
```

ViewModels:

```text
ProjectCreateViewModel
ProjectDashboardViewModel
TaskDetailViewModel
DeliverableDetailViewModel
PaymentMilestoneViewModel
```

## 9. Tenant Filter

Todas as queries funcionais devem filtrar por TenantId.

## 10. Segurança

Nunca confiar apenas na UI.  
Validar permissões na camada Application/Infrastructure.


