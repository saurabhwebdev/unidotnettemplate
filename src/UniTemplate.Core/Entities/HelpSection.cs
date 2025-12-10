namespace UniTemplate.Core.Entities;

public class HelpSection : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsEnabled { get; set; } = true;

    // Navigation properties
    public ICollection<HelpTopic> Topics { get; set; } = new List<HelpTopic>();
}
