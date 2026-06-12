using Microsoft.AspNetCore.Mvc;

namespace ProjectYard.Web.Controllers;

public class MailItem
{
    public string Id = ""; public string From = ""; public string FromEmail = "";
    public string Subject = ""; public string Snippet = ""; public string? Label; public string? LabelColor;
    public string Time = ""; public bool Unread; public bool Starred; public string? Attach; public string Project = "";
    public string[] Body = Array.Empty<string>();
}

/// <summary>Correio — UI fiel ao protótipo. Conteúdo de demonstração até existir integração de email (Fase 3 do roadmap).</summary>
public class MailController : Controller
{
    private static readonly MailItem[] Demo =
    {
        new() { Id = "m1", From = "Imobiliária Atlântico", FromEmail = "gestao@atlantico.pt", Subject = "Aprovação do Projeto de Arquitetura — Lic.", Snippet = "Bom dia. Confirmamos a aprovação das peças submetidas para licenciamento. Seguimos para…", Label = "Clientes", LabelColor = "#6a5af9", Time = "08:40", Unread = true, Starred = true, Attach = "PE_Arquitetura.pdf", Project = "Edifício Marquês", Body = new[] { "Bom dia Ana,", "Confirmamos a aprovação das peças de Arquitetura submetidas para licenciamento. Pode avançar com a entrega na Câmara.", "Aguardamos o cronograma atualizado da fase seguinte.", "Com os melhores cumprimentos,\nImobiliária Atlântico" } },
        new() { Id = "m2", From = "Câmara Municipal do Porto", FromEmail = "urbanismo@cm-porto.pt", Subject = "Pedido de elementos adicionais — Bolhão", Snippet = "No seguimento do processo n.º 1184/26, solicitamos os seguintes elementos em falta…", Label = "Entidades", LabelColor = "#2a7fb8", Time = "10:12", Unread = true, Project = "Mercado do Bolhão", Body = new[] { "Exmos. Senhores,", "No seguimento do processo n.º 1184/26, solicitamos os seguintes elementos em falta para prosseguir a apreciação:", "— Pormenor construtivo da cobertura;\n— Cálculo de acessibilidades atualizado.", "O prazo de resposta é de 15 dias úteis." } },
        new() { Id = "m3", From = "Grupo Vértice SA", FromEmail = "obras@vertice.pt", Subject = "Confirmação reunião de obra — 5ª feira 15h", Snippet = "Confirmamos a presença na reunião de acompanhamento. Levaremos o ponto de situação…", Label = "Clientes", LabelColor = "#6a5af9", Time = "12:44", Attach = "Ordem_Trabalhos.pdf", Project = "Sede Nova — Vértice", Body = new[] { "Olá Ana,", "Confirmamos a presença na reunião de acompanhamento de 5ª feira às 15h.", "Levaremos o ponto de situação dos acabamentos e a lista de decisões pendentes.", "Cumprimentos." } },
        new() { Id = "m4", From = "Betões do Norte, Lda", FromEmail = "comercial@betoesnorte.pt", Subject = "Proposta de fornecimento atualizada", Snippet = "Segue em anexo a proposta revista para o fornecimento de betão C30/37, com novas…", Label = "Fornecedores", LabelColor = "#e0922a", Time = "Ontem", Attach = "Proposta_Betao_v2.pdf", Project = "Edifício Marquês", Body = new[] { "Caros,", "Segue em anexo a proposta revista para o fornecimento de betão C30/37, com novas condições de prazo e preço.", "Validade da proposta: 30 dias.", "Ao dispor." } },
        new() { Id = "m5", From = "Família Albuquerque", FromEmail = "j.albuquerque@email.pt", Subject = "Dúvidas sobre acabamentos da moradia", Snippet = "Boa tarde. Gostaríamos de rever a paleta de materiais do piso 0 antes de avançar…", Label = "Clientes", LabelColor = "#6a5af9", Time = "Ontem", Starred = true, Project = "Quinta do Lago — V4", Body = new[] { "Boa tarde,", "Gostaríamos de rever a paleta de materiais do piso 0 antes de avançar para a fase seguinte.", "Podemos agendar uma chamada esta semana?", "Obrigado." } },
        new() { Id = "m6", From = "Contabilidade — ROC", FromEmail = "roc@contab.pt", Subject = "Fatura FT 2026/052 emitida e enviada", Snippet = "Confirmamos a emissão da fatura FT 2026/052 no valor de 24.800 € referente ao milestone…", Label = "Faturação", LabelColor = "#1f9d6b", Time = "5 Jun", Attach = "FT_2026_052.pdf", Project = "Edifício Marquês", Body = new[] { "Olá,", "Confirmamos a emissão da fatura FT 2026/052 no valor de 24.800 € referente ao milestone \"Especialidades — 1ª fase\".", "O documento foi enviado ao cliente com vencimento a 16 Jun." } },
        new() { Id = "m7", From = "Sofia Lemos", FromEmail = "sofia.lemos@atelier-norte.pt", Subject = "Render da fachada norte para validação", Snippet = "Ana, deixei o render atualizado na pasta de Documentos. Podes validar antes de enviarmos…", Time = "4 Jun", Attach = "Render_Fachada.jpg", Project = "Edifício Marquês", Body = new[] { "Ana,", "Deixei o render atualizado na pasta de Documentos. Podes validar antes de enviarmos ao cliente?", "Obrigada!" } },
    };

    public IActionResult Index(string? open)
    {
        ViewBag.Emails = Demo;
        ViewBag.Open = Demo.FirstOrDefault(e => e.Id == open);
        return View();
    }
}
