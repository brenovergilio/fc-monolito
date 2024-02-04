import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItems from "../domain/invoice-items";
import InvoiceGateway from "../gateway/invoice.gateway";
import AddressModel from "./address.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async create(invoice: Invoice): Promise<void> {
    const transaction = await InvoiceModel.sequelize.transaction();

    try {
      await InvoiceModel.create({
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document
      }, {
        transaction
      });

      await Promise.all([
        AddressModel.create({
        id: invoice.address.id.id,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        invoice_id: invoice.id.id
      }, {
        transaction
      }),
      InvoiceItemModel.bulkCreate(
        invoice.invoiceItems.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
          invoice_id: invoice.id.id  
        }
      }), {
        transaction
      })]);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: {
        id
      },
      include: [
        {
          model: InvoiceItemModel,
        }, {
          model: AddressModel,
        }
      ]
    });

    if(!invoice) {
      throw new Error("Invoice not found");
    }

    const invoiceObj = invoice.toJSON();

    const domainAddress = 
      invoiceObj.address ? new Address(
        invoiceObj.address?.street,
        invoiceObj.address?.number,
        invoiceObj.address?.complement,
        invoiceObj.address?.city,
        invoiceObj.address?.state,
        invoiceObj.address?.zipCode
      ) : null;

    const domainInvoiceItems = invoiceObj.invoice_items?.map((item: InvoiceItemModel) => {
      return new InvoiceItems({
        id: new Id(item.id),
        name: item.name,
        price: item.price
      });
    });

    return new Invoice({
      id: new Id(invoiceObj.id),
      name: invoiceObj.name,
      document: invoiceObj.document,
      address: domainAddress,
      items: domainInvoiceItems
    });
  }
}