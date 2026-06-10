using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Identity;

var builder = WebApplication.CreateBuilder(args);

// EF Core + Pomelo MySQL (database-first). ServerVersion fixo para evitar ligação no arranque.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 41))));

// ASP.NET Identity (core) — UserManager/RoleManager para o seeder e (Fase 5) autenticação.
// O AddIdentity completo (cookies, login UI, middleware de auth) entra na Fase 5.
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = false; // email único por tenant (multi-tenant), não global
    })
    .AddRoles<ApplicationRole>()
    .AddEntityFrameworkStores<AppDbContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Seed de dados de exemplo: `dotnet run -- seed` (idempotente; não corre no arranque normal).
if (args.Contains("seed"))
{
    using var scope = app.Services.CreateScope();
    await ProjectYard.Web.Data.DataSeeder.SeedAsync(scope.ServiceProvider);
    return;
}

// Diagnóstico: `dotnet run -- verify-login` — prova que a password está hasheada e é reconhecida pelo Identity.
if (args.Contains("verify-login"))
{
    using var scope = app.Services.CreateScope();
    var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var u = await users.FindByEmailAsync("migueljeronimo@netcabo.pt");
    if (u is null) { Console.WriteLine("verify-login: superadmin não encontrado (corre o seed)."); return; }
    var ok = await users.CheckPasswordAsync(u, ProjectYard.Web.Data.DataSeeder.SuperadminPassword);
    Console.WriteLine($"verify-login: utilizador={u.Email} role={u.Role} superadmin={u.IsSuperadmin}");
    Console.WriteLine($"  password_hash (início)='{u.PasswordHash?[..Math.Min(24, u.PasswordHash.Length)]}...' (len={u.PasswordHash?.Length})");
    Console.WriteLine($"  CheckPasswordAsync('{ProjectYard.Web.Data.DataSeeder.SuperadminPassword}') => {ok}");
    return;
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
