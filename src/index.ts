/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import moment from "moment";
import { createLogger, format, transports, Logger } from "winston";
import { ShurjoPayTransaction, ShurjoPayVerificationResponse } from "./types";
const { combine, timestamp, label, printf } = format;

interface TokenData {
  token: string;
  token_type: string;
  TokenCreateTime: string;
  expires_in: number;
}

interface SPToken {
  token: string;
  token_type: string;
  token_create_time: string;
  token_valid_duration: number;
}

interface Credentials {
  root_url: string;
  merchant_username: string;
  merchant_password: string;
  merchant_key_prefix: string;
  return_url: string;
  token_url: string;
  verification_url: string;
  payment_status_url: string;
}

interface CheckoutParams {
  [key: string]: any;
}

interface PaymentResponse {
  [key: string]: any;
}

interface VerifyResponse {
  [key: string]: any;
}

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Tracking error in log file
const logger: Logger = createLogger({
  format: combine(label({ label: "shurjopay" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "shurjopay-plugin.log" }),
  ],
});

function randomString(length: number): string {
  return Math.round(
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
  )
    .toString(36)
    .slice(1);
}

class Shurjopay {
  private data: {
    sp_token?: SPToken;
  } = {};
  private credentials!: Credentials;

  constructor() {
    this.randomString = randomString.bind(this);
    this.log = this.log.bind(this);
    this.config = this.config.bind(this);
    this.authentication = this.authentication.bind(this);
    this.makePayment = this.makePayment.bind(this);
    this.verifyPayment = this.verifyPayment.bind(this);
    this.paymentStatus = this.paymentStatus.bind(this);
    this.token_valid = this.token_valid.bind(this);
  }

  public randomString: (length: number) => string;

  public log(message: string, level: string = "info"): void {
    logger.log({
      level: level,
      message: message,
    });
  }

  public config(
    root_url: string,
    merchant_username: string,
    merchant_password: string,
    merchant_key_prefix: string,
    return_url: string
  ): void {
    this.credentials = {
      root_url,
      merchant_username,
      merchant_password,
      merchant_key_prefix,
      return_url,
      get token_url(): string {
        return this.root_url + "/api/get_token";
      },
      get verification_url(): string {
        return this.root_url + "/api/verification";
      },
      get payment_status_url(): string {
        return this.root_url + "/api/payment-status";
      },
    };
  }

  public async authentication(callback: (data: any) => void): Promise<void> {
    try {
      const response = await axios.post(this.credentials.token_url, {
        username: this.credentials.merchant_username,
        password: this.credentials.merchant_password,
      });

      this.data.sp_token = {
        token: response.data.token,
        token_type: response.data.token_type,
        token_create_time: response.data.TokenCreateTime,
        token_valid_duration: response.data.expires_in,
      };
      callback(response.data);
    } catch (error) {
      this.log(
        "Did not receive auth token from shurjopay. Check your credentials.",
        "error"
      );
    }
  }

  public async makePayment(
    checkout_params: CheckoutParams
  ): Promise<ShurjoPayTransaction> {
    try {
      const authData = await new Promise<any>((resolve) => {
        this.authentication(resolve);
      });

      const response = await axios.post(authData.execute_url, {
        ...checkout_params,
        prefix: this.credentials.merchant_key_prefix,
        store_id: authData.store_id,
        token: authData.token,
        return_url: this.credentials.return_url,
        cancel_url: this.credentials.return_url,
      });

      return response.data;
    } catch (checkout_error) {
      this.log(
        "Error occurred while making payment: " +
          (checkout_error as AxiosError).message,
        "error"
      );
      throw new Error("Error occurred while making payment");
    }
  }

  public async verifyPayment(
    order_id: string
  ): Promise<ShurjoPayVerificationResponse> {
    try {
      const authData = await new Promise<any>((resolve) => {
        this.authentication(resolve);
      });

      const response = await axios({
        method: "post",
        url: this.credentials.verification_url,
        headers: {
          "content-type": "application/json",
          Authorization: authData.token_type + " " + authData.token,
        },
        data: { order_id: order_id },
      });

      return response.data;
    } catch (verify_error) {
      this.log(
        "Error occurred while verifying payment: " +
          (verify_error as AxiosError).message,
        "error"
      );
      throw new Error("Error occurred while verifying payment");
    }
  }

  public async paymentStatus(order_id: string): Promise<void> {
    try {
      const authData = await new Promise<any>((resolve) => {
        this.authentication(resolve);
      });

      const response = await axios({
        method: "post",
        url: this.credentials.payment_status_url,
        headers: {
          "content-type": "application/json",
          Authorization: authData.token_type + " " + authData.token,
        },
        data: { order_id: order_id },
      });

      return response.data;
    } catch (verify_error) {
      this.log(
        "Error occurred while fetching payment status: " +
          (verify_error as AxiosError).message,
        "error"
      );
      throw new Error("Error occurred while fetching payment status");
    }
  }

  public token_valid(): boolean {
    if (!this.data.sp_token) return false;

    const create_time_obj = moment(
      this.data.sp_token.token_create_time,
      "YYYY-MM-DD hh:mm:ssa"
    );
    const dur_seconds = moment().diff(create_time_obj, "seconds");
    return dur_seconds < this.data.sp_token.token_valid_duration;
  }
}

export default Shurjopay;
