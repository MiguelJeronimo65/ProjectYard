using ProjectYard.Data.Entities;

namespace ProjectYard.Web.Models;

public class ChatThreadVm
{
    public ChatChannel Channel { get; set; } = null!;
    public List<string> OtherNames { get; set; } = new();
    public List<string> AllNames { get; set; } = new();
    public DateTime? LastAt { get; set; }
    public string Preview { get; set; } = "";
    public int Unread { get; set; }

    public string DisplayName => Channel.Type == "channel" ? "#" + Channel.Name : (OtherNames.FirstOrDefault() ?? "Conversa direta");
}

/// <summary>Reações agregadas de uma mensagem: emoji → (contagem, fui-eu, quem reagiu).</summary>
public class ChatReactionVm
{
    public string Emoji { get; set; } = "";
    public int Count { get; set; }
    public bool Mine { get; set; }
    public List<string> Names { get; set; } = new();
}

/// <summary>Participante de um canal / contacto da equipa (modal de participantes, novo canal, iniciar DM).</summary>
public class ChatMemberVm
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public string? Funcao { get; set; }
}

/// <summary>Projeto do tenant — alvo do dropdown "projeto associado" ao criar canal.</summary>
public class ChatProjectVm
{
    public long Id { get; set; }
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
}
