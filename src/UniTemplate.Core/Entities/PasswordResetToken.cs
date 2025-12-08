namespace UniTemplate.Core.Entities;

public class PasswordResetToken : BaseEntity
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiryTime { get; set; }
    public bool IsUsed { get; set; } = false;

    // Navigation properties
    public User User { get; set; } = null!;
}
