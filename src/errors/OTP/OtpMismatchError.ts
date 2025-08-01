
import { BaseError } from "../BaseErrors";

export class OtpMismatchError extends BaseError {
  constructor() {
    super(400, "OTP kodu eşleşmiyor.")
  }
}
