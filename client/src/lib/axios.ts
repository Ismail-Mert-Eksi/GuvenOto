// src/lib/axios.ts
import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// DİZİLERİ: a=1&a=2 formatında seri hale getir
const serializeParams = (params: Record<string, any>) => {
  const usp = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      val.forEach((v) => {
        if (v !== undefined && v !== null && v !== '') usp.append(key, String(v));
      });
    } else if (val !== undefined && val !== null && val !== '') {
      usp.append(key, String(val));
    }
  });
  return usp.toString();
};

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  paramsSerializer: { serialize: serializeParams },
});

export const apiPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  paramsSerializer: { serialize: serializeParams },
});
