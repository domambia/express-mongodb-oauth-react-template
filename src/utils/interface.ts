import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Express.User;
    }
  }
}
