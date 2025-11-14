# API ROUTES

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Most endpoints require authentication via session token in the Authorization header:

```typescript
headers: {
  Authorization: "Bearer <session_token>";
}
```

---

## Data Models

### User

```typescript
interface User {
  id: string; // UUID
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  userData: UserData[];
  cards: Card[];
  wallets: Wallet[];
  topUps: TopUp[];
  transactions: Transaction[];
}
```

### UserData

```typescript
interface UserData {
  id: string; // UUID
  userId: string;
  aulettaId?: number;
  birthDate?: Date;
  role: Role; // GUEST | USER | ADMIN | TREASURER | SUPERUSER
  createdAt: Date;
  updatedAt: Date;
}
```

### Wallet

```typescript
interface Wallet {
  id: string; // UUID
  balance: number;
  userId: string;
  aulettaId: number;
  createdAt: Date;
  updatedAt: Date;
  topUps: TopUp[];
  transactions: Transaction[];
}
```

### Transaction

```typescript
interface Transaction {
  id: number; // Auto-increment
  inventoryId: number;
  quantity: number;
  totalPrice: number;
  description?: string;
  discount: number; // Default: 0
  userId: string;
  aulettaId: number;
  walletId: string;
  cardId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### TopUp

```typescript
interface TopUp {
  id: string; // UUID
  amount: number;
  description?: string;
  walletId: string;
  userId: string;
  aulettaId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Card

```typescript
interface Card {
  id: string; // UUID
  cardId: string; // Unique
  pin?: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: Transaction[];
}
```

### Auletta

```typescript
interface Auletta {
  id: number; // Auto-increment
  name: string; // Unique
  location: string;
  number: string; // Unique
  telegramId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product

```typescript
interface Product {
  id: number; // Auto-increment
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Inventory

```typescript
interface Inventory {
  id: number; // Auto-increment
  aulettaId: number;
  quantity: number;
  marginPrice: number;
  createdAt: Date;
  updatedAt: Date;
  transactions: Transaction[];
  products: Product_Inventory[];
}
```

### Session

```typescript
interface Session {
  id: string; // UUID
  expiresAt: Date;
  token: string; // Unique
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
}
```

---

## Endpoints

### 🔓 Public Endpoints

#### Health Check

```typescript
GET / api / v1 / ping;

Response: {
  hello: "world!";
}
```

---

### 🔐 Protected Endpoints

**Note:** All protected endpoints require the `Authorization` header with a valid session token.

#### Get Protected Resource

```typescript
GET /api/v1/protected

Headers: {
  Authorization: "Bearer <session_token>"
}

Response: {
  user: User
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
```

---

### 👤 User Endpoints

#### Get User Information

```typescript
GET /api/v1/user

Headers: {
  Authorization: "Bearer <session_token>"
}

Query Parameters: {
  includeWallets?: boolean;      // Include user's wallets in response
}

Response: {
  user: User;
  wallets?: Wallet[];            // Only if includeWallets=true
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
```

#### Update User Data

```typescript
POST /api/v1/user

Headers: {
  Authorization: "Bearer <session_token>",
  Content-Type: "application/json"
}

Body: {
  aulettaId?: number;
  birthDate?: Date;
}

Response: {
  userData: UserData;
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 400 Bad Request: { error: "Invalid data" }
```

---

### 💳 Wallet Endpoints

#### Get User Wallets

```typescript
GET /api/v1/user/wallet

Headers: {
  Authorization: "Bearer <session_token>"
}

Query Parameters: {
  aulettaId?: number;            // Filter by specific auletta
  userId?: string;               // Admin only: get wallets for specific user
}

Response: {
  wallets: Wallet[];
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
```

#### Create Wallet (Admin Only)

```typescript
POST /api/v1/wallet

Headers: {
  Authorization: "Bearer <session_token>",
  Content-Type: "application/json"
}

Body: {
  userId: string;                // Required - User ID to create wallet for
  aulettaId: number;             // Required
}

Response: {
  wallet: Wallet;
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions. Only administrators can create wallets" }
- 400 Bad Request: { error: "userId and aulettaId are required" }
- 400 Bad Request: { error: "Wallet already exists for this user and auletta" }
```

---

### 💰 Transaction Endpoints

#### Get Wallet Transactions

```typescript
GET /api/v1/user/wallet/transactions

Headers: {
  Authorization: "Bearer <session_token>"
}

Query Parameters: {
  walletId?: string;
  filters?: {
    aulettaId?: number;
    amountRange?: {
      min?: number;
      max?: number;
    };
    discountApplied?: boolean;
    startDate?: Date;
    endDate?: Date;
  };
  limit?: number;                // Default: 50
  offset?: number;               // Default: 0
}

Response: {
  transactions: Transaction[];
  total: number;
  hasMore: boolean;
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
```

#### Create Transaction

```typescript
POST /api/v1/user/wallet/transactions

Headers: {
  Authorization: "Bearer <session_token>",
  Content-Type: "application/json"
}

Body: {
  walletId: string;              // Required
  inventoryId: number;           // Required
  quantity: number;              // Required
  discount?: number;             // Optional, default: 0
  cardId?: string;               // Optional
  description?: string;          // Optional
}

Response: {
  transaction: Transaction;
  wallet: {
    id: string;
    balance: number;             // Updated balance
  };
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 400 Bad Request: { error: "Invalid data" }
- 402 Payment Required: { error: "Insufficient balance" }
```

---

### 💵 Top-Up Endpoints

#### Get Top-Up History

```typescript
GET /api/v1/topup

Headers: {
  Authorization: "Bearer <session_token>"
}

Query Parameters: {
  walletId?: string;             // Filter by wallet
  userId?: string;               // Admin only: filter by user
  aulettaId?: number;            // Filter by auletta
  limit?: number;                // Default: 50
  offset?: number;               // Default: 0
}

Response: {
  topUps: TopUp[];
  total: number;
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }

Notes:
- Regular users can only see their own top-ups
- Admins can see all top-ups and filter by userId
```

#### Create Top-Up (Admin Only)

```typescript
POST /api/v1/topup

Headers: {
  Authorization: "Bearer <session_token>",
  Content-Type: "application/json"
}

Body: {
  walletId: string;              // Required - Wallet to top up
  amount: number;                // Required, must be > 0
  description?: string;          // Optional - Reason for top-up
}

Response: {
  topUp: TopUp;
  wallet: {
    id: string;
    balance: number;             // Updated balance after top-up
  };
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions. Only administrators can create top-ups" }
- 400 Bad Request: { error: "walletId and a positive amount are required" }
- 404 Not Found: { error: "Wallet not found" }

Notes:
- Only users with ADMIN, TREASURER, or SUPERUSER roles can create top-ups
- The top-up is credited to the wallet owner's account
- Balance is updated atomically in a database transaction
```

---

### 🎴 Card Endpoints

#### Get User Cards

```typescript
GET /api/v1/cards

Headers: {
  Authorization: "Bearer <session_token>"
}

Query Parameters: {
  userId?: string;               // Admin only: get cards for specific user
}

Response: {
  cards: Card[];
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }

Notes:
- Regular users can only see their own cards
- Admins can see all cards or filter by userId
```

#### Register Card (Admin Only)

```typescript
POST /api/v1/card

Headers: {
  Authorization: "Bearer <session_token>",
  Content-Type: "application/json"
}

Body: {
  userId: string;                // Required - User to assign card to
  cardId: string;                // Required - Unique RFID card ID
  pin?: number;                  // Optional - 4-digit PIN for card security
}

Response: {
  card: Card;
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions. Only administrators can register cards" }
- 400 Bad Request: { error: "userId and cardId are required" }
- 400 Bad Request: { error: "Card already registered" }
- 404 Not Found: { error: "User not found" }
```

#### Delete Card (Admin Only)

```typescript
DELETE /api/v1/card/:cardId

Headers: {
  Authorization: "Bearer <session_token>"
}

Response: {
  success: true;
  message: "Card deleted successfully";
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions. Only administrators can delete cards" }
- 404 Not Found: { error: "Card not found" }
```

---

### 🏢 Auletta Endpoints (Admin Only)

#### Get All Aulette

```typescript
GET /api/v1/auletta

Headers: {
  Authorization: "Bearer <session_token>"
}

Response: {
  aulette: Auletta[];
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions" }
```

#### Create Auletta

```typescript
POST /api/v1/auletta

Headers: {
  Authorization: "Bearer <session_token>",
  Content-Type: "application/json"
}

Body: {
  name: string;                  // Required, unique
  location: string;              // Required
  number: string;                // Required, unique
  telegramId?: string;           // Optional
}

Response: {
  auletta: Auletta;
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions" }
- 400 Bad Request: { error: "Name or number already exists" }
```

---

### 📦 Inventory Endpoints (Admin/Treasurer)

#### Get Inventory

```typescript
GET /api/v1/inventory

Headers: {
  Authorization: "Bearer <session_token>"
}

Query Parameters: {
  aulettaId?: number;            // Filter by auletta
  productId?: number;            // Filter by product
}

Response: {
  inventory: Inventory[];
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions" }
```

#### Update Inventory

```typescript
PUT /api/v1/inventory/:id

Headers: {
  Authorization: "Bearer <session_token>",
  Content-Type: "application/json"
}

Body: {
  quantity?: number;
  marginPrice?: number;
}

Response: {
  inventory: Inventory;
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions" }
- 404 Not Found: { error: "Inventory not found" }
```

---

### 🛍️ Product Endpoints

#### Get All Products

```typescript
GET /api/v1/products

Headers: {
  Authorization: "Bearer <session_token>"
}

Response: {
  products: Product[];
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
```

#### Create Product (Admin Only)

```typescript
POST /api/v1/products

Headers: {
  Authorization: "Bearer <session_token>",
  Content-Type: "application/json"
}

Body: {
  name: string;                  // Required
}

Response: {
  product: Product;
}

Error Responses:
- 401 Unauthorized: { error: "Unauthorized" }
- 403 Forbidden: { error: "Insufficient permissions" }
```

---

## Error Codes

| Code | Description                                     |
| ---- | ----------------------------------------------- |
| 200  | OK - Request successful                         |
| 201  | Created - Resource created successfully         |
| 400  | Bad Request - Invalid input data                |
| 401  | Unauthorized - Missing or invalid session token |
| 403  | Forbidden - Insufficient permissions            |
| 404  | Not Found - Resource not found                  |
| 402  | Payment Required - Insufficient wallet balance  |
| 500  | Internal Server Error                           |

---

## Role Permissions

| Role      | Description         | Permissions                                    |
| --------- | ------------------- | ---------------------------------------------- |
| GUEST     | Default role        | Read-only access to own data                   |
| USER      | Registered user     | Full access to own data, transactions, wallets |
| ADMIN     | Administrator       | Manage aulette, inventory, products            |
| TREASURER | Financial manager   | View all transactions, manage wallets, top-ups |
| SUPERUSER | Super administrator | Full system access                             |

---

## Notes

- All timestamps are in ISO 8601 format
- UUIDs are version 4
- Amounts and prices are in EUR (float)
- Pagination uses `limit` and `offset` parameters
- Default pagination limit is 50 items
- All endpoints return JSON responses
