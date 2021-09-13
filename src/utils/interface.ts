import express from "express";

export interface UserPayload {
  id: string;
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
  created_at: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
