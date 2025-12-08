using UniTemplate.Core.Entities;
using UniTemplate.Core.Enums;

namespace UniTemplate.Core.Models;

public class UserEmailPreference
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public EmailAlertType AlertType { get; set; }
    public bool IsEnabled { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
