// Help content organized by module/feature
// Each module can be easily edited or removed without affecting others

export interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  enabled: boolean;
  topics: HelpTopic[];
}

export interface HelpTopic {
  question: string;
  answer: string;
}

export const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using the application',
    icon: 'rocket',
    order: 1,
    enabled: true,
    topics: [
      {
        question: 'How do I log in?',
        answer: 'Use your email address and password provided by your administrator. If you forgot your password, contact your system administrator for assistance.'
      },
      {
        question: 'How do I update my profile?',
        answer: 'Navigate to your Profile page from the sidebar. You can update your personal information like First Name, Last Name, Phone Number, and Office Location. Employee information fields are managed by administrators.'
      },
      {
        question: 'How do I change my avatar?',
        answer: 'On your Profile page, hover over your avatar and click the edit icon. You can choose from different avatar styles and color palettes.'
      }
    ]
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Managing users and their access',
    icon: 'users',
    order: 2,
    enabled: true,
    topics: [
      {
        question: 'How do I create a new user?',
        answer: 'Navigate to Roles & Users page, switch to the Users tab, and click "Create User". Fill in the required information including email, password, name, and optionally assign roles and employee details.'
      },
      {
        question: 'How do I edit user information?',
        answer: 'In the Users tab of Roles & Users page, click the "Edit" button next to the user you want to modify. You can update their personal details, employee information, status, and assigned roles.'
      },
      {
        question: 'How do I assign roles to a user?',
        answer: 'Click the "Roles" button next to the user in the Users tab. Select the roles you want to assign by checking the boxes, then click "Save Changes".'
      },
      {
        question: 'How do I deactivate a user?',
        answer: 'Edit the user and uncheck the "Active User" checkbox. Inactive users cannot log in to the system.'
      }
    ]
  },
  {
    id: 'role-management',
    title: 'Role Management',
    description: 'Managing roles and permissions',
    icon: 'shield',
    order: 3,
    enabled: true,
    topics: [
      {
        question: 'What are roles?',
        answer: 'Roles define what actions users can perform in the system. Each role has a set of permissions that control access to different features and API endpoints.'
      },
      {
        question: 'How do I create a new role?',
        answer: 'Go to the Roles & Users page, Roles tab, and click "Create Role". Enter a name and description, then select the permissions by expanding feature groups and choosing specific endpoints.'
      },
      {
        question: 'What are system roles?',
        answer: 'System roles (like Admin) are built-in roles that cannot be deleted or have their permissions modified. They ensure core system functionality remains intact.'
      },
      {
        question: 'How do I assign permissions to a role?',
        answer: 'When creating or editing a role, expand the feature groups to see individual API endpoints. Use the checkboxes to select which endpoints this role can access. You can also use "Select All" to quickly grant all permissions for a feature.'
      }
    ]
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configuring your preferences',
    icon: 'settings',
    order: 4,
    enabled: true,
    topics: [
      {
        question: 'What are email notifications?',
        answer: 'Email notifications alert you about important events like logins, password changes, and profile updates. You can enable or disable each type of notification individually.'
      },
      {
        question: 'How do I test email configuration?',
        answer: 'In the Settings page under "Test Email Service", enter an email address and click "Send". This will send a test email to verify your email configuration is working correctly.'
      },
      {
        question: 'What email providers are supported?',
        answer: 'The system supports SMTP-based email providers and Microsoft Graph (Office 365/Outlook). The current configuration is displayed in the Settings page.'
      }
    ]
  },
  {
    id: 'audit-logs',
    title: 'Audit Logs',
    description: 'Tracking system activities',
    icon: 'file-text',
    order: 5,
    enabled: true,
    topics: [
      {
        question: 'What are audit logs?',
        answer: 'Audit logs record all important activities in the system, including user actions, data changes, login attempts, and administrative operations. They help track who did what and when.'
      },
      {
        question: 'How do I search audit logs?',
        answer: 'Use the search box to find logs by keyword. You can also filter by action type, entity type, and success status using the dropdown filters.'
      },
      {
        question: 'What information is captured in audit logs?',
        answer: 'Each log entry includes: timestamp, user information, action performed, entity affected, success/failure status, IP address, user agent, and before/after values for data changes.'
      },
      {
        question: 'How do I view detailed log information?',
        answer: 'Click the "View" button next to any log entry to see complete details including old values, new values, error messages (if any), and additional context.'
      }
    ]
  },
  {
    id: 'api-routes',
    title: 'API Routes',
    description: 'Understanding system endpoints',
    icon: 'code',
    order: 6,
    enabled: true,
    topics: [
      {
        question: 'What are API routes?',
        answer: 'API routes are the endpoints that the frontend uses to communicate with the backend. They represent all available operations in the system.'
      },
      {
        question: 'Why would I need to see API routes?',
        answer: 'The API routes page helps administrators understand what operations are available when configuring role permissions. Each route corresponds to a permission that can be assigned to roles.'
      },
      {
        question: 'What do the HTTP methods mean?',
        answer: 'GET retrieves data, POST creates new data, PUT updates existing data, DELETE removes data, and PATCH partially updates data.'
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: 'alert-circle',
    order: 7,
    enabled: true,
    topics: [
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Contact your system administrator to reset your password. They can update it from the User Management page.'
      },
      {
        question: 'I cannot access certain features. Why?',
        answer: 'Your access is determined by the roles assigned to your account. Contact your administrator if you need access to additional features.'
      },
      {
        question: 'Why am I not receiving email notifications?',
        answer: 'Check your email notification preferences in Settings. If they are enabled but you still do not receive emails, contact your administrator to verify the email configuration.'
      },
      {
        question: 'The page is not loading. What should I do?',
        answer: 'Try refreshing the page. If the issue persists, clear your browser cache and cookies, or try using a different browser. Contact your administrator if problems continue.'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security Best Practices',
    description: 'Keeping your account secure',
    icon: 'lock',
    order: 8,
    enabled: true,
    topics: [
      {
        question: 'How do I keep my account secure?',
        answer: 'Use a strong password with a mix of letters, numbers, and symbols. Never share your password with anyone. Log out when using shared computers. Report any suspicious activity to your administrator immediately.'
      },
      {
        question: 'What should I do if I suspect unauthorized access?',
        answer: 'Contact your administrator immediately. Change your password as soon as possible. Review your recent activity in the audit logs to identify any suspicious actions.'
      },
      {
        question: 'How often should I change my password?',
        answer: 'Follow your organization\'s password policy. Generally, changing passwords every 90 days is recommended. Always change it immediately if you suspect it has been compromised.'
      }
    ]
  }
];

// Function to get enabled sections sorted by order
export const getEnabledHelpSections = (): HelpSection[] => {
  return helpSections
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order);
};

// Function to get a specific section by id
export const getHelpSection = (id: string): HelpSection | undefined => {
  return helpSections.find(section => section.id === id);
};
