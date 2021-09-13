import { CustomError } from "./custom-error";

export class DatabataseConnectionError extends CustomError {
  reason = "Error connection to database";
  statusCode = 500;
  constructor() {
    super("Database Error");
    Object.setPrototypeOf(this, DatabataseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
