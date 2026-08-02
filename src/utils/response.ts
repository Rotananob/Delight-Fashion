import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * Standardized success response for API endpoints and Server Actions.
 */
export function sendSuccess<T>(data: T, message = "Success", status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * Standardized error response for API endpoints and Server Actions.
 */
export function sendError(message = "An unexpected error occurred", status = 500, error?: unknown): NextResponse<ApiResponse<null>> {
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;
  
  return NextResponse.json(
    {
      success: false,
      message,
      error: errorMessage,
      code: status,
    },
    { status }
  );
}

/**
 * Helper to wrap Server Actions and return typed Action results.
 */
export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export function actionSuccess<T>(data: T, message = "Success"): ActionResult<T> {
  return { success: true, message, data };
}

export function actionError(message = "Action failed", error?: unknown): ActionResult<null> {
  const errorMsg = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;
  return { success: false, message, error: errorMsg };
}
