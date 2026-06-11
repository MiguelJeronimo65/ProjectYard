using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectYard.Data.Data;
using ProjectYard.Data.Identity;
using ProjectYard.Web.Identity;
using ProjectYard.Web.Tenancy;

var builder = WebApplication.CreateBuilder(args);

// EF Core + Pomelo MySQL (database-first). ServerVersion fixo para evitar ligação no arranque.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 41))));

// ASP.NET Identity (completo) sobre a tabela `users` (ApplicationUser : IdentityUser<long>).
builder.Services
    .AddIdentity<ApplicationUser, ApplicationRole>(options =>
    {
        options.User.RequireUniqueEmail = false; // email único por tenant (multi-tenant), não global
        options.SignIn.RequireConfirmedAccount = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Claims adicionais no cookie: tenant_id, user_type, is_superadmin.
builder.Services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AppUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/conta/entrar";
    options.LogoutPath = "/conta/sair";
    options.AccessDeniedPath = "/conta/sem-acesso";
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
});

// Por omissão, todas as páginas exigem autenticação (exceto [AllowAnonymous]).
builder.Services.AddControllersWithViews(options =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

var app = builder.Build();

// Comandos de linha (não correm no arranque normal do servidor).
if (args.Contains("seed"))
{
    using var scope = app.Services.CreateScope();
    await ProjectYard.Web.Data.DataSeeder.SeedAsync(scope.ServiceProvider);
    return;
}
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
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Define o tenant atual no DbContext a partir do utilizador autenticado (superadmin atravessa, com auditoria).
app.UseMiddleware<TenantMiddleware>();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
