import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "invoice",
  document: "123456789",
  address: new Address("street", "123", "complement", "city", "state", "zipcode"),
  items: [
    new InvoiceItems({
      name: "invoiceItem1",
      price: 10.00
    }),
    new InvoiceItems({
      name: "invoiceItem2",
      price: 12.00
    }),
  ]
});

const mockRepository = () => {
  return {
    find: jest.fn().mockResolvedValue(invoice),
    create: jest.fn()
  }
}

describe("Find Invoice use case unit tests", () => {
  it("should return an invoice", async () => {
    const repository = mockRepository();
    const findSpy = jest.spyOn(repository, 'find');
    const sut = new FindInvoiceUseCase(repository);

    const result = await sut.execute({id: "1"});

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledWith("1");

    expect(result).toBeDefined();
    expect(result.id).toBe("1");
    expect(result.name).toBe("invoice");
    expect(result.document).toBe("123456789");
    expect(result.address).toBeDefined();
    expect(result.address.street).toBe("street");
    expect(result.address.number).toBe("123");
    expect(result.address.complement).toBe("complement");
    expect(result.address.city).toBe("city");
    expect(result.address.state).toBe("state");
    expect(result.address.zipCode).toBe("zipcode");
    expect(result.items.length).toBe(2);
    expect(result.items[0].name).toBe("invoiceItem1");
    expect(result.items[0].price).toBe(10.00);
    expect(result.items[1].name).toBe("invoiceItem2");
    expect(result.items[1].price).toBe(12.00);
    expect(result.total).toBe(22.00);
  })
})