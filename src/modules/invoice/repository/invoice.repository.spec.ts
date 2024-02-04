import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import AddressModel from "./address.model";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items";
import Invoice from "../domain/invoice";
import InvoiceRepository from "./invoice.repository";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Invoice repository tests", () => {
  let sequelize: Sequelize
  let sut: InvoiceRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel, AddressModel])
    await sequelize.sync()

    sut = new InvoiceRepository();
  })

  afterEach(async () => {
    await sequelize.close()
  })

  describe("create method", () => {
    it("should create an invoice", async () => {
      const address = new Address("street", "123", "complement", "city", "state", "zipcode");
      const invoiceItems = [
        new InvoiceItems({
          name: "invoiceitem1",
          price: 10.00
        }),
        new InvoiceItems({
          name: "invoiceitem2",
          price: 12.00
        }),
      ];
      const invoiceModel = new Invoice({
        id: new Id("1"),
        name: "invoice",
        document: "123456789",
        address,
        items: invoiceItems
      });
  
      await sut.create(invoiceModel);
  
      const result = await InvoiceModel.findOne({
        where: {
          id: "1"
        },
        include: [
          {
            model: InvoiceItemModel
          },
          {
            model: AddressModel
          }
        ]
      });
  
      const resultObj = result.toJSON();
  
      expect(result).toBeDefined();
      expect(resultObj.id).toBe("1");
      expect(resultObj.name).toBe("invoice");
      expect(resultObj.document).toBe("123456789");
      expect(resultObj.address).toBeDefined();
      expect(resultObj.address.street).toBe("street");
      expect(resultObj.address.number).toBe("123");
      expect(resultObj.address.complement).toBe("complement");
      expect(resultObj.address.city).toBe("city");
      expect(resultObj.address.state).toBe("state");
      expect(resultObj.address.zipCode).toBe("zipcode");
      expect(resultObj.invoice_items.length).toBe(2);
      expect(resultObj.invoice_items[0].name).toBe("invoiceitem1");
      expect(resultObj.invoice_items[0].price).toBe(10.00);
      expect(resultObj.invoice_items[1].name).toBe("invoiceitem2");
      expect(resultObj.invoice_items[1].price).toBe(12.00);
    });
  })

  describe("find method", () => {
    it("should find an invoice", async () => {
      const address = new Address("street", "123", "complement", "city", "state", "zipcode");
      const invoiceItems = [
        new InvoiceItems({
          name: "invoiceitem1",
          price: 10.00
        }),
        new InvoiceItems({
          name: "invoiceitem2",
          price: 12.00
        }),
      ];
      const invoiceModel = new Invoice({
        id: new Id("1"),
        name: "invoice",
        document: "123456789",
        address,
        items: invoiceItems
      });
  
      await sut.create(invoiceModel);
  
      const result = await sut.find(invoiceModel.id.id);
  
      expect(result).toBeDefined();
      expect(result.id.id).toBe("1");
      expect(result.name).toBe("invoice");
      expect(result.document).toBe("123456789");
      expect(result.address).toBeDefined();
      expect(result.address.street).toBe("street");
      expect(result.address.number).toBe("123");
      expect(result.address.complement).toBe("complement");
      expect(result.address.city).toBe("city");
      expect(result.address.state).toBe("state");
      expect(result.address.zipCode).toBe("zipcode");
      expect(result.invoiceItems.length).toBe(2);
      expect(result.invoiceItems[0].name).toBe("invoiceitem1");
      expect(result.invoiceItems[0].price).toBe(10.00);
      expect(result.invoiceItems[1].name).toBe("invoiceitem2");
      expect(result.invoiceItems[1].price).toBe(12.00);
    });
  
    it("should throw an error if there is not invoice", async () => {
      await expect(async () => sut.find("invalidId")).rejects.toThrow("Invoice not found");
    });
  })
});