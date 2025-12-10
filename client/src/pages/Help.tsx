import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { colors } from '../config/theme.config';
import { helpService } from '../services/help.service';
import type { HelpSection } from '../services/help.service';
import {
  Rocket,
  Users,
  Shield,
  Settings,
  FileText,
  Code,
  AlertCircle,
  Lock,
  ChevronDown,
  Search
} from 'lucide-react';

const iconMap: Record<string, any> = {
  rocket: Rocket,
  users: Users,
  shield: Shield,
  settings: Settings,
  'file-text': FileText,
  code: Code,
  'alert-circle': AlertCircle,
  lock: Lock,
};

export default function Help() {
  const [sections, setSections] = useState<HelpSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSections();
  }, []);

  // Add custom styles for rendered HTML content
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .help-answer-content p {
        margin-bottom: 0.5rem;
      }
      .help-answer-content p:last-child {
        margin-bottom: 0;
      }
      .help-answer-content strong {
        font-weight: 600;
        color: ${colors.textPrimary};
      }
      .help-answer-content em {
        font-style: italic;
      }
      .help-answer-content u {
        text-decoration: underline;
      }
      .help-answer-content a {
        color: ${colors.primary};
        text-decoration: underline;
      }
      .help-answer-content a:hover {
        opacity: 0.8;
      }
      .help-answer-content ul,
      .help-answer-content ol {
        margin-left: 1.5rem;
        margin-bottom: 0.5rem;
      }
      .help-answer-content ul {
        list-style-type: disc;
      }
      .help-answer-content ol {
        list-style-type: decimal;
      }
      .help-answer-content li {
        margin-bottom: 0.25rem;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await helpService.getEnabledSections();
      setSections(data);
    } catch (error) {
      console.error('Failed to load help sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (sectionId: string, topicIndex: number) => {
    const key = `${sectionId}-${topicIndex}`;
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedTopics(newExpanded);
  };

  const expandAll = () => {
    const allKeys = new Set<string>();
    sections.forEach(section => {
      section.topics.forEach((_, index) => {
        allKeys.add(`${section.id}-${index}`);
      });
    });
    setExpandedTopics(allKeys);
  };

  const collapseAll = () => {
    setExpandedTopics(new Set());
  };

  // Filter sections and topics based on search query
  const filteredSections = sections.map(section => ({
    ...section,
    topics: section.topics.filter(topic =>
      searchQuery === '' ||
      topic.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.topics.length > 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div
        className="pb-4 mb-6 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div>
          <h1 className="text-lg font-semibold mb-0.5" style={{ color: colors.textPrimary }}>
            Help & Documentation
          </h1>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            Find answers to common questions and learn how to use the application
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary
            }}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary
            }}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: colors.textMuted }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help topics..."
            className="w-full pl-10 pr-4 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = colors.primary}
            onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Loading help content...
          </p>
        </div>
      )}

      {/* Help Sections */}
      {!loading && (
        <div className="space-y-6">
          {filteredSections.map((section) => {
          const Icon = iconMap[section.icon] || FileText;

          return (
            <div key={section.id} style={{ border: `1px solid ${colors.border}` }}>
              {/* Section Header */}
              <div
                className="px-4 py-3"
                style={{
                  backgroundColor: colors.bgSecondary,
                  borderBottom: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color: colors.primary }} />
                  <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {section.title}
                  </h2>
                </div>
                <p className="text-xs mt-1 ml-6" style={{ color: colors.textMuted }}>
                  {section.description}
                </p>
              </div>

              {/* Topics */}
              <div>
                {section.topics.map((topic, index) => {
                  const isExpanded = expandedTopics.has(`${section.id}-${index}`);

                  return (
                    <div
                      key={index}
                      style={{
                        borderBottom: index !== section.topics.length - 1 ? `1px solid ${colors.border}` : 'none'
                      }}
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleTopic(section.id, index)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left transition-colors"
                        style={{
                          backgroundColor: isExpanded ? colors.bgSecondary : colors.bgPrimary
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = colors.bgSecondary;
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = colors.bgPrimary;
                        }}
                      >
                        <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                          {topic.question}
                        </span>
                        <ChevronDown
                          size={16}
                          style={{
                            color: colors.textMuted,
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 200ms'
                          }}
                        />
                      </button>

                      {/* Answer */}
                      {isExpanded && (
                        <div
                          className="px-4 py-3 ml-6 help-answer-content"
                          style={{
                            backgroundColor: colors.bgPrimary,
                            borderTop: `1px solid ${colors.border}`
                          }}
                        >
                          <div
                            className="text-sm leading-relaxed"
                            style={{ color: colors.textSecondary }}
                            dangerouslySetInnerHTML={{ __html: topic.answer }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: colors.textMuted }}>
                No help topics found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className="mt-8 p-4 text-center"
        style={{
          backgroundColor: colors.bgSecondary,
          border: `1px solid ${colors.border}`
        }}
      >
        <p className="text-xs" style={{ color: colors.textMuted }}>
          Still need help? Contact your system administrator for assistance.
        </p>
      </div>
    </DashboardLayout>
  );
}
