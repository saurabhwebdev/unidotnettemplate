namespace UniTemplate.Core.DTOs;

public class HelpSectionDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsEnabled { get; set; }
    public List<HelpTopicDto> Topics { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class HelpTopicDto
{
    public Guid Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int Order { get; set; }
    public Guid HelpSectionId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateHelpSectionDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsEnabled { get; set; } = true;
}

public class UpdateHelpSectionDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsEnabled { get; set; }
}

public class CreateHelpTopicDto
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int Order { get; set; }
    public Guid HelpSectionId { get; set; }
}

public class UpdateHelpTopicDto
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int Order { get; set; }
}
