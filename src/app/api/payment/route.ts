import { NextResponse } from "next/server";

// Define the shape of allowed response data
export type ResponseData =
  | Record<string, unknown>
  | object
  | unknown[]
  | string
  | number
  | boolean
  | null;

// Success response structure
interface SuccessBody {
  success: true;
  message: string;
  data?: ResponseData;
}

// Error response structure
interface ErrorBody {
  success: false;
  error: string;
}

// 🔒 Internal core response builder for success
function jsonResponse(
  data: ResponseData,
  status: number = 200,
  message: string = "Success"
): NextResponse {
  const body: SuccessBody = { success: true, message };

  if (data !== null && typeof data !== "undefined") {
    body.data = data;
  }

  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// 🔒 Internal core response builder for errors
function errorResponse(message: string, status: number = 400): NextResponse {
  const body: ErrorBody = { success: false, error: message };

  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ✅ Public semantic helpers for success
export const ok = (data: ResponseData, message = "Success") =>
  jsonResponse(data, 200, message);

export const created = (data: ResponseData, message = "Created") =>
  jsonResponse(data, 201, message);

export const uploaded = (data: ResponseData, message = "Uploaded") =>
  jsonResponse(data, 200, message);

// ✅ Public semantic helpers for errors
export const badRequest = (message = "Bad Request") =>
  errorResponse(message, 400);

export const unauthorized = (message = "Unauthorized") =>
  errorResponse(message, 401);

export const notFound = (message = "Not Found") => errorResponse(message, 404);

export const serverError = (message = "Something went wrong") =>
  errorResponse(message, 500);

export const conflict = (message = "Conflict") => errorResponse(message, 409);
