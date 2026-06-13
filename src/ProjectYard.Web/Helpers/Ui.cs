using System.Globalization;

namespace ProjectYard.Web.Helpers;

/// <summary>Formatação e badges PT-PT partilhados pelas views.</summary>
public static class Ui
{
    private static readonly CultureInfo Pt = CultureInfo.GetCultureInfo("pt-PT");
    private static readonly string[] Mon = { "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" };

    public static string Eur(decimal? n) => (n ?? 0m).ToString("#,##0", Pt) + " €";

    /// <summary>€840k / €12,9k — inteiro acima de 100k, 1 casa abaixo (igual ao kk() do protótipo).</summary>
    public static string Kk(decimal? n)
    {
        var v = n ?? 0m;
        return "€" + (v >= 100000 ? Math.Round(v / 1000).ToString("#,##0", Pt) : (v / 1000).ToString("0.0", Pt)) + "k";
    }
    public static string Num(decimal? n) => (n ?? 0m).ToString("#,##0.##", Pt);

    public static string Date(DateOnly? d) => d is { } x ? $"{x.Day} {Mon[x.Month - 1]} {x.Year}" : "—";
    public static string Date(DateTime? d) => d is { } x ? $"{x.Day} {Mon[x.Month - 1]} {x.Year}" : "—";

    public static string ProjectStatus(string s) => s switch
    {
        "Em curso" => "b-blue", "Em risco" => "b-red", "Concluído" => "b-green",
        "Proposta" => "b-gray", "Suspenso" => "b-amber", "Cancelado" => "b-red", _ => "b-gray"
    };

    public static string TenantStatus(string s) => s switch
    {
        "Ativo" => "b-green", "Trial" => "b-amber", "Suspenso" => "b-red", _ => "b-gray"
    };

    public static string PhaseStatus(string s) => s switch
    {
        "Concluída" => "b-green", "Em curso" => "b-blue", "Suspensa" => "b-amber", _ => "b-gray"
    };

    public static string DeliverableStatus(string s) => s switch
    {
        "Aprovado" => "b-green", "Em aprovação" => "b-amber", "Em revisão" => "b-blue",
        "Precisa revisão" => "b-red", _ => "b-gray"
    };

    public static string InvoiceStatus(string s) => s switch
    {
        "Pago" => "b-green", "Pendente" => "b-amber", "Vencido" => "b-red", _ => "b-gray"
    };

    public static string MilestoneStatus(string s) => s switch
    {
        "Pago" => "b-green", "Faturado" => "b-blue", "Atingido" => "b-amber", _ => "b-gray"
    };

    public static string RiskStatus(string s) => s switch
    {
        "Mitigado" => "b-green", "Monitorizado" => "b-blue", "Fechado" => "b-gray", _ => "b-red"
    };

    public static string ClientStatus(string s) => s switch
    {
        "Ativo" => "b-green", "Em risco" => "b-red", "Concluído" => "b-blue", _ => "b-gray"
    };

    public static (string label, string cls) TaskState(string s) => s switch
    {
        "doing" => ("Em curso", "b-blue"),
        "review" => ("Em revisão", "b-amber"),
        "done" => ("Concluído", "b-green"),
        _ => ("Por fazer", "b-gray")
    };

    public static string Health(string h) => h switch { "green" => "var(--success)", "amber" => "var(--warning)", _ => "var(--danger)" };
}
