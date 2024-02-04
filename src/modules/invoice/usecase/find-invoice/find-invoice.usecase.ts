import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  constructor(private readonly invoiceGateway: InvoiceGateway) {}

  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this.invoiceGateway.find(input.id);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: invoice.address,
      items: invoice.invoiceItems.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      total: invoice.getTotal(),
      createdAt: invoice.createdAt
    }
  }
}