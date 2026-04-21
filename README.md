# 🏦 Bank System API

A RESTful banking API built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**. Supports user registration, account management, deposits, withdrawals, atomic transfers, and beneficiary management.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (Access Token)
- **Validation:** Zod
- **Security:** bcrypt, helmet, cors, express-rate-limit

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
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
cp .env.example .env.development
```

Then fill in your values.

### 4. Run the project

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

---

## 🔐 Environment Variables

| Variable           | Description                             | Example                          |
|--------------------|-----------------------------------------|----------------------------------|
| `PORT`             | Port the server runs on                 | `3000`                           |
| `LOCAL_URI_DB`     | MongoDB connection string               | `mongodb://localhost:27017/bank` |
| `SALT_ROUNDS`      | bcrypt salt rounds                      | `10`                             |
| `ACCESS_TOKEN_KEY` | Secret key for signing access tokens    | `your_strong_secret`             |
| `PREFIX`           | Authorization header prefix             | `Bearer`                         |

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
│       ├── transaction.model.ts
│       └── beneficiary.model.ts
├── common/
│   ├── middleware/
│   │   ├── authentication.ts       # JWT verification
│   │   ├── authorization.ts        # Role-based access control
│   │   └── validation.ts           # Zod validation
│   ├── utils/
│   │   ├── success.Responsive.ts
│   │   ├── error.global.handler.ts
│   │   └── security/
│   │       ├── hash.security.ts
│   │       └── token.service.ts
│   └── enum/                       # Shared enums
├── modules/
│   ├── user/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   │   └── user.repository.ts
│   ├── account/
│   │   ├── account.controller.ts
│   │   ├── account.service.ts
│   │   ├── account.validation.ts
│   │   └── account.repository.ts
│   ├── transaction/
│   │   ├── transaction.controller.ts
│   │   ├── transaction.service.ts
│   │   ├── transaction.validation.ts
│   │   └── transaction.repository.ts
│   └── beneficiary/
│       ├── beneficiary.controller.ts
│       ├── beneficiary.service.ts
│       ├── beneficiary.validation.ts
│       └── beneficiary.repository.ts
├── repositories/
│   └── base.repository.ts          # Generic CRUD operations
└── types/
    └── express.d.ts                # Express type extensions
```

---

## 📡 API Endpoints

### Auth — `/auth`

| Method | Endpoint         | Description         | Auth |
|--------|------------------|---------------------|------|
| POST   | `/auth/register` | Register a new user | ❌   |
| POST   | `/auth/login`    | Login & get token   | ❌   |

### Account — `/account`

| Method | Endpoint          | Description                         | Auth |
|--------|-------------------|-------------------------------------|------|
| GET    | `/account/me`     | Get current user's account          | ✅   |
| GET    | `/account/status` | Get account statement by date range | ✅   |

**Query params for `/account/status`:**
```
?from=2024-01-01&to=2024-12-31
```

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

| Method | Endpoint                      | Description           | Auth |
|--------|-------------------------------|-----------------------|------|
| POST   | `/beneficiary/addBeneficiary` | Add a new beneficiary | ✅   |

---

## 🔑 Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

You get the token from `/auth/login`.

---

## 📝 Request Examples

### Register
```json
POST /auth/register
{
  "fullName": "Magdy Youssef",
  "email": "magdy@example.com",
  "password": "StrongPassword123"
}
```

### Login
```json
POST /auth/login
{
  "email": "magdy@example.com",
  "password": "StrongPassword123"
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

### Transfer
```json
POST /transaction/transfer
Authorization: Bearer <token>

{
  "beneficiaryId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "amount": 200
}
```

---

## 🔒 Security Features

- Passwords hashed with **bcrypt**
- HTTP headers secured with **helmet**
- Rate limiting — max **100 requests / 15 minutes**
- JWT authentication on all protected routes
- Role-based authorization middleware
- **Atomic transfers** using MongoDB sessions — no partial transactions
- Password field excluded from all API responses
