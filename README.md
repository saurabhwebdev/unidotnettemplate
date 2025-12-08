<div align="center">

<img src="https://raw.githubusercontent.com/saurabhwebdev/unidotnettemplate/master/client/public/favicon.svg" alt="UniDotNet Logo" width="80" height="80" />

# UniDotNet Template

### Enterprise-Grade Full-Stack SaaS Boilerplate

<br />

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br />

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github)](https://github.com/saurabhwebdev/unidotnettemplate)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained-yes-green.svg?style=flat-square)](https://github.com/saurabhwebdev/unidotnettemplate/graphs/commit-activity)
[![GitHub Stars](https://img.shields.io/github/stars/saurabhwebdev/unidotnettemplate?style=flat-square&logo=github)](https://github.com/saurabhwebdev/unidotnettemplate/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/saurabhwebdev/unidotnettemplate?style=flat-square&logo=github)](https://github.com/saurabhwebdev/unidotnettemplate/network/members)

<br />

<p align="center">
  <strong>Ship faster. Scale smarter. Build with confidence.</strong>
</p>

<p align="center">
  A production-ready, enterprise-grade SaaS boilerplate combining the robustness of .NET 8 with the<br />
  flexibility of React + TypeScript. Skip weeks of setup and focus on what matters — your product.
</p>

<br />

[**Explore the Docs »**](#-documentation)

[Quick Start](#-quick-start) · [Features](#-features) · [Architecture](#-architecture) · [API Reference](#-api-reference) · [Report Bug](https://github.com/saurabhwebdev/unidotnettemplate/issues) · [Request Feature](https://github.com/saurabhwebdev/unidotnettemplate/issues)

<br />

---

</div>

<br />

## 📋 Table of Contents

<details open>
<summary>Click to expand</summary>

- [Overview](#-overview)
- [Why UniDotNet?](#-why-unidotnet)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#%EF%B8%8F-configuration)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Frontend Guide](#-frontend-guide)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

</details>

<br />

---

<br />

## 🎯 Overview

**UniDotNet Template** is a comprehensive, production-ready SaaS starter kit designed for developers and teams who want to build scalable web applications without spending weeks on boilerplate setup. Built with modern best practices and enterprise patterns, it provides everything you need to launch your next big idea.

<br />

<div align="center">

### Key Metrics

| Metric | Value |
|:------:|:-----:|
| **Setup Time** | < 5 minutes |
| **Lines of Code** | 13,800+ |
| **Components** | 30+ |
| **API Endpoints** | 20+ |
| **Test Coverage** | Extensible |

</div>

<br />

### What's Included

```
✅ Complete authentication system (JWT + Microsoft SSO)
✅ Role-based access control (RBAC) with permissions
✅ User management dashboard with CRUD operations
✅ Email service integration (SMTP + Microsoft Graph)
✅ Password reset flow with secure tokens
✅ Comprehensive audit logging system
✅ Customizable user avatars (6 styles, 6 color palettes)
✅ Modern React UI with Tailwind CSS
✅ Responsive design for all devices
✅ Dark theme with customizable colors
✅ Entity Framework Core with migrations
✅ Clean Architecture pattern
✅ API documentation ready
✅ Production deployment ready
```

<br />

---

<br />

## 💡 Why UniDotNet?

<br />

<table>
<tr>
<td align="center" width="25%">

### 🚀
### **Launch Faster**
Skip weeks of boilerplate setup. Get a fully functional SaaS app running in minutes, not months.

</td>
<td align="center" width="25%">

### 🏗️
### **Enterprise Ready**
Built with Clean Architecture, SOLID principles, and industry best practices used by Fortune 500 companies.

</td>
<td align="center" width="25%">

### 🔐
### **Secure by Default**
JWT authentication, password hashing, CORS protection, and Microsoft SSO out of the box.

</td>
<td align="center" width="25%">

### 📈
### **Scales With You**
From MVP to millions of users. The architecture supports horizontal scaling and microservices evolution.

</td>
</tr>
</table>

<br />

### Comparison with Other Solutions

| Feature | UniDotNet | DIY Setup | Other Templates |
|---------|:---------:|:---------:|:---------------:|
| Setup Time | **5 min** | 2-4 weeks | 1-2 days |
| JWT Auth | ✅ | Manual | ✅ |
| Microsoft SSO | ✅ | Manual | ❌ |
| RBAC System | ✅ | Manual | Partial |
| Email Service | ✅ | Manual | ❌ |
| Password Reset | ✅ | Manual | Partial |
| Modern React UI | ✅ | Manual | Varies |
| Dark Theme | ✅ | Manual | ❌ |
| TypeScript | ✅ | Optional | Varies |
| Clean Architecture | ✅ | Depends | ❌ |
| Production Ready | ✅ | Months | Partial |
| Documentation | ✅ | Self-made | Minimal |

<br />

---

<br />

## ✨ Features

<br />

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Authentication & Authorization

| Feature | Status |
|---------|:------:|
| JWT Token Authentication | ✅ |
| Refresh Token Rotation | ✅ |
| Microsoft SSO (Azure AD) | ✅ |
| Google OAuth | 🔜 |
| Password Hashing (BCrypt) | ✅ |
| Password Reset via Email | ✅ |
| Email Verification | 🔜 |
| Two-Factor Auth (2FA) | 🔜 |
| Session Management | ✅ |
| Remember Me | ✅ |
| Protected Routes | ✅ |
| Route Guards | ✅ |

</td>
<td width="50%" valign="top">

### 👥 User Management

| Feature | Status |
|---------|:------:|
| User Registration | ✅ |
| User Login/Logout | ✅ |
| Profile Management | ✅ |
| Avatar Customization | ✅ |
| User CRUD Operations | ✅ |
| User Search & Filter | ✅ |
| Pagination | ✅ |
| Enterprise Fields | ✅ |
| Employee ID & Designation | ✅ |
| Department & Office Location | ✅ |
| Manager Hierarchy (Reports To) | ✅ |
| Date of Joining | ✅ |
| Send User Details Email | ✅ |
| User Activity Log | ✅ |
| Account Deactivation | ✅ |
| Bulk Operations | 🔜 |
| Data Export (GDPR) | 🔜 |
| User Impersonation | 🔜 |

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎭 Role-Based Access Control

| Feature | Status |
|---------|:------:|
| Role Management | ✅ |
| Permission System | ✅ |
| Role Assignment | ✅ |
| Multiple Roles per User | ✅ |
| Default Roles | ✅ |
| Role Hierarchy | 🔜 |
| Dynamic Permissions | ✅ |
| Route-based Access | ✅ |
| API-level Authorization | ✅ |
| Admin Dashboard | ✅ |
| Audit Logging | ✅ |
| Permission Groups | 🔜 |

</td>
<td width="50%" valign="top">

### 📧 Email Services

| Feature | Status |
|---------|:------:|
| SMTP Integration | ✅ |
| Microsoft Graph API | ✅ |
| SendGrid Support | 🔜 |
| Email Templates | ✅ |
| HTML Emails | ✅ |
| Email Queue | 🔜 |
| Delivery Tracking | 🔜 |
| Bounce Handling | 🔜 |
| Notification Preferences | ✅ |
| Unsubscribe Management | ✅ |
| Email Analytics | 🔜 |
| Attachment Support | 🔜 |

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎨 User Interface

| Feature | Status |
|---------|:------:|
| Modern React 18 | ✅ |
| TypeScript Support | ✅ |
| Tailwind CSS | ✅ |
| shadcn/ui Components | ✅ |
| Dark Theme | ✅ |
| Light Theme | 🔜 |
| Responsive Design | ✅ |
| Mobile Optimized | ✅ |
| Animated Transitions | ✅ |
| Loading States | ✅ |
| Error Boundaries | ✅ |
| Toast Notifications | ✅ |

</td>
<td width="50%" valign="top">

### 🛠️ Developer Experience

| Feature | Status |
|---------|:------:|
| Hot Module Replacement | ✅ |
| TypeScript Strict Mode | ✅ |
| ESLint Configuration | ✅ |
| Prettier Support | ✅ |
| Path Aliases | ✅ |
| Environment Variables | ✅ |
| API Client Generation | 🔜 |
| Storybook | 🔜 |
| Unit Testing Setup | 🔜 |
| E2E Testing Setup | 🔜 |
| CI/CD Templates | 🔜 |
| Docker Support | 🔜 |

</td>
</tr>
</table>

<br />

> **Legend:** ✅ Available | 🔜 Coming Soon | ❌ Not Planned

<br />

---

<br />

## 🛠️ Tech Stack

<br />

### Backend Technologies

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg" width="48" height="48" alt=".NET" />
<br /><strong>.NET 8</strong>
<br /><sub>Web API Framework</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" width="48" height="48" alt="C#" />
<br /><strong>C# 12</strong>
<br /><sub>Programming Language</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" width="48" height="48" alt="SQL Server" />
<br /><strong>SQL Server</strong>
<br /><sub>Database</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" width="48" height="48" alt="EF Core" />
<br /><strong>EF Core 8</strong>
<br /><sub>ORM</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" width="48" height="48" alt="Azure" />
<br /><strong>Azure AD</strong>
<br /><sub>Identity Provider</sub>
</td>
</tr>
</table>

<br />

### Frontend Technologies

<table>
<tr>
<td align="center" width="16.6%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
<br /><strong>React 18</strong>
<br /><sub>UI Library</sub>
</td>
<td align="center" width="16.6%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
<br /><strong>TypeScript 5</strong>
<br /><sub>Type Safety</sub>
</td>
<td align="center" width="16.6%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="48" height="48" alt="Vite" />
<br /><strong>Vite 6</strong>
<br /><sub>Build Tool</sub>
</td>
<td align="center" width="16.6%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind" />
<br /><strong>Tailwind 3</strong>
<br /><sub>CSS Framework</sub>
</td>
<td align="center" width="16.6%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React Router" />
<br /><strong>React Router 7</strong>
<br /><sub>Routing</sub>
</td>
<td align="center" width="16.6%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain.svg" width="48" height="48" alt="Axios" />
<br /><strong>Axios</strong>
<br /><sub>HTTP Client</sub>
</td>
</tr>
</table>

<br />

### Development & DevOps

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="48" height="48" alt="Git" />
<br /><strong>Git</strong>
<br /><sub>Version Control</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="48" height="48" alt="GitHub" />
<br /><strong>GitHub</strong>
<br /><sub>Repository</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" width="48" height="48" alt="VS Code" />
<br /><strong>VS Code</strong>
<br /><sub>IDE</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="48" height="48" alt="ESLint" />
<br /><strong>ESLint</strong>
<br /><sub>Linting</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="48" height="48" alt="npm" />
<br /><strong>npm</strong>
<br /><sub>Package Manager</sub>
</td>
</tr>
</table>

<br />

---

<br />

## 🏗️ Architecture

<br />

### System Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT TIER                                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │                         REACT APPLICATION                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │    Pages     │  │  Components  │  │   Services   │  │    Hooks     │   │  │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤   │  │
│  │  │ • Login      │  │ • Button     │  │ • AuthSvc    │  │ • useAuth    │   │  │
│  │  │ • Register   │  │ • Input      │  │ • ApiClient  │  │ • useApi     │   │  │
│  │  │ • Dashboard  │  │ • Card       │  │ • UserSvc    │  │ • useTheme   │   │  │
│  │  │ • Profile    │  │ • Table      │  │ • RoleSvc    │  │ • useToast   │   │  │
│  │  │ • Settings   │  │ • Modal      │  │ • EmailSvc   │  │ • useForm    │   │  │
│  │  │ • Users      │  │ • Layout     │  │ • RouteSvc   │  │              │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         │ HTTPS / REST API
                                         │ JWT Bearer Token
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                   API TIER                                        │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │                         .NET 8 WEB API                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                        CONTROLLERS                                    │  │  │
│  │  │   AuthController • UsersController • RolesController • RoutesController│  │
│  │  │   EmailPreferencesController • EmailTestController                    │  │  │
│  │  └──────────────────────────────────────────────────────────────────────┘  │  │
│  │                                    │                                        │  │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                         MIDDLEWARE                                    │  │  │
│  │  │   Authentication • Authorization • CORS • Exception Handling • Logging│  │  │
│  │  └──────────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               BUSINESS LOGIC TIER                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │   CORE (Domain)     │  │  DATA (Infrastructure)│  │      INTERFACES        │  │
│  │  ┌───────────────┐  │  │  ┌───────────────┐  │  │  ┌───────────────────┐  │  │
│  │  │   Entities    │  │  │  │   Services    │  │  │  │   IAuthService    │  │  │
│  │  │  ───────────  │  │  │  │  ───────────  │  │  │  │   IUserService    │  │  │
│  │  │  • User       │  │  │  │  • AuthSvc    │  │  │  │   IRoleService    │  │  │
│  │  │  • Role       │  │  │  │  • UserSvc    │  │  │  │   IEmailService   │  │  │
│  │  │  • UserRole   │  │  │  │  • RoleSvc    │  │  │  │   ITokenService   │  │  │
│  │  │  • Token      │  │  │  │  • TokenSvc   │  │  │  └───────────────────┘  │  │
│  │  └───────────────┘  │  │  │  • EmailSvc   │  │  │                         │  │
│  │  ┌───────────────┐  │  │  └───────────────┘  │  │  ┌───────────────────┐  │  │
│  │  │     DTOs      │  │  │  ┌───────────────┐  │  │  │   Configuration   │  │  │
│  │  │  ───────────  │  │  │  │  DbContext    │  │  │  │  ───────────────  │  │  │
│  │  │  • AuthDTOs   │  │  │  │  ───────────  │  │  │  │  • JwtSettings    │  │  │
│  │  │  • UserDTOs   │  │  │  │  AppDbContext │  │  │  │  • CorsSettings   │  │  │
│  │  │  • RoleDTOs   │  │  │  └───────────────┘  │  │  │  • EmailSettings  │  │  │
│  │  └───────────────┘  │  │  ┌───────────────┐  │  │  │  • MsAuthSettings │  │  │
│  │  ┌───────────────┐  │  │  │  Migrations   │  │  │  └───────────────────┘  │  │
│  │  │    Enums      │  │  │  └───────────────┘  │  │                         │  │
│  │  └───────────────┘  │  │                     │  │                         │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         │ Entity Framework Core
                                         │ Connection Pool
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                  DATA TIER                                        │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │                           SQL SERVER DATABASE                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │    Users     │  │    Roles     │  │  UserRoles   │  │ ResetTokens  │   │  │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤   │  │
│  │  │ Id           │  │ Id           │  │ UserId (FK)  │  │ Id           │   │  │
│  │  │ Email        │  │ Name         │  │ RoleId (FK)  │  │ UserId (FK)  │   │  │
│  │  │ PasswordHash │  │ Description  │  │ AssignedAt   │  │ Token        │   │  │
│  │  │ FirstName    │  │ Permissions  │  └──────────────┘  │ ExpiresAt    │   │  │
│  │  │ LastName     │  │ CreatedAt    │                    │ IsUsed       │   │  │
│  │  │ RefreshToken │  │ UpdatedAt    │                    └──────────────┘   │  │
│  │  │ CreatedAt    │  └──────────────┘                                       │  │
│  │  │ UpdatedAt    │                                                          │  │
│  │  └──────────────┘                                                          │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

<br />

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │    ┌─────────────────────────────────────────┐     │     │
│    │    │                                         │     │     │
│    │    │    ┌─────────────────────────────┐     │     │     │
│    │    │    │         ENTITIES            │     │     │     │
│    │    │    │     (Domain Models)         │     │     │     │
│    │    │    └─────────────────────────────┘     │     │     │
│    │    │              CORE LAYER                │     │     │
│    │    │     (Interfaces, DTOs, Enums)          │     │     │
│    │    └─────────────────────────────────────────┘     │     │
│    │                   DATA LAYER                       │     │
│    │    (Services, DbContext, Repositories)             │     │
│    └─────────────────────────────────────────────────────┘     │
│                        API LAYER                               │
│         (Controllers, Middleware, Configuration)               │
└─────────────────────────────────────────────────────────────────┘
```

<br />

### Request Flow Diagram

```
┌────────┐     ┌─────────────┐     ┌────────────┐     ┌──────────┐     ┌────────────┐
│ Client │────▶│  API Layer  │────▶│ Middleware │────▶│ Controller│────▶│  Service   │
└────────┘     └─────────────┘     └────────────┘     └──────────┘     └────────────┘
                                         │                                    │
                                         │                                    │
                                   ┌─────▼─────┐                       ┌──────▼─────┐
                                   │   Auth    │                       │  DbContext │
                                   │ Validate  │                       │   Query    │
                                   └───────────┘                       └────────────┘
                                                                              │
                                                                       ┌──────▼─────┐
                                                                       │    SQL     │
                                                                       │   Server   │
                                                                       └────────────┘
```

<br />

---

<br />

## 📁 Project Structure

<br />

```
unidotnettemplate/
│
├── 📂 .claude/                          # Claude AI configuration
│   └── settings.local.json              # Local AI settings
│
├── 📂 src/                              # Backend source code
│   │
│   ├── 📂 UniTemplate.API/              # 🌐 Presentation Layer
│   │   ├── 📂 Controllers/              # API endpoints
│   │   │   ├── AuthController.cs        # Authentication endpoints
│   │   │   ├── UsersController.cs       # User management
│   │   │   ├── RolesController.cs       # Role management
│   │   │   ├── RoutesController.cs      # Route permissions
│   │   │   ├── EmailPreferencesController.cs
│   │   │   └── EmailTestController.cs   # Email testing
│   │   │
│   │   ├── Program.cs                   # Application entry point
│   │   ├── appsettings.json             # Production settings
│   │   ├── appsettings.Development.json # Development settings
│   │   └── UniTemplate.API.csproj       # Project file
│   │
│   ├── 📂 UniTemplate.Core/             # 💎 Domain Layer
│   │   ├── 📂 Entities/                 # Domain models
│   │   │   ├── BaseEntity.cs            # Base entity class
│   │   │   ├── User.cs                  # User entity
│   │   │   ├── Role.cs                  # Role entity
│   │   │   ├── UserRole.cs              # User-Role mapping
│   │   │   └── PasswordResetToken.cs    # Password reset tokens
│   │   │
│   │   ├── 📂 DTOs/                     # Data Transfer Objects
│   │   │   ├── 📂 Auth/                 # Authentication DTOs
│   │   │   │   ├── LoginRequestDto.cs
│   │   │   │   ├── RegisterRequestDto.cs
│   │   │   │   ├── AuthResponseDto.cs
│   │   │   │   ├── RefreshTokenRequestDto.cs
│   │   │   │   ├── ForgotPasswordRequestDto.cs
│   │   │   │   ├── ResetPasswordRequestDto.cs
│   │   │   │   ├── MicrosoftLoginRequestDto.cs
│   │   │   │   └── UserDto.cs
│   │   │   │
│   │   │   ├── UserDto.cs               # User DTOs
│   │   │   └── RoleDto.cs               # Role DTOs
│   │   │
│   │   ├── 📂 Interfaces/               # Service contracts
│   │   │   ├── IAuthService.cs
│   │   │   ├── IUserService.cs
│   │   │   ├── IRoleService.cs
│   │   │   ├── ITokenService.cs
│   │   │   └── IEmailService.cs
│   │   │
│   │   ├── 📂 Configuration/            # Configuration classes
│   │   │   ├── JwtSettings.cs
│   │   │   ├── CorsSettings.cs
│   │   │   ├── EmailSettings.cs
│   │   │   └── MicrosoftAuthSettings.cs
│   │   │
│   │   ├── 📂 Enums/                    # Enumerations
│   │   │   └── EmailAlertType.cs
│   │   │
│   │   ├── 📂 Models/                   # Additional models
│   │   │   ├── EmailMessage.cs
│   │   │   └── UserEmailPreference.cs
│   │   │
│   │   └── UniTemplate.Core.csproj
│   │
│   └── 📂 UniTemplate.Data/             # 💾 Infrastructure Layer
│       ├── 📂 Services/                 # Service implementations
│       │   ├── AuthService.cs           # Authentication logic
│       │   ├── UserService.cs           # User management logic
│       │   ├── RoleService.cs           # Role management logic
│       │   ├── TokenService.cs          # JWT token generation
│       │   ├── SmtpEmailService.cs      # SMTP email sender
│       │   └── MicrosoftGraphEmailService.cs
│       │
│       ├── 📂 Migrations/               # EF Core migrations
│       │   ├── 20251207025910_InitialCreate.cs
│       │   ├── 20251207040524_AddRBACSystem.cs
│       │   ├── 20251207064038_AddUserEmailPreferences.cs
│       │   ├── 20251207104854_AddPasswordResetToken.cs
│       │   └── AppDbContextModelSnapshot.cs
│       │
│       ├── AppDbContext.cs              # Database context
│       └── UniTemplate.Data.csproj
│
├── 📂 client/                           # ⚛️ Frontend source code
│   │
│   ├── 📂 public/                       # Static assets
│   │   ├── auth-bg.jpg                  # Auth background images
│   │   ├── auth-bg-1.jpg
│   │   ├── auth-bg-2.jpg
│   │   ├── auth-bg-3.jpg
│   │   ├── auth-bg-4.jpg
│   │   ├── favicon.svg                  # App favicon
│   │   └── manifest.json                # PWA manifest
│   │
│   ├── 📂 src/
│   │   ├── 📂 components/               # React components
│   │   │   ├── 📂 ui/                   # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── modal.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── skeleton.tsx
│   │   │   │
│   │   │   ├── DashboardLayout.tsx      # Main layout component
│   │   │   ├── ImageSlideshow.tsx       # Auth page slideshow
│   │   │   └── MicrosoftLoginButton.tsx # Microsoft SSO button
│   │   │
│   │   ├── 📂 pages/                    # Page components
│   │   │   ├── Login.tsx                # Login page
│   │   │   ├── Register.tsx             # Registration page
│   │   │   ├── Dashboard.tsx            # Dashboard page
│   │   │   ├── Profile.tsx              # User profile
│   │   │   ├── Settings.tsx             # App settings
│   │   │   ├── Users.tsx                # User management
│   │   │   ├── RolesAndUsers.tsx        # Roles & permissions
│   │   │   ├── ForgotPassword.tsx       # Password recovery
│   │   │   └── ResetPassword.tsx        # Password reset
│   │   │
│   │   ├── 📂 services/                 # API services
│   │   │   ├── api.ts                   # Axios instance
│   │   │   ├── auth.service.ts          # Auth API calls
│   │   │   ├── users.service.ts         # User API calls
│   │   │   ├── roles.service.ts         # Role API calls
│   │   │   ├── routes.service.ts        # Route API calls
│   │   │   ├── emailPreferences.service.ts
│   │   │   └── microsoft-auth.service.ts
│   │   │
│   │   ├── 📂 config/                   # Configuration
│   │   │   ├── theme.config.ts          # Theme colors
│   │   │   └── msalConfig.ts            # Microsoft auth config
│   │   │
│   │   ├── 📂 lib/                      # Utilities
│   │   │   └── utils.ts                 # Helper functions
│   │   │
│   │   ├── 📂 assets/                   # Assets
│   │   │   └── react.svg
│   │   │
│   │   ├── App.tsx                      # Root component
│   │   ├── App.css                      # Global styles
│   │   ├── main.tsx                     # Entry point
│   │   └── index.css                    # Tailwind imports
│   │
│   ├── index.html                       # HTML template
│   ├── package.json                     # Dependencies
│   ├── package-lock.json                # Lock file
│   ├── tsconfig.json                    # TypeScript config
│   ├── tsconfig.app.json                # App TS config
│   ├── tsconfig.node.json               # Node TS config
│   ├── vite.config.ts                   # Vite config
│   ├── tailwind.config.js               # Tailwind config
│   ├── postcss.config.js                # PostCSS config
│   ├── eslint.config.js                 # ESLint config
│   ├── .env.example                     # Environment template
│   └── .gitignore                       # Git ignore
│
├── 📄 .env.example                      # Environment template
├── 📄 .gitignore                        # Git ignore rules
├── 📄 UniTemplate.sln                   # Solution file
├── 📄 README.md                         # This file
├── 📄 THEME.md                          # Theme documentation
├── 📄 EMAIL_SETUP.md                    # Email setup guide
└── 📄 LICENSE                           # MIT License
```

<br />

---

<br />

## 🚀 Quick Start

<br />

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download |
|----------|---------|----------|
| .NET SDK | 8.0 or higher | [Download](https://dotnet.microsoft.com/download/dotnet/8.0) |
| Node.js | 18.0 or higher | [Download](https://nodejs.org/) |
| SQL Server | 2019 or higher | [Download](https://www.microsoft.com/sql-server) |
| Git | Latest | [Download](https://git-scm.com/) |
| VS Code (optional) | Latest | [Download](https://code.visualstudio.com/) |

<br />

### Verify Prerequisites

```bash
# Check .NET version
dotnet --version
# Expected: 8.0.x or higher

# Check Node.js version
node --version
# Expected: v18.x.x or higher

# Check npm version
npm --version
# Expected: 9.x.x or higher
```

<br />

### Installation Steps

<details open>
<summary><h4>Step 1: Clone the Repository</h4></summary>

```bash
# Clone the repository
git clone https://github.com/saurabhwebdev/unidotnettemplate.git

# Navigate to project directory
cd unidotnettemplate
```

</details>

<details open>
<summary><h4>Step 2: Configure Environment Variables</h4></summary>

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
ConnectionStrings__DefaultConnection=Server=localhost;Database=UniTemplate;User Id=admin;Password=admin;TrustServerCertificate=true;MultipleActiveResultSets=true

# JWT Configuration
JwtSettings__SecretKey=your-super-secret-key-minimum-32-characters-long
JwtSettings__Issuer=UniTemplate
JwtSettings__Audience=UniTemplateClient
JwtSettings__ExpiryInMinutes=60
JwtSettings__RefreshTokenExpiryInDays=7

# Microsoft SSO (Optional)
MicrosoftAuth__ClientId=your-azure-client-id
MicrosoftAuth__ClientSecret=your-azure-client-secret
MicrosoftAuth__TenantId=common

# Email Settings (Optional)
EmailSettings__Provider=Smtp
EmailSettings__SmtpHost=smtp.gmail.com
EmailSettings__SmtpPort=587
EmailSettings__SmtpUsername=your-email@gmail.com
EmailSettings__SmtpPassword=your-app-password
EmailSettings__FromEmail=noreply@yourdomain.com
EmailSettings__FromName=UniTemplate
```

</details>

<details open>
<summary><h4>Step 3: Setup Backend</h4></summary>

```bash
# Navigate to API project
cd src/UniTemplate.API

# Restore NuGet packages
dotnet restore

# Apply database migrations
dotnet ef database update --project ../UniTemplate.Data

# Run the API (Development mode)
dotnet run

# Or with hot reload
dotnet watch run
```

> **Success!** API is now running at:
> - 🔒 HTTPS: `https://localhost:7000`
> - 🌐 HTTP: `http://localhost:5000`
> - 📚 API Docs: `https://localhost:7000/swagger` (if enabled)

</details>

<details open>
<summary><h4>Step 4: Setup Frontend</h4></summary>

Open a **new terminal** and run:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `client/.env.local`:

```env
VITE_API_URL=https://localhost:7000/api

# Microsoft SSO (Optional)
VITE_MICROSOFT_CLIENT_ID=your-azure-client-id
VITE_MICROSOFT_TENANT_ID=common
VITE_MICROSOFT_REDIRECT_URI=http://localhost:5173
```

```bash
# Start development server
npm run dev
```

> **Success!** Frontend is now running at:
> - 🎨 App: `http://localhost:5173`

</details>

<details>
<summary><h4>Step 5: Create Your First User</h4></summary>

1. Open your browser and go to `http://localhost:5173`
2. Click **"Create account"**
3. Fill in the registration form:
   - Email: `admin@example.com`
   - Password: `SecurePass123!`
   - First Name: `Admin`
   - Last Name: `User`
4. Click **"Create Account"**
5. You'll be redirected to the dashboard

> **Tip:** The first registered user can be promoted to admin through the database or API.

</details>

<br />

### Quick Start Commands Summary

```bash
# Terminal 1 - Backend
cd src/UniTemplate.API
dotnet restore
dotnet ef database update --project ../UniTemplate.Data
dotnet watch run

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

<br />

---

<br />

## ⚙️ Configuration

<br />

### Environment Configuration

<table>
<tr>
<th>Environment</th>
<th>Backend Config</th>
<th>Frontend Config</th>
</tr>
<tr>
<td><strong>Development</strong></td>
<td><code>appsettings.Development.json</code></td>
<td><code>.env.local</code> / <code>.env.development</code></td>
</tr>
<tr>
<td><strong>Staging</strong></td>
<td><code>appsettings.Staging.json</code></td>
<td><code>.env.staging</code></td>
</tr>
<tr>
<td><strong>Production</strong></td>
<td><code>appsettings.json</code> + Environment Variables</td>
<td><code>.env.production</code></td>
</tr>
</table>

<br />

### Backend Configuration Reference

<details open>
<summary><h4>🔑 JWT Settings</h4></summary>

```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-minimum-32-characters-long",
    "Issuer": "UniTemplate",
    "Audience": "UniTemplateClient",
    "ExpiryInMinutes": 60,
    "RefreshTokenExpiryInDays": 7
  }
}
```

| Property | Description | Default |
|----------|-------------|---------|
| `SecretKey` | Secret key for signing JWT tokens (min 32 chars) | Required |
| `Issuer` | Token issuer identifier | `UniTemplate` |
| `Audience` | Token audience identifier | `UniTemplateClient` |
| `ExpiryInMinutes` | Access token expiry time | `60` |
| `RefreshTokenExpiryInDays` | Refresh token expiry time | `7` |

</details>

<details>
<summary><h4>🔗 Database Connection</h4></summary>

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=UniTemplate;User Id=admin;Password=admin;TrustServerCertificate=true;MultipleActiveResultSets=true"
  }
}
```

| Component | Description |
|-----------|-------------|
| `Server` | SQL Server hostname or IP |
| `Database` | Database name |
| `User Id` | SQL Server username |
| `Password` | SQL Server password |
| `TrustServerCertificate` | Trust self-signed certificates |
| `MultipleActiveResultSets` | Allow multiple result sets |

</details>

<details>
<summary><h4>🔷 Microsoft SSO Configuration</h4></summary>

```json
{
  "MicrosoftAuth": {
    "ClientId": "your-application-client-id",
    "ClientSecret": "your-client-secret",
    "TenantId": "common"
  }
}
```

| Property | Description |
|----------|-------------|
| `ClientId` | Azure AD Application (client) ID |
| `ClientSecret` | Azure AD Client Secret |
| `TenantId` | Azure AD Tenant ID or `common`/`organizations`/`consumers` |

**Tenant ID Options:**
- `common` - All Microsoft accounts (work + personal)
- `organizations` - Work/school accounts only
- `consumers` - Personal Microsoft accounts only
- `{tenant-id}` - Specific Azure AD tenant only

**Azure AD Setup:**
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Set redirect URI: `http://localhost:5173` (SPA)
5. Go to **Certificates & secrets** → Create new client secret
6. Copy the Client ID, Tenant ID, and Secret

</details>

<details>
<summary><h4>📧 Email Configuration</h4></summary>

**SMTP Configuration:**
```json
{
  "EmailSettings": {
    "Provider": "Smtp",
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "UniTemplate",
    "EnableSsl": true
  }
}
```

**Microsoft Graph Configuration:**
```json
{
  "EmailSettings": {
    "Provider": "MicrosoftGraph",
    "MicrosoftGraphClientId": "your-client-id",
    "MicrosoftGraphClientSecret": "your-secret",
    "MicrosoftGraphTenantId": "your-tenant-id",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "UniTemplate"
  }
}
```

| Provider | Best For | Setup Difficulty |
|----------|----------|------------------|
| SMTP | Personal/Small projects | Easy |
| Microsoft Graph | Enterprise/Microsoft 365 | Medium |
| SendGrid | High volume | Medium |

</details>

<details>
<summary><h4>🌐 CORS Configuration</h4></summary>

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://yourdomain.com"
    ]
  }
}
```

</details>

<br />

### Frontend Configuration Reference

<details open>
<summary><h4>Environment Variables</h4></summary>

Create `.env.local` in the `client` directory:

```env
# API Configuration
VITE_API_URL=https://localhost:7000/api

# Microsoft SSO (Optional)
VITE_MICROSOFT_CLIENT_ID=your-azure-client-id
VITE_MICROSOFT_TENANT_ID=common
VITE_MICROSOFT_REDIRECT_URI=http://localhost:5173

# Feature Flags (Optional)
VITE_ENABLE_MICROSOFT_SSO=true
VITE_ENABLE_DARK_MODE=true
```

</details>

<details>
<summary><h4>Theme Configuration</h4></summary>

Edit `client/src/config/theme.config.ts`:

```typescript
export const colors = {
  // Primary colors
  primary: '#6366f1',        // Indigo
  primaryHover: '#4f46e5',   // Darker indigo

  // Background colors
  bgPrimary: '#0f172a',      // Slate 900
  bgSecondary: '#1e293b',    // Slate 800
  bgTertiary: '#334155',     // Slate 700

  // Text colors
  textPrimary: '#f8fafc',    // Slate 50
  textSecondary: '#e2e8f0',  // Slate 200
  textMuted: '#94a3b8',      // Slate 400

  // Border & accent
  border: '#334155',         // Slate 700
  accent: '#6366f1',         // Indigo

  // Status colors
  success: '#22c55e',        // Green
  warning: '#f59e0b',        // Amber
  error: '#ef4444',          // Red
  info: '#3b82f6',           // Blue
};
```

</details>

<br />

---

<br />

## 📡 API Reference

<br />

### Base URL

```
Development: https://localhost:7000/api
Production:  https://yourdomain.com/api
```

<br />

### Authentication Header

All authenticated endpoints require:

```http
Authorization: Bearer <access_token>
```

<br />

### Response Format

**Success Response:**
```json
{
  "data": { ... },
  "message": "Operation successful",
  "success": true
}
```

**Error Response:**
```json
{
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "success": false
}
```

<br />

### API Endpoints

<details open>
<summary><h4>🔐 Authentication Endpoints</h4></summary>

<br />

#### Register User

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expiresAt": "2024-12-08T15:00:00Z",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["User"]
  }
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Minimum 6 characters
- FirstName: Required, 1-50 characters
- LastName: Required, 1-50 characters

---

#### Login User

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expiresAt": "2024-12-08T15:00:00Z",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["User", "Admin"]
  }
}
```

---

#### Microsoft SSO Login

```http
POST /api/auth/microsoft-login
Content-Type: application/json
```

**Request Body:**
```json
{
  "accessToken": "microsoft-access-token-from-msal",
  "email": "user@company.com",
  "name": "John Doe"
}
```

**Response:** `200 OK` (Same as login response)

---

#### Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response:** `200 OK` (New tokens)

---

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["User"],
  "emailPreferences": {
    "securityAlerts": true,
    "productUpdates": false,
    "newsletter": true
  }
}
```

---

#### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "If the email exists, a password reset link has been sent."
}
```

---

#### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "email": "user@example.com",
  "newPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password has been reset successfully."
}
```

</details>

<details>
<summary><h4>👥 User Management Endpoints</h4></summary>

<br />

#### List All Users

```http
GET /api/users
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (default: 1) |
| `pageSize` | int | Items per page (default: 10) |
| `search` | string | Search by name/email |
| `role` | string | Filter by role |
| `sortBy` | string | Sort field |
| `sortOrder` | string | `asc` or `desc` |

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "employeeId": "EMP001",
      "designation": "Software Engineer",
      "department": "Engineering",
      "phoneNumber": "+1234567890",
      "officeLocation": "New York, Floor 5",
      "dateOfJoining": "2024-01-15T00:00:00Z",
      "reportsToId": "uuid-of-manager",
      "reportsToName": "Jane Smith",
      "roles": [{"id": "...", "name": "User"}],
      "createdAt": "2024-12-01T10:00:00Z",
      "isActive": true
    }
  ],
  "totalCount": 100,
  "pageSize": 10,
  "currentPage": 1,
  "totalPages": 10
}
```

---

#### Get User by ID

```http
GET /api/users/{id}
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["User"],
  "createdAt": "2024-12-01T10:00:00Z",
  "updatedAt": "2024-12-08T12:00:00Z",
  "isActive": true,
  "lastLoginAt": "2024-12-08T10:00:00Z"
}
```

---

#### Update User

```http
PUT /api/users/{id}
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com"
}
```

**Response:** `200 OK`

---

#### Delete User

```http
DELETE /api/users/{id}
Authorization: Bearer <access_token>
```

**Response:** `204 No Content`

---

#### Update User Roles

```http
PUT /api/users/{id}/roles
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "roleIds": [
    "role-id-1",
    "role-id-2"
  ]
}
```

**Response:** `200 OK`

</details>

<details>
<summary><h4>🎭 Role Management Endpoints</h4></summary>

<br />

#### List All Roles

```http
GET /api/roles
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "role-id-1",
    "name": "Admin",
    "description": "Full system access",
    "permissions": ["users:read", "users:write", "roles:manage"],
    "userCount": 5,
    "createdAt": "2024-12-01T10:00:00Z"
  },
  {
    "id": "role-id-2",
    "name": "User",
    "description": "Standard user access",
    "permissions": ["users:read"],
    "userCount": 150,
    "createdAt": "2024-12-01T10:00:00Z"
  }
]
```

---

#### Create Role

```http
POST /api/roles
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Manager",
  "description": "Department manager access",
  "permissions": ["users:read", "reports:view"]
}
```

**Response:** `201 Created`

---

#### Update Role

```http
PUT /api/roles/{id}
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Manager",
  "description": "Updated description",
  "permissions": ["users:read", "users:write", "reports:view"]
}
```

**Response:** `200 OK`

---

#### Delete Role

```http
DELETE /api/roles/{id}
Authorization: Bearer <access_token>
```

**Response:** `204 No Content`

> **Note:** Cannot delete roles that are assigned to users.

</details>

<details>
<summary><h4>📧 Email Preferences Endpoints</h4></summary>

<br />

#### Get Email Preferences

```http
GET /api/email-preferences
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "securityAlerts": true,
  "productUpdates": false,
  "newsletter": true,
  "weeklyDigest": false
}
```

---

#### Update Email Preferences

```http
PUT /api/email-preferences
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "securityAlerts": true,
  "productUpdates": true,
  "newsletter": false,
  "weeklyDigest": true
}
```

**Response:** `200 OK`

</details>

<details>
<summary><h4>🗺️ Route Permissions Endpoints</h4></summary>

<br />

#### Get Accessible Routes

```http
GET /api/routes
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "routes": [
    {
      "path": "/dashboard",
      "name": "Dashboard",
      "icon": "home",
      "requiredPermissions": []
    },
    {
      "path": "/users",
      "name": "Users",
      "icon": "users",
      "requiredPermissions": ["users:read"]
    },
    {
      "path": "/settings",
      "name": "Settings",
      "icon": "settings",
      "requiredPermissions": ["settings:manage"]
    }
  ]
}
```

</details>

<details>
<summary><h4>📋 Audit Logs Endpoints</h4></summary>

<br />

#### Get Audit Logs (Paginated)

```http
GET /api/auditlogs?page=1&pageSize=20
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (default: 1) |
| `pageSize` | int | Items per page (default: 20, max: 100) |
| `userId` | guid | Filter by user ID |
| `action` | string | Filter by action type |
| `entityType` | string | Filter by entity type |
| `startDate` | datetime | Filter from date |
| `endDate` | datetime | Filter to date |
| `isSuccess` | bool | Filter by success status |

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": "log-id-1",
      "userId": "user-id",
      "userEmail": "user@example.com",
      "action": "Login",
      "entityType": "User",
      "entityId": "user-id",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "isSuccess": true,
      "createdAt": "2024-12-08T10:30:00Z"
    }
  ],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

---

#### Get Single Audit Log

```http
GET /api/auditlogs/{id}
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "id": "log-id-1",
  "userId": "user-id",
  "userEmail": "user@example.com",
  "action": "UserUpdated",
  "entityType": "User",
  "entityId": "target-user-id",
  "oldValues": "{\"name\": \"Old Name\"}",
  "newValues": "{\"name\": \"New Name\"}",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "additionalInfo": "Profile update",
  "isSuccess": true,
  "createdAt": "2024-12-08T10:30:00Z"
}
```

---

#### Get Audit Log Actions

```http
GET /api/auditlogs/actions
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
[
  "Login",
  "Logout",
  "Register",
  "UserCreated",
  "UserUpdated",
  "UserDeleted",
  "RoleAssigned",
  "PasswordChanged"
]
```

---

#### Get Audit Log Entity Types

```http
GET /api/auditlogs/entity-types
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
[
  "User",
  "Role",
  "Settings",
  "Authentication"
]
```

</details>

<details>
<summary><h4>🖼️ Avatar Endpoints</h4></summary>

<br />

#### Update User Avatar

```http
PUT /api/users/avatar
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "avatarUrl": "marble",
  "avatarColor": "#4F46E5,#7C3AED,#EC4899,#F59E0B,#10B981"
}
```

**Response:** `200 OK`
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "avatarUrl": "marble",
  "avatarColor": "#4F46E5,#7C3AED,#EC4899,#F59E0B,#10B981"
}
```

> **Note:** Avatar uses [boring-avatars](https://boringavatars.com/) library. The `avatarUrl` field stores the avatar variant (marble, beam, pixel, sunset, ring, bauhaus) and `avatarColor` stores the color palette.

</details>

<br />

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created |
| `204` | No Content - Successful deletion |
| `400` | Bad Request - Validation error |
| `401` | Unauthorized - Invalid/expired token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `422` | Unprocessable Entity - Business logic error |
| `500` | Internal Server Error |

<br />

---

<br />

## 🗄️ Database Schema

<br />

### Entity Relationship Diagram

```
┌──────────────────────┐       ┌──────────────────────┐
│        Users         │       │        Roles         │
├──────────────────────┤       ├──────────────────────┤
│ Id (PK)              │       │ Id (PK)              │
│ Email (Unique)       │       │ Name (Unique)        │
│ PasswordHash         │       │ Description          │
│ FirstName            │       │ Permissions (JSON)   │
│ LastName             │◄─────►│ CreatedAt            │
│ RefreshToken         │       │ UpdatedAt            │
│ RefreshTokenExpiry   │       └──────────────────────┘
│ IsMicrosoftAccount   │                │
│ IsActive             │                │
│ CreatedAt            │                │
│ UpdatedAt            │                │
└──────────────────────┘                │
          │                             │
          │                             │
          ▼                             ▼
┌──────────────────────────────────────────────────────┐
│                     UserRoles                         │
├──────────────────────────────────────────────────────┤
│ UserId (FK) ─────────────────────────────────────────┤
│ RoleId (FK) ─────────────────────────────────────────┤
│ AssignedAt                                           │
└──────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│  PasswordResetTokens │       │ UserEmailPreferences │
├──────────────────────┤       ├──────────────────────┤
│ Id (PK)              │       │ Id (PK)              │
│ UserId (FK)          │       │ UserId (FK)          │
│ Token                │       │ SecurityAlerts       │
│ ExpiresAt            │       │ ProductUpdates       │
│ IsUsed               │       │ Newsletter           │
│ CreatedAt            │       │ WeeklyDigest         │
└──────────────────────┘       └──────────────────────┘
```

<br />

### Table Definitions

<details>
<summary><h4>Users Table</h4></summary>

```sql
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(256) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    RefreshToken NVARCHAR(MAX),
    RefreshTokenExpiryTime DATETIME2,
    IsMicrosoftAccount BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2
);

CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_CreatedAt ON Users(CreatedAt);
```

</details>

<details>
<summary><h4>Roles Table</h4></summary>

```sql
CREATE TABLE Roles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(256),
    Permissions NVARCHAR(MAX), -- JSON array
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2
);
```

</details>

<details>
<summary><h4>UserRoles Table</h4></summary>

```sql
CREATE TABLE UserRoles (
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoleId UNIQUEIDENTIFIER NOT NULL,
    AssignedAt DATETIME2 DEFAULT GETUTCDATE(),
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);
```

</details>

<br />

---

<br />

## 🔄 Authentication Flow

<br />

### JWT Authentication Flow

```
┌────────┐                                           ┌────────┐
│ Client │                                           │ Server │
└───┬────┘                                           └───┬────┘
    │                                                    │
    │  1. POST /api/auth/login                          │
    │    { email, password }                            │
    │──────────────────────────────────────────────────>│
    │                                                    │
    │                           2. Validate credentials  │
    │                              Generate JWT tokens   │
    │                                                    │
    │  3. Return tokens                                  │
    │    { accessToken, refreshToken, expiresAt }       │
    │<──────────────────────────────────────────────────│
    │                                                    │
    │  4. Store tokens in localStorage                   │
    │                                                    │
    │  5. API Request with token                        │
    │    Authorization: Bearer <accessToken>            │
    │──────────────────────────────────────────────────>│
    │                                                    │
    │                           6. Validate JWT          │
    │                              Check expiration      │
    │                              Verify signature      │
    │                                                    │
    │  7. Return data                                   │
    │<──────────────────────────────────────────────────│
    │                                                    │
```

<br />

### Token Refresh Flow

```
┌────────┐                                           ┌────────┐
│ Client │                                           │ Server │
└───┬────┘                                           └───┬────┘
    │                                                    │
    │  1. API Request (token expired)                   │
    │    Authorization: Bearer <expiredToken>           │
    │──────────────────────────────────────────────────>│
    │                                                    │
    │  2. 401 Unauthorized                              │
    │<──────────────────────────────────────────────────│
    │                                                    │
    │  3. POST /api/auth/refresh-token                  │
    │    { refreshToken }                               │
    │──────────────────────────────────────────────────>│
    │                                                    │
    │                           4. Validate refresh token│
    │                              Generate new tokens   │
    │                                                    │
    │  5. Return new tokens                             │
    │    { accessToken, refreshToken, expiresAt }       │
    │<──────────────────────────────────────────────────│
    │                                                    │
    │  6. Retry original request with new token         │
    │──────────────────────────────────────────────────>│
    │                                                    │
```

<br />

### Microsoft SSO Flow

```
┌────────┐          ┌───────────┐          ┌────────┐          ┌────────┐
│ Client │          │ Microsoft │          │  API   │          │   DB   │
└───┬────┘          └─────┬─────┘          └───┬────┘          └───┬────┘
    │                     │                     │                   │
    │  1. Click "Sign in  │                     │                   │
    │     with Microsoft" │                     │                   │
    │────────────────────>│                     │                   │
    │                     │                     │                   │
    │  2. Microsoft login │                     │                   │
    │     popup appears   │                     │                   │
    │<────────────────────│                     │                   │
    │                     │                     │                   │
    │  3. User enters     │                     │                   │
    │     credentials     │                     │                   │
    │────────────────────>│                     │                   │
    │                     │                     │                   │
    │  4. Return MS token │                     │                   │
    │<────────────────────│                     │                   │
    │                     │                     │                   │
    │  5. POST /api/auth/microsoft-login        │                   │
    │     { msToken, email, name }              │                   │
    │─────────────────────────────────────────> │                   │
    │                     │                     │                   │
    │                     │  6. Verify MS token │                   │
    │                     │<────────────────────│                   │
    │                     │                     │                   │
    │                     │  7. Token valid     │                   │
    │                     │────────────────────>│                   │
    │                     │                     │                   │
    │                     │                     │  8. Find/Create   │
    │                     │                     │     user          │
    │                     │                     │──────────────────>│
    │                     │                     │                   │
    │                     │                     │  9. User data     │
    │                     │                     │<──────────────────│
    │                     │                     │                   │
    │  10. Return JWT tokens                    │                   │
    │<─────────────────────────────────────────│                   │
    │                     │                     │                   │
```

<br />

---

<br />

## 🎨 Frontend Guide

<br />

### Component Architecture

```
App.tsx
├── Router (React Router)
│   ├── Public Routes
│   │   ├── Login
│   │   ├── Register
│   │   ├── ForgotPassword
│   │   └── ResetPassword
│   │
│   └── Protected Routes (DashboardLayout)
│       ├── Dashboard
│       ├── Profile
│       ├── Settings
│       ├── Users
│       └── RolesAndUsers
│
├── Services
│   ├── api.ts (Axios instance)
│   ├── auth.service.ts
│   ├── users.service.ts
│   └── roles.service.ts
│
└── Components
    ├── ui/ (shadcn components)
    ├── DashboardLayout
    ├── ImageSlideshow
    └── MicrosoftLoginButton
```

<br />

### State Management

The application uses React's built-in state management:

| State Type | Storage | Usage |
|------------|---------|-------|
| Auth State | localStorage | JWT tokens, user info |
| UI State | useState | Form inputs, modals, loading |
| Server State | useEffect + fetch | API data |

<br />

### Key Services

<details>
<summary><h4>API Service (api.ts)</h4></summary>

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh-token', {
            refreshToken,
          });
          localStorage.setItem('accessToken', response.data.accessToken);
          // Retry original request
          return api.request(error.config);
        } catch {
          // Refresh failed, logout
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

</details>

<details>
<summary><h4>Auth Service (auth.service.ts)</h4></summary>

```typescript
import api from './api';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    this.setTokens(response.data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    this.setTokens(response.data);
    return response.data;
  },

  async microsoftLogin(data: MicrosoftLoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/microsoft-login', data);
    this.setTokens(response.data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  setTokens(data: AuthResponse): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
```

</details>

<br />

### UI Components (shadcn/ui)

| Component | File | Description |
|-----------|------|-------------|
| Button | `ui/button.tsx` | Primary button component |
| Input | `ui/input.tsx` | Form input field |
| Card | `ui/card.tsx` | Card container |
| Table | `ui/table.tsx` | Data table |
| Modal | `ui/modal.tsx` | Modal dialog |
| Switch | `ui/switch.tsx` | Toggle switch |
| Tooltip | `ui/tooltip.tsx` | Hover tooltip |
| Skeleton | `ui/skeleton.tsx` | Loading placeholder |

<br />

---

<br />

## 🛠️ Development

<br />

### Development Commands

```bash
# Backend Development
cd src/UniTemplate.API
dotnet watch run                    # Hot reload
dotnet build                        # Build project
dotnet test                         # Run tests
dotnet clean                        # Clean build

# Frontend Development
cd client
npm run dev                         # Dev server
npm run build                       # Production build
npm run preview                     # Preview build
npm run lint                        # Run ESLint
npm run type-check                  # TypeScript check
```

<br />

### Database Commands

```bash
# From src/UniTemplate.API directory

# Create new migration
dotnet ef migrations add MigrationName --project ../UniTemplate.Data

# Apply migrations
dotnet ef database update --project ../UniTemplate.Data

# Remove last migration
dotnet ef migrations remove --project ../UniTemplate.Data

# Generate SQL script
dotnet ef migrations script --project ../UniTemplate.Data

# Drop database
dotnet ef database drop --project ../UniTemplate.Data
```

<br />

### Code Quality

**Backend (C#):**
- Follow [Microsoft C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- Use nullable reference types
- Prefer async/await for I/O operations
- Use dependency injection

**Frontend (TypeScript):**
- ESLint with recommended rules
- Prettier for formatting
- TypeScript strict mode
- React hooks best practices

<br />

---

<br />

## 🧪 Testing

<br />

### Backend Testing

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test project
dotnet test tests/UniTemplate.Tests
```

**Test Structure:**
```
tests/
├── UniTemplate.Tests/
│   ├── Unit/
│   │   ├── Services/
│   │   │   ├── AuthServiceTests.cs
│   │   │   └── UserServiceTests.cs
│   │   └── Controllers/
│   │       └── AuthControllerTests.cs
│   └── Integration/
│       └── ApiTests.cs
```

<br />

### Frontend Testing

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

<br />

---

<br />

## 🚢 Deployment

<br />

### Production Build

<details>
<summary><h4>Backend Deployment</h4></summary>

```bash
# Build for production
cd src/UniTemplate.API
dotnet publish -c Release -o ./publish

# The publish folder contains:
# - UniTemplate.API.dll
# - All dependencies
# - appsettings.json
```

**IIS Deployment:**
1. Install .NET 8 Hosting Bundle
2. Create new IIS site
3. Point to publish folder
4. Configure app pool (No Managed Code)
5. Set environment variables

**Azure App Service:**
```bash
# Using Azure CLI
az webapp deployment source config-zip \
  --resource-group MyResourceGroup \
  --name myapp \
  --src publish.zip
```

</details>

<details>
<summary><h4>Frontend Deployment</h4></summary>

```bash
# Build for production
cd client
npm run build

# Output is in /dist folder
```

**Static Hosting (Vercel, Netlify):**
- Connect GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`
- Configure environment variables

**Azure Static Web Apps:**
```yaml
# .github/workflows/azure-static-web-apps.yml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_TOKEN }}
          app_location: "client"
          output_location: "dist"
```

</details>

<br />

### Environment Variables for Production

```bash
# Required
ConnectionStrings__DefaultConnection=<production-connection-string>
JwtSettings__SecretKey=<strong-production-secret>

# Optional
MicrosoftAuth__ClientId=<azure-client-id>
MicrosoftAuth__ClientSecret=<azure-secret>
EmailSettings__SmtpPassword=<smtp-password>
```

<br />

---

<br />

## ⚡ Performance

<br />

### Backend Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Connection Pooling | EF Core default pooling |
| Async Operations | All I/O is async |
| Response Compression | Gzip/Brotli |
| Caching | In-memory caching available |
| Pagination | All list endpoints |
| Indexing | Database indexes on key fields |

<br />

### Frontend Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Code Splitting | React.lazy + Suspense |
| Tree Shaking | Vite production build |
| Asset Optimization | Image compression |
| Bundle Analysis | `npm run build -- --analyze` |
| Lazy Loading | Route-based splitting |
| Memoization | React.memo, useMemo |

<br />

---

<br />

## 🔒 Security

<br />

### Security Features

| Feature | Status | Description |
|---------|:------:|-------------|
| Password Hashing | ✅ | BCrypt with salt |
| JWT Tokens | ✅ | Short-lived access tokens |
| Refresh Tokens | ✅ | Rotating refresh tokens |
| HTTPS | ✅ | TLS encryption |
| CORS | ✅ | Restricted origins |
| Input Validation | ✅ | Server-side validation |
| SQL Injection | ✅ | Parameterized queries (EF) |
| XSS Protection | ✅ | React auto-escaping |
| CSRF Protection | ✅ | SameSite cookies |
| Rate Limiting | 🔜 | Coming soon |
| 2FA | 🔜 | Coming soon |

<br />

### Security Checklist

- [ ] Change default JWT secret key
- [ ] Enable HTTPS in production
- [ ] Configure CORS for your domain only
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up logging and monitoring
- [ ] Regular dependency updates
- [ ] Database connection encryption
- [ ] Implement IP blocking after failed attempts
- [ ] Set up security headers (CSP, HSTS)

<br />

---

<br />

## 🔧 Troubleshooting

<br />

<details>
<summary><h4>Database Connection Issues</h4></summary>

**Problem:** Cannot connect to SQL Server

**Solutions:**
1. Verify SQL Server is running
2. Check connection string format
3. Ensure firewall allows connections
4. Verify user credentials

```bash
# Test connection
sqlcmd -S localhost -U admin -P admin -Q "SELECT 1"
```

</details>

<details>
<summary><h4>CORS Errors</h4></summary>

**Problem:** CORS policy blocking requests

**Solutions:**
1. Verify frontend URL in `appsettings.json`
2. Check API is running
3. Ensure correct protocol (http/https)

```json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

</details>

<details>
<summary><h4>JWT Token Issues</h4></summary>

**Problem:** 401 Unauthorized errors

**Solutions:**
1. Clear localStorage and re-login
2. Verify JWT secret is consistent
3. Check token expiration
4. Ensure Bearer prefix in header

```javascript
// Check token expiry
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
```

</details>

<details>
<summary><h4>Migration Errors</h4></summary>

**Problem:** EF Core migration fails

**Solutions:**
```bash
# Remove last migration
dotnet ef migrations remove --project ../UniTemplate.Data

# Reset database
dotnet ef database drop --project ../UniTemplate.Data
dotnet ef database update --project ../UniTemplate.Data
```

</details>

<details>
<summary><h4>Microsoft SSO Not Working</h4></summary>

**Problem:** Microsoft login fails

**Solutions:**
1. Verify Client ID and Tenant ID
2. Check redirect URI matches Azure config
3. Ensure API permissions granted in Azure
4. Clear browser cache and cookies

</details>

<br />

---

<br />

## 🗺️ Roadmap

<br />

### Version 1.0 (Current)
- [x] JWT Authentication
- [x] Microsoft SSO
- [x] RBAC System
- [x] User Management
- [x] Email Services
- [x] Password Reset
- [x] Dark Theme UI

### Version 1.1 (Planned)
- [ ] Google OAuth
- [ ] Two-Factor Authentication
- [ ] Email Verification
- [ ] User Avatar Upload
- [ ] Activity Logging
- [ ] Docker Support

### Version 1.2 (Future)
- [ ] Multi-tenancy
- [ ] Webhooks
- [ ] GraphQL API
- [ ] Real-time Notifications
- [ ] Audit Trail
- [ ] API Rate Limiting

### Version 2.0 (Vision)
- [ ] Microservices Architecture
- [ ] Kubernetes Support
- [ ] Message Queue Integration
- [ ] Advanced Analytics
- [ ] A/B Testing Framework
- [ ] Plugin System

<br />

---

<br />

## 🤝 Contributing

<br />

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs** - Found a bug? [Open an issue](https://github.com/saurabhwebdev/unidotnettemplate/issues)
2. **Suggest Features** - Have an idea? [Start a discussion](https://github.com/saurabhwebdev/unidotnettemplate/discussions)
3. **Submit PRs** - Ready to code? Fork and submit a pull request
4. **Improve Docs** - Documentation improvements are always welcome
5. **Share** - Star the repo and share with others

<br />

### Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

<br />

### Code Standards

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

<br />

---

<br />

## 💬 Support

<br />

### Get Help

| Channel | Link |
|---------|------|
| GitHub Issues | [Report a bug](https://github.com/saurabhwebdev/unidotnettemplate/issues) |
| Discussions | [Ask questions](https://github.com/saurabhwebdev/unidotnettemplate/discussions) |
| Email | saurabh@example.com |

<br />

### Frequently Asked Questions

<details>
<summary><strong>Can I use this for commercial projects?</strong></summary>

Yes! This template is MIT licensed, which means you can use it for personal and commercial projects without restrictions.

</details>

<details>
<summary><strong>Do I need Azure for Microsoft SSO?</strong></summary>

Yes, Microsoft SSO requires an Azure AD application registration. However, it's optional - the template works fine with just email/password authentication.

</details>

<details>
<summary><strong>Can I use a different database?</strong></summary>

Yes! While configured for SQL Server, EF Core supports PostgreSQL, MySQL, SQLite, and others. Just update the connection string and install the appropriate provider package.

</details>

<details>
<summary><strong>How do I add new API endpoints?</strong></summary>

1. Create a new controller in `UniTemplate.API/Controllers`
2. Add service interface in `UniTemplate.Core/Interfaces`
3. Implement service in `UniTemplate.Data/Services`
4. Register in `Program.cs`

</details>

<br />

---

<br />

## 📄 License

<br />

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Saurabh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

<br />

---

<br />

## 🙏 Acknowledgments

<br />

Special thanks to these amazing projects and resources:

- [.NET](https://dotnet.microsoft.com/) - The foundation of our backend
- [React](https://react.dev/) - The UI library powering our frontend
- [Tailwind CSS](https://tailwindcss.com/) - For beautiful utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Vite](https://vitejs.dev/) - Lightning fast build tool
- [Entity Framework Core](https://docs.microsoft.com/ef/core/) - Data access made easy
- [JWT](https://jwt.io/) - Secure token-based authentication
- [MSAL](https://github.com/AzureAD/microsoft-authentication-library-for-js) - Microsoft authentication
- [Pexels](https://pexels.com/) - Free stock photos for auth backgrounds
- [Shields.io](https://shields.io/) - Beautiful badges
- [Devicon](https://devicon.dev/) - Technology icons

<br />

---

<br />

<div align="center">

### ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=saurabhwebdev/unidotnettemplate&type=Date)](https://star-history.com/#saurabhwebdev/unidotnettemplate&Date)

<br />

---

<br />

### 🌟 If you find this project useful, please consider giving it a star!

<br />

**Built with ❤️ by [Saurabh](https://github.com/saurabhwebdev)**

<br />

[![GitHub](https://img.shields.io/badge/GitHub-saurabhwebdev-181717?style=for-the-badge&logo=github)](https://github.com/saurabhwebdev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/saurabhwebdev)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/saurabhwebdev)

<br />

[⬆ Back to Top](#unidotnet-template)

</div>
