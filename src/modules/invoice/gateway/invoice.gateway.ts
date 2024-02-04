import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
  find(id: string): Promise<Invoice>;
  create(invoice: Invoice): Promise<void>;
}