import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private readonly invoiceGateway: InvoiceGateway) {}

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address(
        input.street,
        input.number,
        input.complement,
        input.city,
        input.state,
        input.zipCode
      ),
      items: input.items?.map((item) => new InvoiceItems({
        id: new Id(item.id),
        name: item.name,
        price: item.price
      }))
    });

    await this.invoiceGateway.create(invoice);

    return {
      id: invoice.id.id,
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state:  input.state,
      zipCode: input.zipCode,
      items: input.items,
      total: invoice.getTotal()
    }
  }
}