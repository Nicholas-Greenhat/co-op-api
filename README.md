# Banking API — Full-Stack Developer Assessment

A REST API for customer transactions and funds transfer, built with Node.js, Express, and SQLite.

## Tech Stack
- Node.js, Express
- better-sqlite3 (embedded database, no setup required)
- express-validator (input validation)
- Winston (logging)
- Jest + Supertest (testing)

## Project Structure

```
co-op/
├── src/
│   ├── config/
│   │   └── database.js       # SQLite setup & seed data
│   ├── controllers/
│   │   └── banking.controller.js
│   ├── middleware/
│   │   └── validate.js       # Request validation
│   ├── models/
│   │   ├── account.model.js
│   │   └── transaction.model.js
│   ├── routes/
│   │   └── banking.routes.js
│   ├── services/
│   │   └── banking.service.js  # Business logic
│   ├── utils/
│   │   ├── logger.js
│   │   └── response.js
│   ├── app.js                # Express app
│   └── server.js             # Entry point
├── tests/
│   └── banking.test.js
├── Banking_API.postman_collection.json
└── package.json
```

## Getting Started

```bash
npm install
npm start
```

Server runs on `http://localhost:8080`.

Two accounts are pre-seeded:

| Account Number | Owner         | Balance   |
|----------------|---------------|-----------|
| ACC001         | Alice Johnson | 5000.00   |
| ACC002         | Bob Smith     | 3000.00   |

## Running Tests

```bash
npm test
```

---

## API Reference

All responses follow this envelope:
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "timestamp": "2024-01-01 12:00:00"
}
```

---

### 1. Save Transaction — `POST /api/transactions`

Persists transaction details with status `PENDING`. Does **not** move funds.

**Request**
```json
{
  "senderAccountNumber": "ACC001",
  "receiverAccountNumber": "ACC002",
  "amount": 500.00,
  "description": "Payment for services"
}
```

**Response `201 Created`**
```json
{
  "success": true,
  "message": "Transaction saved successfully",
  "data": {
    "id": 1,
    "senderAccountNumber": "ACC001",
    "receiverAccountNumber": "ACC002",
    "amount": 500,
    "description": "Payment for services",
    "status": "PENDING",
    "createdAt": "2024-01-01 12:00:00"
  },
  "timestamp": "2024-01-01 12:00:00"
}
```

---

### 2. Transfer Funds — `POST /api/transfers`

Moves money between accounts atomically and records the transaction with status `COMPLETED`.

**Request**
```json
{
  "senderAccountNumber": "ACC001",
  "receiverAccountNumber": "ACC002",
  "amount": 200.00,
  "description": "Monthly rent"
}
```

**Response `200 OK`**
```json
{
  "success": true,
  "message": "Funds transferred successfully",
  "data": {
    "id": 2,
    "senderAccountNumber": "ACC001",
    "receiverAccountNumber": "ACC002",
    "amount": 200,
    "description": "Monthly rent",
    "status": "COMPLETED",
    "createdAt": "2024-01-01 12:00:00"
  },
  "timestamp": "2024-01-01 12:00:00"
}
```

**Error — Insufficient Funds `400`**
```json
{
  "success": false,
  "message": "Insufficient funds. Available balance: 4800.00",
  "timestamp": "2024-01-01 12:00:00"
}
```

---

### 3. Get Account Balance — `GET /api/accounts/{accountNumber}/balance`

**Response `200 OK`**
```json
{
  "success": true,
  "message": "Account balance retrieved successfully",
  "data": {
    "accountNumber": "ACC001",
    "ownerName": "Alice Johnson",
    "balance": 4800.00,
    "currency": "NGN"
  },
  "timestamp": "2024-01-01 12:00:00"
}
```

---

## Postman Collection

Import `Banking_API.postman_collection.json` into Postman. The `baseUrl` variable defaults to `http://localhost:8080`.
