using UniTemplate.Core.DTOs;

namespace UniTemplate.Core.Interfaces;

public interface IHelpService
{
    Task<List<HelpSectionDto>> GetAllSectionsAsync();
    Task<List<HelpSectionDto>> GetEnabledSectionsAsync();
    Task<HelpSectionDto?> GetSectionByIdAsync(Guid id);
    Task<HelpSectionDto> CreateSectionAsync(CreateHelpSectionDto dto);
    Task<HelpSectionDto?> UpdateSectionAsync(Guid id, UpdateHelpSectionDto dto);
    Task<bool> DeleteSectionAsync(Guid id);

    Task<HelpTopicDto?> GetTopicByIdAsync(Guid id);
    Task<HelpTopicDto> CreateTopicAsync(CreateHelpTopicDto dto);
    Task<HelpTopicDto?> UpdateTopicAsync(Guid id, UpdateHelpTopicDto dto);
    Task<bool> DeleteTopicAsync(Guid id);
}
