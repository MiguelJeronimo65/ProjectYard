using System.Globalization;
using Microsoft.AspNetCore.Html;

namespace ProjectYard.Web.Helpers;

/// <summary>Réplica em Razor dos componentes do protótipo (Avatar, Progress, Donut, BarChart, AvStack).</summary>
public static class Components
{
    private static readonly string[] Palette =
        { "#6a5af9", "#18b07b", "#f5a524", "#e8526b", "#21a8c4", "#9b59f5", "#ef7d54", "#2a7fb8", "#233140" };

    public static string Color(string? seed)
    {
        if (string.IsNullOrEmpty(seed)) return "#233140";
        int h = 0;
        foreach (var c in seed) h = (h * 31 + c) & 0x7fffffff;
        return Palette[h % Palette.Length];
    }

    public static string Initials(string? name)
    {
        if (string.IsNullOrWhiteSpace(name)) return "?";
        var parts = name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return string.Concat(parts.Take(2).Select(p => char.ToUpper(p[0])));
    }

    public static IHtmlContent Avatar(string? name, int size = 34, bool sq = false)
    {
        var fs = size * 0.4;
        var cls = sq ? "avatar sq" : "avatar";
        return new HtmlString(
            $"<div class=\"{cls}\" title=\"{Esc(name)}\" style=\"width:{size}px;height:{size}px;background:{Color(name)};font-size:{Fmt(fs)}px;\">{Esc(Initials(name))}</div>");
    }

    public static IHtmlContent AvStack(IEnumerable<string> names, int max = 3, int size = 27)
    {
        var list = names.ToList();
        var shown = list.Take(max);
        var extra = list.Count - max;
        var sb = new System.Text.StringBuilder("<div class=\"av-stack\">");
        foreach (var n in shown) sb.Append(Avatar(n, size).ToString());
        if (extra > 0)
            sb.Append($"<div class=\"avatar av-more\" style=\"width:{size}px;height:{size}px;font-size:{Fmt(size * 0.36)}px;margin-left:-9px;border:2px solid var(--surface);\">+{extra}</div>");
        sb.Append("</div>");
        return new HtmlString(sb.ToString());
    }

    public static IHtmlContent Progress(double pct, bool thin = false, string? color = null)
    {
        var bg = color ?? "var(--grad)";
        return new HtmlString(
            $"<div class=\"prog{(thin ? " thin" : "")}\"><span style=\"width:{Fmt(Math.Clamp(pct, 0, 100))}%;background:{bg};\"></span></div>");
    }

    public static IHtmlContent HealthDot(string health)
        => new HtmlString($"<span class=\"health-dot h-{health}\"></span>");

    public static IHtmlContent BarChart(IReadOnlyList<(string M, double V)> data, int height = 150)
    {
        var max = data.Count == 0 ? 1 : Math.Max(1, data.Max(d => d.V));
        var sb = new System.Text.StringBuilder($"<div style=\"display:flex;align-items:flex-end;gap:10px;height:{height}px;\">");
        for (int i = 0; i < data.Count; i++)
        {
            var grad = i >= data.Count - 2 ? "var(--grad-gold)" : "var(--accent-soft2)";
            var h = Fmt(data[i].V / max * 100);
            sb.Append($"<div style=\"flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;\">" +
                      $"<div style=\"flex:1;width:100%;display:flex;align-items:flex-end;\"><div title=\"{Fmt(data[i].V)}k €\" style=\"width:100%;height:{h}%;background:{grad};border-radius:7px 7px 4px 4px;min-height:6px;\"></div></div>" +
                      $"<span class=\"muted-3\" style=\"font-size:11.5px;font-weight:700;\">{Esc(data[i].M)}</span></div>");
        }
        sb.Append("</div>");
        return new HtmlString(sb.ToString());
    }

    public static IHtmlContent Donut(IReadOnlyList<(double V, string Color)> segments, int size = 126, int stroke = 18)
    {
        double r = (size - stroke) / 2.0;
        double c = 2 * Math.PI * r;
        double total = segments.Sum(s => s.V);
        if (total <= 0) total = 1;
        double offset = 0;
        var sb = new System.Text.StringBuilder(
            $"<svg width=\"{size}\" height=\"{size}\" style=\"transform:rotate(-90deg);\">" +
            $"<circle cx=\"{size / 2}\" cy=\"{size / 2}\" r=\"{Fmt(r)}\" fill=\"none\" stroke=\"var(--surface-3)\" stroke-width=\"{stroke}\"></circle>");
        foreach (var s in segments)
        {
            double len = s.V / total * c;
            sb.Append($"<circle cx=\"{size / 2}\" cy=\"{size / 2}\" r=\"{Fmt(r)}\" fill=\"none\" stroke=\"{s.Color}\" stroke-width=\"{stroke}\" stroke-dasharray=\"{Fmt(len)} {Fmt(c - len)}\" stroke-dashoffset=\"{Fmt(-offset)}\"></circle>");
            offset += len;
        }
        sb.Append("</svg>");
        return new HtmlString(sb.ToString());
    }

    /// <summary>Anel de progresso (réplica do Ring do protótipo).</summary>
    public static IHtmlContent Ring(int value, int size = 84, int stroke = 9, string? label = null)
    {
        double r = (size - stroke) / 2.0;
        double c = 2 * Math.PI * r;
        var id = "ringg" + Math.Abs((value * 31 + size) % 9973);
        var sb = new System.Text.StringBuilder();
        sb.Append($"<div style=\"position:relative;width:{size}px;height:{size}px;flex-shrink:0;\">");
        sb.Append($"<svg width=\"{size}\" height=\"{size}\" style=\"transform:rotate(-90deg);\">");
        sb.Append($"<circle cx=\"{size / 2}\" cy=\"{size / 2}\" r=\"{Fmt(r)}\" fill=\"none\" stroke=\"var(--surface-3)\" stroke-width=\"{stroke}\"></circle>");
        sb.Append($"<circle cx=\"{size / 2}\" cy=\"{size / 2}\" r=\"{Fmt(r)}\" fill=\"none\" stroke=\"url(#{id})\" stroke-width=\"{stroke}\" stroke-linecap=\"round\" stroke-dasharray=\"{Fmt(c)}\" stroke-dashoffset=\"{Fmt(c - c * Math.Clamp(value, 0, 100) / 100)}\"></circle>");
        sb.Append($"<defs><linearGradient id=\"{id}\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"var(--accent)\"></stop><stop offset=\"1\" stop-color=\"var(--accent-700)\"></stop></linearGradient></defs>");
        sb.Append("</svg>");
        sb.Append($"<div style=\"position:absolute;inset:0;display:grid;place-items:center;text-align:center;\"><div><div class=\"num\" style=\"font-size:{Fmt(size * 0.26)}px;font-weight:700;line-height:1;\">{value}%</div>");
        if (label != null) sb.Append($"<div class=\"muted-3\" style=\"font-size:11px;font-weight:700;margin-top:2px;\">{Esc(label)}</div>");
        sb.Append("</div></div></div>");
        return new HtmlString(sb.ToString());
    }

    private static string Fmt(double n) => n.ToString("0.##", CultureInfo.InvariantCulture);
    private static string Esc(string? s) => System.Net.WebUtility.HtmlEncode(s ?? "");
}
