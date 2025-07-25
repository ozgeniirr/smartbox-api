import { BaseError } from "../BaseErrors";

export class SmartboxNotFoundError extends BaseError {
  constructor() {
    super(404, "SmartBox bulunamadı");
  }
}
