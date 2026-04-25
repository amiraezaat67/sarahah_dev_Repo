# Sarahah App Backend

A Node.js backend application for an anonymous messaging platform similar to Sarahah, built with Express.js, MongoDB, and Redis.

## 🚀 Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Anonymous Messaging**: Send and receive anonymous messages
- **Google OAuth Integration**: Sign in with Google authentication
- **Email Notifications**: Email notifications for new messages
- **Redis Caching**: Fast caching with Redis for improved performance
- **Security**: Password hashing with Argon2 and bcrypt
- **CORS Support**: Configurable CORS for frontend integration

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis 5.12.1
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Argon2, bcrypt
- **Email**: Nodemailer
- **OAuth**: Google Auth Library
- **Environment**: dotenv, cross-env
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Redis (local or cloud)
- npm or yarn
 
### Installation
 
1. Clone the repository:

```bash
git clone https://github.com/amiraezaat67/sarahah_dev_Repo.git
cd Sarahah_App_Prep
```
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.sample .env
```
4. Configure your .env file with the required values (see Environment Variables section).

5. Start the development server:
```bash
npm run dev
```

### For production:
```bash
npm run prod
```

### ⚙️ Environment Variables

Create a .env file based on .env.sample and configure the following:

#### Server Configuration

- PORT: Server port (default: 3000)
- ## Database
- MONGO_URL: MongoDB connection string
- MONGO_URL_CLOUD: Cloud MongoDB connection string (optional)
- ## Encryption
- ENC_KEY: Encryption key for sensitive data
- ENC_IV_LENGTH: IV length for encryption
- ## JWT Configuration
- JWT_ACCESS_SECRET_USER: User access token secret
- JWT_ACCESS_EXP_USER: User access token expiration
- JWT_ACCESS_SECRET_ADMIN: Admin access token secret
- JWT_ACCESS_EXP_ADMIN: Admin access token expiration
- JWT_REFRESH_SECRET_USER: User refresh token secret
- JWT_REFRESH_EXP_USER: User refresh token expiration
- JWT_REFRESH_SECRET_ADMIN: Admin refresh token secret
- JWT_REFRESH_EXP_ADMIN: Admin refresh token expiration
- ## CORS
- CORS_WHITELISTED_ORIGINS: Comma-separated list of allowed origins
- ## Google OAuth
- GCP_CLIENT_ID: Google OAuth client ID
- ## Redis
- REDIS_URL: Redis connection string
- ## Email Configuration
- EMAIL_USER: Email service username
- EMAIL_PASS: Email service password
- EMAIL_SERVICE: Email service provider (e.g., gmail, outlook)

### 📚 API Endpoints

- Authentication (/api/auth)
- User registration and login
- Google OAuth integration
- Token refresh
- Messages (/api/message)
- Send anonymous messages
- View received messages
- Message management
- Users (/api/user)
- User profile management
- User settings
- Health Check
- GET /: Basic health check with Redis status

### 🧪 Available Scripts

- npm start: Start the application in production mode
- npm run dev: Start in development mode with nodemon
- npm run prod: Start in production mode
- npm run publish-package: Publish to npm registry

### 🔒 Security Features

- Password hashing with Argon2 and bcrypt
- JWT-based authentication with access and refresh tokens
- CORS protection
- Environment-based configuration
- Input validation and sanitization

### 📝 License
This project is licensed under the ISC License.

### 🤝 Contributing
Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Create a Pull Request
