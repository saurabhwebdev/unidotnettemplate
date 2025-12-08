# UniTemplate - .NET SaaS Template

A full-stack SaaS template with .NET backend and React frontend, featuring JWT authentication, SQL Server database, and modern UI components.

## Tech Stack

### Backend
- **.NET 9** - Web API
- **Entity Framework Core 9** - ORM
- **SQL Server** - Database
- **JWT Authentication** - Secure token-based auth
- **Microsoft SSO** - Microsoft corporate email authentication (optional)
- **BCrypt.Net** - Password hashing

### Frontend
- **Vite** - Build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **MSAL** - Microsoft Authentication Library for SSO

## Project Structure

```
UniTemplate/
├── src/
│   ├── UniTemplate.API/          # Web API project
│   ├── UniTemplate.Core/         # Domain entities and interfaces
│   └── UniTemplate.Data/         # Data access layer
├── client/                       # React frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   └── lib/                  # Utilities
└── README.md
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb) (or SQL Server)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd UniTemplate
```

### 2. Backend Setup

#### Configure Database Connection

The default connection string uses SQL Server with SQL authentication (username: `admin`, password: `admin`). Update the connection string in:
- `src/UniTemplate.API/appsettings.json`
- `src/UniTemplate.API/appsettings.Development.json`

**Default Configuration:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=UniTemplate;User Id=admin;Password=admin;TrustServerCertificate=true;MultipleActiveResultSets=true"
  }
}
```

**IMPORTANT**: Make sure your SQL Server has a user named `admin` with password `admin`, or update the connection string to match your SQL Server credentials. You can also use environment variables to override these settings.

#### Create Database Migrations

```bash
# Navigate to the API project
cd src/UniTemplate.API

# Create initial migration
dotnet ef migrations add InitialCreate --project ../UniTemplate.Data

# Apply migration to database
dotnet ef database update --project ../UniTemplate.Data
```

#### Run the Backend

```bash
# From the API project directory
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7000`
- HTTP: `http://localhost:5000`

You can view the API documentation at `https://localhost:7000/openapi/v1.json` (in development mode).

### 3. Frontend Setup

#### Install Dependencies

```bash
cd client
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `client` folder (or copy from `.env.example`):

```env
VITE_API_URL=https://localhost:7000/api
```

#### Run the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Features

### Authentication
- User registration with email/password
- Login with JWT tokens
- **Microsoft SSO** - Sign in with corporate Microsoft account (optional, configurable)
- Automatic token refresh
- Protected routes
- Logout functionality

### Database
- Entity Framework Core with Code-First approach
- SQL Server database
- Automatic timestamp tracking (CreatedAt, UpdatedAt)
- Migration support

### API
- RESTful API design
- JWT Bearer authentication
- CORS configured for local development
- Environment-based configuration
- Swagger/OpenAPI documentation (dev mode)

### Frontend
- Type-safe API client with Axios
- Automatic token refresh on 401 responses
- React Router for navigation
- shadcn/ui components (Button, Input, Card)
- Tailwind CSS for styling
- Dark mode support (via CSS variables)
- Microsoft SSO integration with MSAL

## Microsoft SSO Configuration (Optional)

To enable Microsoft corporate email authentication, you need to register your application in Azure AD:

### 1. Register Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations** > **New registration**
3. Fill in the application details:
   - **Name**: UniTemplate (or your app name)
   - **Supported account types**: Choose based on your needs
     - **Single tenant**: Only users in your organization
     - **Multitenant**: Users in any Azure AD directory
     - **Personal Microsoft accounts**: Include personal accounts
   - **Redirect URI**: Select "Single-page application (SPA)" and enter `http://localhost:5173`
4. Click **Register**

### 2. Configure Backend

Add your Microsoft App credentials to `appsettings.json`:

```json
{
  "MicrosoftAuth": {
    "ClientId": "your-application-client-id",
    "ClientSecret": "your-client-secret",
    "TenantId": "common",
    "CallbackPath": "/signin-microsoft"
  }
}
```

**Or** use environment variables:

```bash
export MicrosoftAuth__ClientId="your-application-client-id"
export MicrosoftAuth__ClientSecret="your-client-secret"
export MicrosoftAuth__TenantId="common"
```

### 3. Configure Frontend

Update `client/.env`:

```env
VITE_MICROSOFT_CLIENT_ID=your-application-client-id
VITE_MICROSOFT_TENANT_ID=common
VITE_MICROSOFT_REDIRECT_URI=http://localhost:5173
```

### 4. Tenant ID Options

- **`common`**: Allow both work/school and personal Microsoft accounts
- **`organizations`**: Only work/school accounts
- **`consumers`**: Only personal Microsoft accounts
- **`<tenant-id>`**: Specific Azure AD tenant only

### Notes

- The Microsoft login button will automatically appear on the login/register pages if the Client ID is configured
- Users can sign in with their corporate Microsoft email
- New users are automatically registered on first login
- Microsoft users don't need to set a password

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "base64string...",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "guid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST `/api/auth/login`
Login an existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register.

#### POST `/api/auth/microsoft-login`
Login or register a user using Microsoft SSO.

**Request:**
```json
{
  "accessToken": "microsoft-access-token",
  "email": "user@company.com",
  "name": "John Doe"
}
```

**Response:** Same as register/login.

**Notes:**
- The access token is obtained from Microsoft authentication (MSAL library handles this on the frontend)
- If the user doesn't exist, they will be automatically registered
- No password is required for Microsoft SSO users

#### POST `/api/auth/refresh-token`
Refresh an expired access token.

**Request:**
```json
{
  "refreshToken": "base64string..."
}
```

**Response:** Same as register/login.

#### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "guid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Configuration

### JWT Settings

Update JWT configuration in `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "your-secret-key-minimum-32-characters",
    "Issuer": "UniTemplate",
    "Audience": "UniTemplateClient",
    "ExpiryInMinutes": 60,
    "RefreshTokenExpiryInDays": 7
  }
}
```

**Important:** Change the `SecretKey` in production!

### CORS Settings

Configure allowed origins in `appsettings.json`:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000"
    ]
  }
}
```

## Development

### Backend Development

```bash
# Watch mode (auto-reload)
cd src/UniTemplate.API
dotnet watch run
```

### Frontend Development

```bash
cd client
npm run dev
```

### Database Migrations

```bash
# Add a new migration
cd src/UniTemplate.API
dotnet ef migrations add MigrationName --project ../UniTemplate.Data

# Update database
dotnet ef database update --project ../UniTemplate.Data

# Remove last migration
dotnet ef migrations remove --project ../UniTemplate.Data
```

## Building for Production

### Backend

```bash
cd src/UniTemplate.API
dotnet publish -c Release -o ./publish
```

### Frontend

```bash
cd client
npm run build
```

The build output will be in the `client/dist` folder.

## Security Considerations

1. **Change the JWT Secret Key** in production
2. **Use HTTPS** in production
3. **Configure CORS** properly for your production domain
4. **Use strong passwords** and consider implementing password policies
5. **Store sensitive configuration** in environment variables or Azure Key Vault
6. **Enable rate limiting** for authentication endpoints
7. **Implement proper logging** and monitoring

## Customization

### Adding New Entities

1. Create entity class in `UniTemplate.Core/Entities/`
2. Add DbSet to `AppDbContext` in `UniTemplate.Data/`
3. Configure entity in `OnModelCreating` if needed
4. Create migration: `dotnet ef migrations add AddEntityName`
5. Update database: `dotnet ef database update`

### Adding New API Endpoints

1. Create controller in `UniTemplate.API/Controllers/`
2. Implement service interface in `UniTemplate.Core/Interfaces/`
3. Implement service in `UniTemplate.Data/Services/`
4. Register service in `Program.cs`

### Adding New Frontend Pages

1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Create API service if needed in `client/src/services/`

## Troubleshooting

### Database Connection Issues

- Ensure SQL Server LocalDB is installed
- Check connection string in `appsettings.json`
- Run migrations: `dotnet ef database update`

### CORS Errors

- Verify frontend URL is in `AllowedOrigins` in `appsettings.json`
- Check that backend is running
- Ensure API URL in `.env` is correct

### Authentication Issues

- Clear browser localStorage
- Check JWT secret key is consistent
- Verify token expiry times

## License

This template is provided as-is for your use in building SaaS applications.

## Support

For issues and questions, please create an issue in the repository.
