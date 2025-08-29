using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using sprintHub.Models;
using Microsoft.Extensions.Caching.Memory;

namespace sprintHub.Services
{
    public class JwtTokenService
    {
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache;

        public JwtTokenService(IConfiguration config, IMemoryCache cache)
        {
            _config = config;
            _cache = cache;
        }

        public string GenerateToken(User user, bool rememberMe)
        {
            string secretKey = _config["JwtSettings:Secret"];
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentException("JWT Secret Key is missing or empty in configuration.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            if (key.KeySize < 128)
            {
                throw new ArgumentException("JWT Secret Key must be at least 128 bits (16 characters).");
            }

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiration = rememberMe
                ? DateTime.UtcNow.AddDays(7)
                : DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["JwtSettings:ExpirationInMinutes"]));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Add unique token ID
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: expiration,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public void InvalidateToken(string token)
        {
            var jti = new JwtSecurityTokenHandler().ReadJwtToken(token).Id;
            Console.WriteLine($"Invalidating token: {jti}"); // Debug log
            _cache.Set(jti, "invalidated", new MemoryCacheEntryOptions
            {
                AbsoluteExpiration = DateTimeOffset.Now.AddHours(1) // Adjust as needed
            });
        }

        public bool IsTokenInvalid(string token)
        {
            if (string.IsNullOrEmpty(token))
                return true;

            try
            {
                var handler = new JwtSecurityTokenHandler();
                if (!handler.CanReadToken(token))
                    return true;

                var jwtToken = handler.ReadJwtToken(token);
                var jti = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;

                return !string.IsNullOrEmpty(jti) && _cache.TryGetValue(jti, out _);
            }
            catch
            {
                return true;
            }
        }
    }
}