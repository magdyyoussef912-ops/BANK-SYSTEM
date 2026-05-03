# 🏦 Bank System API

A production-grade RESTful banking API built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**. Supports user registration, authentication with refresh tokens, account management, credit card management, deposits, withdrawals, atomic transfers, beneficiary management, and a full admin panel.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Cache:** Redis (Upstash)
- **Authentication:** JWT (Access Token + Refresh Token)
- **Validation:** Zod
- **Security:** bcrypt, helmet, cors, express-rate-limit

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Redis](https://upstash.com/) (Upstash or local)
- npm

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/magdyyoussef912-ops/BANK-SYSTEM.git
cd BANK-SYSTEM
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.development .env.development
```

Then fill in your values (see Environment Variables section).

### 4. Run the project

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

---

## 🔐 Environment Variables

| Variable             | Description                              | Example                          |
|----------------------|------------------------------------------|----------------------------------|
| `PORT`               | Port the server runs on                  | `3000`                           |
| `LOCAL_URI_DB`       | MongoDB local connection string          | `mongodb://localhost:27017/bank` |
| `DB_URI_ONLINE`      | MongoDB Atlas connection string          | `mongodb+srv://...`              |
| `SALTROUNDS`         | bcrypt salt rounds                       | `12`                             |
| `ACCESS_TOKEN_KEY`   | Secret key for signing access tokens     | `your_strong_secret`             |
| `REFRESH_TOKEN_KEY`  | Secret key for signing refresh tokens    | `your_strong_secret`             |
| `PREFIX`             | Authorization header prefix              | `Bearer`                         |
| `REDIS_URL`          | Redis connection string                  | `rediss://...`                   |
| `WHITE_LIST`         | Allowed CORS origins (comma-separated)   | `http://localhost:5173`          |
| `EMAIL`              | Email for notifications                  | `your@email.com`                 |
| `PASSWORD`           | Email app password                       | `your_app_password`              |

> ⚠️ Never commit your real `.env` files to version control.

---

## 📁 Project Structure

```
src/
├── index.ts                        # Entry point
├── app.controller.ts               # Express setup, middleware, routes
├── config/
│   └── config.service.ts           # Environment variables
├── DB/
│   ├── connectionDB.ts             # MongoDB connection
│   └── model/                      # Mongoose models
│       ├── user.model.ts
│       ├── bankAccount.model.ts
│       ├── creditCard.model.ts
│       ├── transaction.model.ts
│       └── beneficiary.model.ts
├── common/
│   ├── middleware/
│   │   ├── authentication.ts       # JWT verification + Redis token revocation
│   │   ├── authorization.ts        # Role-based access control
│   │   └── validation.ts           # Zod validation
│   ├── service/
│   │   └── redis.service.ts        # Redis cache service
│   └── utils/
│       ├── success.Responsive.ts
│       ├── error.global.handler.ts
│       └── security/
│           ├── hash.security.ts    # bcrypt hash & compare
│           └── token.service.ts    # JWT sign & verify
├── modules/
│   ├── auth/
│   ├── user/
│   ├── account/
│   ├── card/
│   ├── transaction/
│   ├── beneficiary/
│   └── admin/
└── repositories/
    └── base.repository.ts          # Generic CRUD operations
```

---

## 📡 API Endpoints

### Auth — `/auth`

| Method | Endpoint               | Description                        | Auth |
|--------|------------------------|------------------------------------|------|
| POST   | `/auth/register`       | Register a new user                | ❌   |
| POST   | `/auth/login`          | Login & get access + refresh token | ❌   |
| POST   | `/auth/refresh-token`  | Get new access token               | 🔄   |
| POST   | `/auth/logout`         | Logout (current or all devices)    | ✅   |

> 🔄 = requires Refresh Token in Authorization header
> 
> **Logout all devices:** `POST /auth/logout?flag=All`

### User — `/user`

| Method | Endpoint                 | Description                     | Auth |
|--------|--------------------------|---------------------------------|------|
| GET    | `/user/me`               | Get current user profile        | ✅   |
| PATCH  | `/user/update-info`      | Update full name                | ✅   |
| PATCH  | `/user/update-password`  | Change password                 | ✅   |
| GET    | `/user/me/accounts`      | Get accounts with linked cards  | ✅   |
| DELETE | `/user/me`               | Delete account (zero balance)   | ✅   |

### Account — `/account`

| Method | Endpoint          | Description                         | Auth |
|--------|-------------------|-------------------------------------|------|
| POST   | `/account/create` | Create a bank account               | ✅   |
| GET    | `/account/me`     | Get current user's account(s)       | ✅   |
| GET    | `/account/status` | Get account statement by date range | ✅   |

**Query params for `/account/status`:**
```
?from=2024-01-01&to=2024-12-31
```

### Credit Cards — `/card`

| Method | Endpoint                       | Description                      | Auth |
|--------|--------------------------------|----------------------------------|------|
| POST   | `/card/AddCard`                | Add a new credit card            | ✅   |
| GET    | `/card/getAllCards`             | Get all user's cards             | ✅   |
| PATCH  | `/card/setDefaultCard/:cardId` | Set card as default              | ✅   |
| DELETE | `/card/deleteCard/:cardId`     | Delete card and linked account   | ✅   |

### Transactions — `/transaction`

| Method | Endpoint                  | Description                     | Auth |
|--------|---------------------------|---------------------------------|------|
| PATCH  | `/transaction/deposit`    | Deposit money                   | ✅   |
| PATCH  | `/transaction/withdraw`   | Withdraw money                  | ✅   |
| POST   | `/transaction/transfer`   | Atomic transfer to beneficiary  | ✅   |
| GET    | `/transaction/my`         | Get my transactions (paginated) | ✅   |
| GET    | `/transaction/my/summary` | Get transactions summary        | ✅   |
| GET    | `/transaction/:id`        | Get single transaction          | ✅   |

**Query params for `/transaction/my`:**
```
?page=1&limit=10
```

### Beneficiary — `/beneficiary`

| Method | Endpoint                              | Description              | Auth |
|--------|---------------------------------------|--------------------------|------|
| POST   | `/beneficiary/addBeneficiary`         | Add a new beneficiary    | ✅   |
| GET    | `/beneficiary/getAllBeneficiary`       | Get all beneficiaries    | ✅   |
| DELETE | `/beneficiary/deleteBeneficiary/:id`  | Delete a beneficiary     | ✅   |

### Admin — `/admin` 🔒

> All admin routes require `role: admin`

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/admin/dashBoard`                | System-wide statistics         |
| GET    | `/admin/users`                    | Get all users (paginated)      |
| GET    | `/admin/user/:userId`             | Get specific user              |
| PATCH  | `/admin/user/:userId/block`       | Block a user                   |
| PATCH  | `/admin/user/:userId/unBlock`     | Unblock a user                 |
| DELETE | `/admin/user/:userId/delete`      | Delete a user                  |
| GET    | `/admin/accounts`                 | Get all accounts (paginated)   |
| PATCH  | `/admin/accounts/:accountId/block`   | Block an account            |
| PATCH  | `/admin/accounts/:accountId/unBlock` | Unblock an account          |
| GET    | `/admin/cards`                    | Get all cards (paginated)      |
| PATCH  | `/admin/cards/:cardId/block`      | Block a card                   |
| GET    | `/admin/transaction`              | Get all transactions (paginated)|

---

## 🔑 Authentication

All protected routes require a JWT access token in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

You get the token from `/auth/login`.

### Token Strategy
- **Access Token** — short-lived, stored in memory
- **Refresh Token** — long-lived, stored in localStorage
- **Token Revocation** — handled via Redis on logout

---

## 📝 Request Examples

### Register
```json
POST /auth/register
{
  "fullName": "Magdy Youssef",
  "email": "magdy@example.com",
  "password": "StrongPass@123"
}
```

### Login
```json
POST /auth/login
{
  "email": "magdy@example.com",
  "password": "StrongPass@123"
}
```

### Add Credit Card
```json
POST /card/AddCard
Authorization: Bearer <token>

{
  "bankName": "CIB",
  "cardType": "visa",
  "password": "1234"
}
```

### Deposit
```json
PATCH /transaction/deposit
Authorization: Bearer <token>

{
  "amount": 500
}
```

### Withdraw
```json
PATCH /transaction/withdraw
Authorization: Bearer <token>

{
  "amount": 200
}
```

### Transfer
```json
POST /transaction/transfer
Authorization: Bearer <token>

{
  "beneficiaryId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "amount": 200
}
```

### Add Beneficiary
```json
POST /beneficiary/addBeneficiary
Authorization: Bearer <token>

{
  "accountNumber": "1234567890",
  "bankName": "CIB",
  "nickName": "Ahmed"
}
```

---

## 🔒 Security Features

- Passwords hashed with **bcrypt**
- HTTP headers secured with **helmet**
- Rate limiting — max **100 requests / 15 minutes**
- JWT authentication with **Access + Refresh Token** strategy
- **Token revocation** via Redis on logout
- Role-based authorization middleware
- **Atomic transfers** using MongoDB sessions — no partial transactions
- Password field excluded from all API responses
- CORS whitelist protection