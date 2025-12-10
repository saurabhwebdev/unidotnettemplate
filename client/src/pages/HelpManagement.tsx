import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { colors } from '../config/theme.config';
import { helpService } from '../services/help.service';
import type { HelpSection, CreateHelpSectionRequest, CreateHelpTopicRequest } from '../services/help.service';
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function HelpManagement() {
  const [sections, setSections] = useState<HelpSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingSection, setEditingSection] = useState<HelpSection | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Add custom styles for Quill editor
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .quill-wrapper .ql-toolbar {
        background-color: ${colors.bgSecondary};
        border: 1px solid ${colors.border};
        border-bottom: none;
      }
      .quill-wrapper .ql-container {
        background-color: ${colors.bgSecondary};
        border: 1px solid ${colors.border};
        color: ${colors.textPrimary};
        font-size: 14px;
        min-height: 150px;
      }
      .quill-wrapper .ql-editor {
        color: ${colors.textPrimary};
        min-height: 150px;
      }
      .quill-wrapper .ql-editor.ql-blank::before {
        color: ${colors.textMuted};
      }
      .quill-wrapper .ql-stroke {
        stroke: ${colors.textSecondary};
      }
      .quill-wrapper .ql-fill {
        fill: ${colors.textSecondary};
      }
      .quill-wrapper .ql-picker-label {
        color: ${colors.textSecondary};
      }
      .quill-wrapper button:hover .ql-stroke,
      .quill-wrapper button.ql-active .ql-stroke {
        stroke: ${colors.primary};
      }
      .quill-wrapper button:hover .ql-fill,
      .quill-wrapper button.ql-active .ql-fill {
        fill: ${colors.primary};
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [sectionForm, setSectionForm] = useState<CreateHelpSectionRequest>({
    title: '',
    description: '',
    icon: 'file-text',
    order: 0,
    isEnabled: true
  });

  const [topicForm, setTopicForm] = useState<CreateHelpTopicRequest>({
    question: '',
    answer: '',
    order: 0,
    helpSectionId: ''
  });

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await helpService.getAllSections();
      setSections(data);
    } catch (error) {
      console.error('Failed to load help sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const openSectionModal = (section?: HelpSection) => {
    if (section) {
      setEditingSection(section);
      setSectionForm({
        title: section.title,
        description: section.description,
        icon: section.icon,
        order: section.order,
        isEnabled: section.isEnabled
      });
    } else {
      setEditingSection(null);
      setSectionForm({
        title: '',
        description: '',
        icon: 'file-text',
        order: sections.length,
        isEnabled: true
      });
    }
    setShowSectionModal(true);
  };

  const openTopicModal = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    setSelectedSectionId(sectionId);
    setTopicForm({
      question: '',
      answer: '',
      order: section?.topics.length || 0,
      helpSectionId: sectionId
    });
    setShowTopicModal(true);
  };

  const handleSaveSection = async () => {
    try {
      if (editingSection) {
        await helpService.updateSection(editingSection.id, sectionForm);
      } else {
        await helpService.createSection(sectionForm);
      }
      await loadSections();
      setShowSectionModal(false);
    } catch (error) {
      console.error('Failed to save section:', error);
    }
  };

  const handleSaveTopic = async () => {
    try {
      await helpService.createTopic(topicForm);
      await loadSections();
      setShowTopicModal(false);
    } catch (error) {
      console.error('Failed to save topic:', error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section? All topics in this section will also be deleted.')) return;
    try {
      await helpService.deleteSection(id);
      await loadSections();
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
      await helpService.deleteTopic(id);
      await loadSections();
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  const iconOptions = [
    'rocket', 'users', 'shield', 'settings', 'file-text',
    'code', 'alert-circle', 'lock'
  ];

  // Helper function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div
        className="pb-4 mb-6 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div>
          <h1 className="text-lg font-semibold mb-0.5" style={{ color: colors.textPrimary }}>
            Help Content Management
          </h1>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            Manage help sections and topics for your application
          </p>
        </div>
        <button
          onClick={() => openSectionModal()}
          className="px-4 py-2 text-sm font-medium flex items-center gap-2"
          style={{
            backgroundColor: colors.primary,
            color: 'white'
          }}
        >
          <Plus size={14} />
          Add Section
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Loading...
          </p>
        </div>
      )}

      {/* Sections List */}
      {!loading && (
        <div className="space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <div key={section.id} style={{ border: `1px solid ${colors.border}` }}>
                {/* Section Header */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    borderBottom: isExpanded ? `1px solid ${colors.border}` : 'none'
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        {section.title}
                      </h2>
                      <span
                        className="text-xs px-2 py-0.5"
                        style={{
                          backgroundColor: section.isEnabled ? colors.primary : colors.border,
                          color: section.isEnabled ? 'white' : colors.textMuted
                        }}
                      >
                        {section.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                      {section.description} • Order: {section.order} • Topics: {section.topics.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openTopicModal(section.id)}
                      className="p-1.5 transition-opacity"
                      style={{ color: colors.primary }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => openSectionModal(section)}
                      className="p-1.5 transition-opacity"
                      style={{ color: colors.textSecondary }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1.5 transition-opacity"
                      style={{ color: colors.textSecondary }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="p-1.5 transition-opacity"
                      style={{ color: colors.textSecondary }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Topics List */}
                {isExpanded && (
                  <div>
                    {section.topics.map((topic, index) => (
                      <div
                        key={topic.id}
                        className="px-4 py-3 flex items-start justify-between"
                        style={{
                          backgroundColor: index % 2 === 0 ? colors.bgPrimary : colors.bgSecondary,
                          borderBottom: index !== section.topics.length - 1 ? `1px solid ${colors.border}` : 'none'
                        }}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                            {topic.question}
                          </p>
                          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                            {stripHtml(topic.answer).substring(0, 100)}...
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="p-1.5 ml-2 transition-opacity"
                          style={{ color: colors.textSecondary }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {section.topics.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <p className="text-xs" style={{ color: colors.textMuted }}>
                          No topics yet. Click the + button to add topics to this section.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {sections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: colors.textMuted }}>
                No help sections yet. Click "Add Section" to create your first section.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md" style={{ backgroundColor: colors.bgPrimary }}>
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${colors.border}` }}
            >
              <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                {editingSection ? 'Edit Section' : 'Create Section'}
              </h2>
              <button onClick={() => setShowSectionModal(false)}>
                <X size={16} style={{ color: colors.textMuted }} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                  TITLE
                </label>
                <input
                  type="text"
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                  DESCRIPTION
                </label>
                <textarea
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm"
                  rows={3}
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                    ICON
                  </label>
                  <select
                    value={sectionForm.icon}
                    onChange={(e) => setSectionForm({ ...sectionForm, icon: e.target.value })}
                    className="w-full px-3 py-2 text-sm"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary
                    }}
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                    ORDER
                  </label>
                  <input
                    type="number"
                    value={sectionForm.order}
                    onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sectionForm.isEnabled}
                  onChange={(e) => setSectionForm({ ...sectionForm, isEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                  ENABLED
                </label>
              </div>
            </div>

            <div
              className="px-4 py-3 flex items-center justify-end gap-2"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <button
                onClick={() => setShowSectionModal(false)}
                className="px-4 py-2 text-xs font-medium"
                style={{
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                className="px-4 py-2 text-xs font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white'
                }}
              >
                {editingSection ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md" style={{ backgroundColor: colors.bgPrimary }}>
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${colors.border}` }}
            >
              <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Create Topic
              </h2>
              <button onClick={() => setShowTopicModal(false)}>
                <X size={16} style={{ color: colors.textMuted }} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                  QUESTION
                </label>
                <input
                  type="text"
                  value={topicForm.question}
                  onChange={(e) => setTopicForm({ ...topicForm, question: e.target.value })}
                  className="w-full px-3 py-2 text-sm"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                  ANSWER
                </label>
                <div className="quill-wrapper" style={{
                  '--quill-bg': colors.bgSecondary,
                  '--quill-border': colors.border,
                  '--quill-text': colors.textPrimary,
                } as React.CSSProperties}>
                  <ReactQuill
                    value={topicForm.answer}
                    onChange={(value) => setTopicForm({ ...topicForm, answer: value })}
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    formats={[
                      'bold', 'italic', 'underline', 'strike',
                      'list', 'bullet',
                      'link'
                    ]}
                    style={{
                      backgroundColor: colors.bgSecondary,
                      color: colors.textPrimary
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                  ORDER
                </label>
                <input
                  type="number"
                  value={topicForm.order}
                  onChange={(e) => setTopicForm({ ...topicForm, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary
                  }}
                />
              </div>
            </div>

            <div
              className="px-4 py-3 flex items-center justify-end gap-2"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <button
                onClick={() => setShowTopicModal(false)}
                className="px-4 py-2 text-xs font-medium"
                style={{
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTopic}
                className="px-4 py-2 text-xs font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white'
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
