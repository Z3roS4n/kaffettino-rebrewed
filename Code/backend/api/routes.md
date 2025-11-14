# API ROUTES

## User & Base Informations

All User endpoints need to be followed by an Authorization header containing the session token.
Like the following one.

### USER INFORMATIONS

```typescript
await fetch("https://localhost:3000/api/v1/user", {
  method: "GET",
  headers: {
    Authorization: "Bearer <token>", //SESSION TOKEN
  },
});

interface UrlParams {
  includeWallets?: boolean;
}

interface UserResponse {
  user: UserModel[];
  wallets: WalletModel[];
}
```

From now on, the authorization header will not be specified anymore.

### WALLET INFORMATIONS

```typescript
await fetch("https://localhost:3000/api/v1/user/wallet", {
  method: "GET",
});

interface UrlParams {
  aulettaId?: number;
}

interface UserWalletResponse {
  wallets: WalletModel[];
}
```

### WALLET TRANSACTIONS

```typescript
await fetch("https://localhost:3000/api/v1/user/wallet", {
  method: "GET",
});

interface UrlParams {
  walletId?: string;
  filters?: {
    aulettaId?: number;
    amountRange?: { min?: number; max?: number };
    discountApplied?: boolean;
  };
}

interface UserWalletResponse {
  transactions: TransactionModel;
}
```
