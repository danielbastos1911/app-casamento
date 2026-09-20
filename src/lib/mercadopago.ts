import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";

const client = new MercadoPagoConfig({
  accessToken,
  options: { timeout: 5000 },
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

export function isTestCredential() {
  return accessToken.startsWith("TEST-");
}
