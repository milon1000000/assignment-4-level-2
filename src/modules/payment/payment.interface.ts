export interface CreatePaymentPayload {
  rentalOrderId: string;
}

export interface ConfirmPaymentPayload {
  sessionId: string;
}