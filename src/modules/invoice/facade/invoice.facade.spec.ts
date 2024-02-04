import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "../repository/invoice.model"
import InvoiceItemModel from "../repository/invoice-item.model"
import AddressModel from "../repository/address.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("Invoice Facade tests", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel, AddressModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  describe("Generate invoice tests", () => {
    it("should generate an invoice", async () => {
      const sut = InvoiceFacadeFactory.create();

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

      const newInvoice = await sut.generate(input);

      expect(newInvoice).toBeDefined();
      expect(newInvoice.id).toBeDefined();
      expect(newInvoice.name).toBe("invoice");
      expect(newInvoice.document).toBe("123456789");
      expect(newInvoice.street).toBe("street");
      expect(newInvoice.number).toBe("123");
      expect(newInvoice.complement).toBe("complement");
      expect(newInvoice.city).toBe("city");
      expect(newInvoice.state).toBe("state");
      expect(newInvoice.zipCode).toBe("zipcode");
      expect(newInvoice.items.length).toBe(2);
      expect(newInvoice.items[0].id).toBe("1");
      expect(newInvoice.items[0].name).toBe("item1");
      expect(newInvoice.items[0].price).toBe(12.00);
      expect(newInvoice.items[1].id).toBe("2");
      expect(newInvoice.items[1].name).toBe("item2");
      expect(newInvoice.items[1].price).toBe(14.00);
      expect(newInvoice.total).toBe(26.00);
    })
  });

  describe("Find invoice test", () => {
    it("should find an invoice", async () => {
      const sut = InvoiceFacadeFactory.create();

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

      const newInvoice = await sut.generate(input);

      const result = await sut.find({
        id: newInvoice.id
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe("invoice");
      expect(result.document).toBe("123456789");
      expect(result.address.street).toBe("street");
      expect(result.address.number).toBe("123");
      expect(result.address.complement).toBe("complement");
      expect(result.address.city).toBe("city");
      expect(result.address.state).toBe("state");
      expect(result.address.zipCode).toBe("zipcode");
      expect(result.items.length).toBe(2);
      expect(result.items[0].id).toBe("1");
      expect(result.items[0].name).toBe("item1");
      expect(result.items[0].price).toBe(12.00);
      expect(result.items[1].id).toBe("2");
      expect(result.items[1].name).toBe("item2");
      expect(result.items[1].price).toBe(14.00);
      expect(result.total).toBe(26.00);
    })
  })
})