<div align="center">

# ⛏️ UniDotNet Template

### **The Ultimate Full-Stack SaaS Starter Kit**

<br />

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)

<br />

[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://github.com/saurabhwebdev/unidotnettemplate/graphs/commit-activity)

<br />

**Ship faster. Scale smarter. Build with confidence.**

[Getting Started](#-quick-start) · [Features](#-features) · [Documentation](#-documentation) · [Contributing](#-contributing)

<br />

---

</div>

<br />

## 🎯 Overview

**UniDotNet Template** is a production-ready, enterprise-grade SaaS boilerplate that combines the power of **.NET 8** backend with a blazing-fast **React + TypeScript** frontend. Skip weeks of setup and start building your product today.

<br />

<div align="center">

| 🚀 **Fast** | 🔐 **Secure** | 📱 **Modern** | ⚡ **Scalable** |
|:---:|:---:|:---:|:---:|
| Vite-powered frontend | JWT + Microsoft SSO | React 18 + Tailwind | Clean architecture |

</div>

<br />

---

<br />

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- ✅ JWT token-based authentication
- ✅ Microsoft SSO integration (Azure AD)
- ✅ Secure password hashing (BCrypt)
- ✅ Refresh token rotation
- ✅ Password reset via email
- ✅ Protected routes & guards

</td>
<td width="50%">

### 👥 User Management
- ✅ Role-based access control (RBAC)
- ✅ User CRUD operations
- ✅ Profile management
- ✅ Email preferences
- ✅ Activity tracking
- ✅ Admin dashboard

</td>
</tr>
<tr>
<td width="50%">

### 📧 Email Services
- ✅ SMTP email support
- ✅ Microsoft Graph API integration
- ✅ Email templates
- ✅ Notification preferences
- ✅ Queue-ready architecture

</td>
<td width="50%">

### 🎨 Modern UI/UX
- ✅ Dark theme design
- ✅ Responsive layouts
- ✅ Animated components
- ✅ shadcn/ui integration
- ✅ Mining-themed imagery
- ✅ Smooth transitions

</td>
</tr>
</table>

<br />

---

<br />

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Pages     │  │ Components  │  │      Services           │ │
│  │  ─────────  │  │  ─────────  │  │  ───────────────────    │ │
│  │  • Login    │  │  • UI Kit   │  │  • Auth Service         │ │
│  │  • Register │  │  • Layout   │  │  • API Client           │ │
│  │  • Dashboard│  │  • Forms    │  │  • User Service         │ │
│  │  • Settings │  │  • Tables   │  │  • Role Service         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/REST
┌────────────────────────────┴────────────────────────────────────┐
│                      API LAYER (.NET 8)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Controllers                           │  │
│  │   Auth • Users • Roles • Routes • EmailPreferences        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Core      │  │   Services  │  │      Interfaces         │ │
│  │  ─────────  │  │  ─────────  │  │  ───────────────────    │ │
│  │  • Entities │  │  • Auth     │  │  • IAuthService         │ │
│  │  • DTOs     │  │  • Token    │  │  • IEmailService        │ │
│  │  • Enums    │  │  • Email    │  │  • IUserService         │ │
│  │  • Config   │  │  • User     │  │  • IRoleService         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      DATA LAYER (EF Core)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   AppDbContext  •  Migrations  •  SQL Server             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

<br />

---

<br />

## 📁 Project Structure

```
unidotnettemplate/
│
├── 📂 src/
│   ├── 📂 UniTemplate.API/           # 🌐 Web API Layer
│   │   ├── Controllers/              # API endpoints
│   │   ├── Program.cs                # App configuration
│   │   └── appsettings.json          # Settings
│   │
│   ├── 📂 UniTemplate.Core/          # 💎 Domain Layer
│   │   ├── Entities/                 # Domain models
│   │   ├── DTOs/                     # Data transfer objects
│   │   ├── Interfaces/               # Service contracts
│   │   └── Configuration/            # Config classes
│   │
│   └── 📂 UniTemplate.Data/          # 💾 Data Layer
│       ├── Services/                 # Service implementations
│       ├── Migrations/               # EF Core migrations
│       └── AppDbContext.cs           # Database context
│
├── 📂 client/                        # ⚛️ React Frontend
│   ├── 📂 src/
│   │   ├── components/               # Reusable components
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── pages/                    # Route pages
│   │   ├── services/                 # API services
│   │   ├── config/                   # App configuration
│   │   └── lib/                      # Utilities
│   └── public/                       # Static assets
│
├── 📄 .env.example                   # Environment template
├── 📄 UniTemplate.sln                # Solution file
└── 📄 README.md                      # You are here!
```

<br />

---

<br />

## 🚀 Quick Start

### Prerequisites

<table>
<tr>
<td>

| Requirement | Version |
|-------------|---------|
| 🟣 .NET SDK | 8.0+ |
| 🟢 Node.js | 18.0+ |
| 🔵 SQL Server | 2019+ |

</td>
<td>

```bash
# Verify installations
dotnet --version
node --version
```

</td>
</tr>
</table>

<br />

### ⚡ Installation

<details open>
<summary><b>1️⃣ Clone the Repository</b></summary>

```bash
git clone https://github.com/saurabhwebdev/unidotnettemplate.git
cd unidotnettemplate
```

</details>

<details open>
<summary><b>2️⃣ Configure Environment</b></summary>

```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
# - Database connection
# - JWT secret key
# - Microsoft SSO credentials (optional)
```

</details>

<details open>
<summary><b>3️⃣ Setup Backend</b></summary>

```bash
# Navigate to API project
cd src/UniTemplate.API

# Restore packages
dotnet restore

# Apply database migrations
dotnet ef database update --project ../UniTemplate.Data

# Run the API
dotnet run
```

> 🌐 API will be available at `https://localhost:7000`

</details>

<details open>
<summary><b>4️⃣ Setup Frontend</b></summary>

```bash
# Navigate to client
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

> 🎨 Frontend will be available at `http://localhost:5173`

</details>

<br />

---

<br />

## ⚙️ Configuration

### 🔑 JWT Settings

```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-min-32-chars",
    "Issuer": "UniTemplate",
    "Audience": "UniTemplateClient",
    "ExpiryInMinutes": 60,
    "RefreshTokenExpiryInDays": 7
  }
}
```

<br />

### 🔷 Microsoft SSO (Optional)

<details>
<summary><b>Azure AD Configuration Steps</b></summary>

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Configure:
   - **Name**: Your app name
   - **Redirect URI**: `http://localhost:5173` (SPA)
5. Copy the **Client ID** and **Tenant ID**

</details>

```json
{
  "MicrosoftAuth": {
    "ClientId": "your-client-id",
    "ClientSecret": "your-client-secret",
    "TenantId": "common"
  }
}
```

```env
# client/.env
VITE_MICROSOFT_CLIENT_ID=your-client-id
VITE_MICROSOFT_TENANT_ID=common
VITE_MICROSOFT_REDIRECT_URI=http://localhost:5173
```

<br />

### 📧 Email Configuration

<details>
<summary><b>SMTP Setup</b></summary>

```json
{
  "EmailSettings": {
    "Provider": "Smtp",
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "UniTemplate"
  }
}
```

</details>

<details>
<summary><b>Microsoft Graph Setup</b></summary>

```json
{
  "EmailSettings": {
    "Provider": "MicrosoftGraph",
    "MicrosoftGraphClientId": "your-client-id",
    "MicrosoftGraphClientSecret": "your-secret",
    "MicrosoftGraphTenantId": "your-tenant-id",
    "FromEmail": "noreply@yourdomain.com"
  }
}
```

</details>

<br />

---

<br />

## 📚 Documentation

### 🔌 API Endpoints

<details>
<summary><b>🔐 Authentication</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/microsoft-login` | Microsoft SSO |
| `POST` | `/api/auth/refresh-token` | Refresh JWT token |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password |
| `GET` | `/api/auth/me` | Get current user |

</details>

<details>
<summary><b>👥 Users</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/{id}` | Get user by ID |
| `PUT` | `/api/users/{id}` | Update user |
| `DELETE` | `/api/users/{id}` | Delete user |
| `PUT` | `/api/users/{id}/roles` | Update user roles |

</details>

<details>
<summary><b>🎭 Roles</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/roles` | List all roles |
| `POST` | `/api/roles` | Create role |
| `PUT` | `/api/roles/{id}` | Update role |
| `DELETE` | `/api/roles/{id}` | Delete role |

</details>

<br />

### 📝 Example Requests

<details>
<summary><b>Register User</b></summary>

```bash
curl -X POST https://localhost:7000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "expiresAt": "2024-12-08T14:00:00Z",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

</details>

<br />

---

<br />

## 🛠️ Development

### Commands Reference

```bash
# 🔧 Backend
dotnet watch run                    # Hot reload development
dotnet build                        # Build project
dotnet test                         # Run tests
dotnet ef migrations add <Name>     # Create migration
dotnet ef database update           # Apply migrations

# 🎨 Frontend
npm run dev                         # Development server
npm run build                       # Production build
npm run preview                     # Preview build
npm run lint                        # Lint code
```

<br />

### Database Migrations

```bash
# From src/UniTemplate.API directory
dotnet ef migrations add MigrationName --project ../UniTemplate.Data
dotnet ef database update --project ../UniTemplate.Data
dotnet ef migrations remove --project ../UniTemplate.Data  # Undo last
```

<br />

---

<br />

## 🚢 Deployment

### Production Build

```bash
# Backend
cd src/UniTemplate.API
dotnet publish -c Release -o ./publish

# Frontend
cd client
npm run build
```

### 🐳 Docker (Coming Soon)

```dockerfile
# Dockerfile support planned for future release
```

<br />

---

<br />

## 🔒 Security Checklist

- [ ] Change JWT `SecretKey` in production
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS for your domain
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up logging & monitoring
- [ ] Regular dependency updates
- [ ] Database connection encryption

<br />

---

<br />

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br />

---

<br />

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br />

---

<br />

<div align="center">

### 🌟 Star this repo if you find it useful!

<br />

**Built with ❤️ by [Saurabh](https://github.com/saurabhwebdev)**

<br />

[⬆ Back to Top](#️-unidotnet-template)

</div>
