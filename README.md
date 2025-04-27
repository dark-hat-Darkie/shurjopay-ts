# shurjoPay Node.js/TypeScript SDK

**Made With**  
[![Test Status](https://img.shields.io/badge/test-passing-brightgreen)]()  
[![NPM Version](https://img.shields.io/npm/v/shurjopay-ts)](https://www.npmjs.com/package/shurjopay-ts)

**TypeScript-first** SDK for shurjoPay Payment Gateway v2.1, developed and maintained by **Shakil Shareef**.

## Features

✅ **Full TypeScript Support** - Built with strict typing and interfaces  
✅ **Modern Async/Await** - Clean promise-based API  
✅ **Comprehensive Logging** - Winston-based error tracking  
✅ **Token Management** - Automatic token validation and refresh

## Installation

```bash
npm install shurjopay-ts
# or
yarn add shurjopay-ts
```

## Configuration

Create a `.env` file in your project root:

```env
SP_ENDPOINT=https://sandbox.shurjopayment.com
SP_USERNAME=sp_sandbox
SP_PASSWORD=pyyk97hu&6u6
SP_PREFIX=SP
SP_RETURN_URL=https://yourdomain.com/payment-callback
```

## Basic Usage

### 1. Initialize the SDK

```typescript
import Shurjopay from "shurjopay-ts";
import "dotenv/config";

const sp = new Shurjopay();

// Configure with environment variables
sp.config(
  process.env.SP_ENDPOINT!,
  process.env.SP_USERNAME!,
  process.env.SP_PASSWORD!,
  process.env.SP_PREFIX!,
  process.env.SP_RETURN_URL!
);
```

### 2. Make a Payment (Async/Await)

```typescript
try {
  const payment = await sp.makePayment({
    amount: 1000,
    order_id: "order_123",
    customer_name: "John Doe",
    customer_address: "123 Main St",
    client_ip: "102.101.1.1",
    customer_phone: "01712345678",
    customer_city: "Dhaka",
    customer_post_code: "1200",
  });

  console.log("Checkout URL:", payment.checkout_url);
  // Redirect user to payment.checkout_url
} catch (error) {
  console.error("Payment failed:", error);
}
```

### 3. Verify Payment

```typescript
try {
  const verification = await sp.verifyPayment("order_123");
  console.log("Payment status:", verification.status);
} catch (error) {
  console.error("Verification failed:", error);
}
```

### 4. Check Payment Status

```typescript
try {
  const status = await sp.paymentStatus("order_123");
  console.log("Current status:", status);
} catch (error) {
  console.error("Status check failed:", error);
}
```

## Advanced Features

### Automatic Token Management

The SDK handles:

- Token acquisition
- Token refresh when expired
- Token validation

Check token status:

```typescript
if (sp.token_valid()) {
  console.log("Token is valid");
}
```

### Comprehensive Logging

All operations are logged to:

- Console
- `shurjopay-plugin.log` file

Custom log levels:

```typescript
sp.log("Custom message", "warn");
```

## Error Handling

All methods throw clear errors that can be caught with try/catch:

```typescript
try {
  await sp.makePayment({...});
} catch (error) {
  if (error instanceof AxiosError) {
    // Handle HTTP errors
  } else {
    // Handle other errors
  }
}
```

## Type Support

All methods use TypeScript interfaces:

```typescript
interface ShurjoPayTransaction {
  checkout_url: string;
  amount: number;
  currency: string;
  sp_order_id: string;
  customer_order_id: string;
  // ... other fields
}
```

## Development

```bash
# Run tests
npm test

# Build TypeScript
npm run build
```

## License

MIT License

For support, contact the me at shakil.cse19@gmail.com
