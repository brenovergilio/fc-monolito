import { Column, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";
import AddressModel from "./address.model";

@Table({
  tableName: "invoice",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @HasOne(() => AddressModel)
  address: ReturnType<() => AddressModel>;

  @HasMany(() => InvoiceItemModel)
  invoice_items: InvoiceItemModel[];
}