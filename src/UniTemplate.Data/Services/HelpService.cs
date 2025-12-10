using Microsoft.EntityFrameworkCore;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Entities;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.Data.Services;

public class HelpService : IHelpService
{
    private readonly AppDbContext _context;

    public HelpService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<HelpSectionDto>> GetAllSectionsAsync()
    {
        return await _context.HelpSections
            .Include(s => s.Topics.OrderBy(t => t.Order))
            .OrderBy(s => s.Order)
            .Select(s => new HelpSectionDto
            {
                Id = s.Id,
                Title = s.Title,
                Description = s.Description,
                Icon = s.Icon,
                Order = s.Order,
                IsEnabled = s.IsEnabled,
                CreatedAt = s.CreatedAt,
                Topics = s.Topics.Select(t => new HelpTopicDto
                {
                    Id = t.Id,
                    Question = t.Question,
                    Answer = t.Answer,
                    Order = t.Order,
                    HelpSectionId = t.HelpSectionId,
                    CreatedAt = t.CreatedAt
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<List<HelpSectionDto>> GetEnabledSectionsAsync()
    {
        return await _context.HelpSections
            .Include(s => s.Topics.OrderBy(t => t.Order))
            .Where(s => s.IsEnabled)
            .OrderBy(s => s.Order)
            .Select(s => new HelpSectionDto
            {
                Id = s.Id,
                Title = s.Title,
                Description = s.Description,
                Icon = s.Icon,
                Order = s.Order,
                IsEnabled = s.IsEnabled,
                CreatedAt = s.CreatedAt,
                Topics = s.Topics.Select(t => new HelpTopicDto
                {
                    Id = t.Id,
                    Question = t.Question,
                    Answer = t.Answer,
                    Order = t.Order,
                    HelpSectionId = t.HelpSectionId,
                    CreatedAt = t.CreatedAt
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<HelpSectionDto?> GetSectionByIdAsync(Guid id)
    {
        var section = await _context.HelpSections
            .Include(s => s.Topics.OrderBy(t => t.Order))
            .FirstOrDefaultAsync(s => s.Id == id);

        if (section == null) return null;

        return new HelpSectionDto
        {
            Id = section.Id,
            Title = section.Title,
            Description = section.Description,
            Icon = section.Icon,
            Order = section.Order,
            IsEnabled = section.IsEnabled,
            CreatedAt = section.CreatedAt,
            Topics = section.Topics.Select(t => new HelpTopicDto
            {
                Id = t.Id,
                Question = t.Question,
                Answer = t.Answer,
                Order = t.Order,
                HelpSectionId = t.HelpSectionId,
                CreatedAt = t.CreatedAt
            }).ToList()
        };
    }

    public async Task<HelpSectionDto> CreateSectionAsync(CreateHelpSectionDto dto)
    {
        var section = new HelpSection
        {
            Title = dto.Title,
            Description = dto.Description,
            Icon = dto.Icon,
            Order = dto.Order,
            IsEnabled = dto.IsEnabled
        };

        _context.HelpSections.Add(section);
        await _context.SaveChangesAsync();

        return new HelpSectionDto
        {
            Id = section.Id,
            Title = section.Title,
            Description = section.Description,
            Icon = section.Icon,
            Order = section.Order,
            IsEnabled = section.IsEnabled,
            CreatedAt = section.CreatedAt,
            Topics = new List<HelpTopicDto>()
        };
    }

    public async Task<HelpSectionDto?> UpdateSectionAsync(Guid id, UpdateHelpSectionDto dto)
    {
        var section = await _context.HelpSections
            .Include(s => s.Topics.OrderBy(t => t.Order))
            .FirstOrDefaultAsync(s => s.Id == id);

        if (section == null) return null;

        section.Title = dto.Title;
        section.Description = dto.Description;
        section.Icon = dto.Icon;
        section.Order = dto.Order;
        section.IsEnabled = dto.IsEnabled;

        await _context.SaveChangesAsync();

        return new HelpSectionDto
        {
            Id = section.Id,
            Title = section.Title,
            Description = section.Description,
            Icon = section.Icon,
            Order = section.Order,
            IsEnabled = section.IsEnabled,
            CreatedAt = section.CreatedAt,
            Topics = section.Topics.Select(t => new HelpTopicDto
            {
                Id = t.Id,
                Question = t.Question,
                Answer = t.Answer,
                Order = t.Order,
                HelpSectionId = t.HelpSectionId,
                CreatedAt = t.CreatedAt
            }).ToList()
        };
    }

    public async Task<bool> DeleteSectionAsync(Guid id)
    {
        var section = await _context.HelpSections.FindAsync(id);
        if (section == null) return false;

        _context.HelpSections.Remove(section);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<HelpTopicDto?> GetTopicByIdAsync(Guid id)
    {
        var topic = await _context.HelpTopics.FindAsync(id);
        if (topic == null) return null;

        return new HelpTopicDto
        {
            Id = topic.Id,
            Question = topic.Question,
            Answer = topic.Answer,
            Order = topic.Order,
            HelpSectionId = topic.HelpSectionId,
            CreatedAt = topic.CreatedAt
        };
    }

    public async Task<HelpTopicDto> CreateTopicAsync(CreateHelpTopicDto dto)
    {
        var topic = new HelpTopic
        {
            Question = dto.Question,
            Answer = dto.Answer,
            Order = dto.Order,
            HelpSectionId = dto.HelpSectionId
        };

        _context.HelpTopics.Add(topic);
        await _context.SaveChangesAsync();

        return new HelpTopicDto
        {
            Id = topic.Id,
            Question = topic.Question,
            Answer = topic.Answer,
            Order = topic.Order,
            HelpSectionId = topic.HelpSectionId,
            CreatedAt = topic.CreatedAt
        };
    }

    public async Task<HelpTopicDto?> UpdateTopicAsync(Guid id, UpdateHelpTopicDto dto)
    {
        var topic = await _context.HelpTopics.FindAsync(id);
        if (topic == null) return null;

        topic.Question = dto.Question;
        topic.Answer = dto.Answer;
        topic.Order = dto.Order;

        await _context.SaveChangesAsync();

        return new HelpTopicDto
        {
            Id = topic.Id,
            Question = topic.Question,
            Answer = topic.Answer,
            Order = topic.Order,
            HelpSectionId = topic.HelpSectionId,
            CreatedAt = topic.CreatedAt
        };
    }

    public async Task<bool> DeleteTopicAsync(Guid id)
    {
        var topic = await _context.HelpTopics.FindAsync(id);
        if (topic == null) return false;

        _context.HelpTopics.Remove(topic);
        await _context.SaveChangesAsync();

        return true;
    }
}
