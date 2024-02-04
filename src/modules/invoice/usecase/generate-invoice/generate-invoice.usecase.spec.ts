import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const mockRepository = () => {
  return {
    find: jest.fn(),
    create: jest.fn()
  }
}

describe("Generate invoice use case test", () => {
  it("should create an invoice", async () => {
    const repository = mockRepository();
    const sut = new GenerateInvoiceUseCase(repository);

    const createSpy = jest.spyOn(repository, 'create');

    const input = {
      name: "invoice",
      document: "123456789",
      street: "street",
      number: "123",
      complement: "complement",
      city: "city",
      state:  "state",
      zipCode: "zipcode",
      items: [
      {
        id: "1",
        name: "item1",
        price: 12.00
      },
      {
        id: "2",
        name: "item2",
        price: 14.00
      }]
    };

    const result = await sut.execute(input);

    expect(createSpy).toHaveBeenCalledTimes(1);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe("invoice");
    expect(result.document).toBe("123456789");
    expect(result.street).toBe("street");
    expect(result.number).toBe("123");
    expect(result.complement).toBe("complement");
    expect(result.city).toBe("city");
    expect(result.state).toBe("state");
    expect(result.zipCode).toBe("zipcode");
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("item1");
    expect(result.items[0].price).toBe(12.00);
    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("item2");
    expect(result.items[1].price).toBe(14.00);
    expect(result.total).toBe(26.00);
  })
});