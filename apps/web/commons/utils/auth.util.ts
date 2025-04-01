import { AuthError } from "next-auth";
import { MessageCode } from "../constants/codes/message-codes.enum";

export class CustomAuthError extends AuthError {
  static readonly type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}

export class InvalidEmailPasswordError extends AuthError {
  static type = MessageCode.USERNAME_OR_PASSWORD_INVALID;
}

export class InactiveAccount extends AuthError {
  static type = MessageCode.INACTIVE_ACCOUNT;
}

export class AccountLocked extends AuthError {
  static type = MessageCode.ACCOUNT_LOCKED;
}

export class UserNotFound extends AuthError {
  static type = MessageCode.USER_NOT_FOUND;
}

export class UserNotChangePassword extends AuthError {
  static type = MessageCode.CHANGE_PASSWORD;
}
