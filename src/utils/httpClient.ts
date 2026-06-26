import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.REQRES_API_KEY;
if (!apiKey) {
  throw new Error(
    'REQRES_API_KEY is not set. Copy .env.example to .env and add your key from https://app.reqres.in'
  );
}

const httpClient: AxiosInstance = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  },
  timeout: 10000,
  // Never throw on any HTTP status — let tests assert on status codes directly
  validateStatus: () => true,
});

export default httpClient;
