using Microsoft.AspNetCore.Html;

namespace ProjectYard.Web.Helpers;

/// <summary>Ícones de linha (SVG inline) — mesmos paths do protótipo (prototype/data.jsx).</summary>
public static class Icons
{
    private static readonly Dictionary<string, string[]> Paths = new()
    {
        ["grid"] = new[] { "M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z" },
        ["folder"] = new[] { "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
        ["check"] = new[] { "M20 6 9 17l-5-5" },
        ["checkSquare"] = new[] { "m9 11 3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
        ["fileText"] = new[] { "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M9 13h6", "M9 17h4" },
        ["card"] = new[] { "M2 5h20v14H2z", "M2 10h20" },
        ["search"] = new[] { "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "m21 21-4.3-4.3" },
        ["bell"] = new[] { "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0" },
        ["settings"] = new[] { "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" },
        ["plus"] = new[] { "M12 5v14", "M5 12h14" },
        ["chevD"] = new[] { "m6 9 6 6 6-6" },
        ["arrowRight"] = new[] { "M5 12h14", "m12 5 7 7-7 7" },
        ["trend"] = new[] { "m23 6-9.5 9.5-5-5L1 18", "M17 6h6v6" },
        ["clock"] = new[] { "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2" },
        ["calendar"] = new[] { "M3 4h18v18H3z", "M3 10h18", "M8 2v4", "M16 2v4" },
        ["users"] = new[] { "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M22 21v-2a4 4 0 0 0-3-3.9", "M16 3.1a4 4 0 0 1 0 7.8" },
        ["user"] = new[] { "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
        ["alert"] = new[] { "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z", "M12 9v4", "M12 17h.01" },
        ["shield"] = new[] { "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
        ["layers"] = new[] { "m12 2 9 5-9 5-9-5 9-5z", "m3 12 9 5 9-5", "m3 17 9 5 9-5" },
        ["message"] = new[] { "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
        ["sms"] = new[] { "M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5a8.5 8.5 0 0 1 3.6-11.4 8.4 8.4 0 0 1 12 7.9z", "M8 12h.01", "M12 12h.01", "M16 12h.01" },
        ["logout"] = new[] { "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "m16 17 5-5-5-5", "M21 12H9" },
        ["eye"] = new[] { "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
        ["euro"] = new[] { "M14 21a8 8 0 1 1 0-16", "M4 11h10", "M4 15h8" },
        ["building"] = new[] { "M3 21h18", "M5 21V7l7-4 7 4v14", "M9 9h.01", "M15 9h.01", "M9 13h.01", "M15 13h.01", "M9 17h.01", "M15 17h.01" },
        ["spark"] = new[] { "M12 3v4", "M12 17v4", "M3 12h4", "M17 12h4", "m5.6 5.6 2.8 2.8", "m15.6 15.6 2.8 2.8", "m18.4 5.6-2.8 2.8", "m8.4 15.6-2.8 2.8" },
        ["lock"] = new[] { "M5 11h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z", "M8 11V7a4 4 0 1 1 8 0v4" },
        ["mail"] = new[] { "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "m22 7-10 6L2 7" },
        ["menu"] = new[] { "M3 6h18", "M3 12h18", "M3 18h18" },
        ["gantt"] = new[] { "M8 6h12", "M4 12h10", "M10 18h8" },
        ["briefcase"] = new[] { "M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M2 12h20" },
        ["sun"] = new[] { "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 1v2", "M12 21v2", "M4.2 4.2l1.4 1.4", "M18.4 18.4l1.4 1.4", "M1 12h2", "M21 12h2", "M4.2 19.8l1.4-1.4", "M18.4 5.6l1.4-1.4" },
        ["moon"] = new[] { "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" },
        ["monitor"] = new[] { "M3 4h18v12H3z", "M8 20h8", "M12 16v4" },
        ["download"] = new[] { "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m7 10 5 5 5-5", "M12 15V3" },
        ["x"] = new[] { "M18 6 6 18", "M6 6l12 12" },
        ["chevL"] = new[] { "m15 18-6-6 6-6" },
        ["chevR"] = new[] { "m9 18 6-6-6-6" },
        ["spark2"] = new[] { "M12 3v4", "M12 17v4", "M3 12h4", "M17 12h4" },
        ["dots"] = new[] { "M5 12h.01", "M12 12h.01", "M19 12h.01" },
        ["target"] = new[] { "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
        ["kanban"] = new[] { "M6 3v12", "M12 3v8", "M18 3v16", "M4 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0", "M10 14a2 2 0 1 0 4 0a2 2 0 1 0-4 0", "M16 21a2 2 0 1 0 4 0a2 2 0 1 0-4 0" },
    };

    public static IHtmlContent Render(string name, int size = 20)
    {
        if (!Paths.TryGetValue(name, out var paths))
            return HtmlString.Empty;
        var inner = string.Concat(paths.Select(d => $"<path d=\"{d}\"></path>"));
        var svg = $"<svg width=\"{size}\" height=\"{size}\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" " +
                  $"stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">{inner}</svg>";
        return new HtmlString(svg);
    }
}
