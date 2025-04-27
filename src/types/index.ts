export interface CheckoutParams {
  amount: number;
  order_id: string;
  customer_name: string;
  customer_address: string;
  client_ip?: string;
  customer_phone: string;
  customer_city: string;
  customer_post_code?: string;
  currency: "BDT" | "USD";
  value1?: string; // Product name or ID
  value2?: string; // Additional field
  value3?: string; // Additional field
  value4?: string; // Additional field
}

export interface ShurjoPayTransaction {
  checkout_url: string; // Checkout URL for payment execution
  amount: number; // Amount the customer is going to pay
  currency: string; // Currency in which the customer is going to pay
  sp_order_id: string; // ShurjoPay payment ID
  customer_order_id: string; // Merchant-generated order ID
  customer_name: string; // Customer's name
  customer_address: string; // Customer's address
  customer_city: string; // Customer's city
  customer_phone: string; // Customer's phone number
  customer_email: string; // Customer's email
  client_ip: string; // IP address of customer's device
  intent: string; // Purpose of the payment (e.g., Sale, Service)
  transactionStatus: string; // State of the payment
}

export interface ShurjoPayVerificationResponse {
  id: number; // Unique identification
  order_id: string; // ShurjoPay payment ID from callback
  currency: string; // Currency used in the transaction
  amount: number; // Amount paid by the customer
  payable_amount: number; // Total payable amount
  discount_amount: number; // Total discounted amount
  disc_percent: number; // Discount percentage
  received_amount: number; // Amount received by ShurjoPay
  usd_amt: number; // Amount in USD if paid in another currency
  usd_rate: number; // USD to BDT conversion rate at time of payment
  method: string; // Payment method (e.g., bank card, mobile wallet)
  sp_message: string; // Response message (e.g., "1000" for success)
  sp_code: number; // Response code (e.g., 1000, 1001, etc.)
  name: string; // Customer name
  email: string; // Customer email
  address: string; // Customer address
  city: string; // Customer city
  value1: string; // Additional field (e.g., product/service name or ID)
  value2: string; // Additional field
  value3: string; // Additional field
  value4: string; // Additional field
}

export interface SPToken {
  token: string;
  token_type: string;
  token_create_time: string;
  token_valid_duration: number;
}

export interface Credentials {
  root_url: string;
  merchant_username: string;
  merchant_password: string;
  merchant_key_prefix: string;
  return_url: string;
  token_url: string;
  verification_url: string;
  payment_status_url: string;
}
