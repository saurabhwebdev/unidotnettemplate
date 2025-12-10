namespace UniTemplate.Core.Entities;

public class HelpTopic : BaseEntity
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int Order { get; set; }
    public Guid HelpSectionId { get; set; }

    // Navigation properties
    public HelpSection HelpSection { get; set; } = null!;
}
